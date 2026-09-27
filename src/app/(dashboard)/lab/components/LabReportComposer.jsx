"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import api from "../../../../utils/axiosInstance";

const getTests = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [value]; } catch { return [value]; }
  }
  return [];
};

const templateMatches = (template, testName) => {
  const name = String(template.name || "").toLowerCase();
  const test = String(testName || "").toLowerCase();
  return Boolean(test && (name.includes(test) || test.includes(name)));
};

export default function LabReportComposer({ requestId }) {
  const router = useRouter();
  const reportRef = useRef(null);
  const [request, setRequest] = useState(null);
  const [labProfile, setLabProfile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [values, setValues] = useState({});
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [requestResponse, templatesResponse] = await Promise.all([
          api.get(`/api/lab-requests/${requestId}`),
          api.get("/api/labs/templates"),
        ]);
        const profileResponse = await api.get("/api/labs/getLabProfile");
        const requestData = requestResponse.data?.data || {};
        const labProfile = profileResponse.data?.data || {};
        const summaries = templatesResponse.data?.data || [];
        const testName = getTests(requestData.requested_tests || requestData.requestedTests)[0] || "";
        const matching = summaries.find((item) => templateMatches(item, testName)) || summaries[0];
        const detailResponse = matching ? await api.get(`/api/labs/templates/${encodeURIComponent(matching.templateKey || matching.id)}`) : null;
        const detail = detailResponse?.data?.data || null;
        if (!mounted) return;
        setRequest(requestData);
        setLabProfile(labProfile);
        setTemplates(summaries);
        setTemplate(detail ? {
          ...detail,
          commonLayout: {
            ...(detail.commonLayout || {}),
            labName: labProfile.lab_name || detail.commonLayout?.labName,
            registrationNumber: labProfile.registration_number || detail.commonLayout?.registrationNumber,
            phoneNumber: labProfile.phone_number || detail.commonLayout?.phoneNumber,
            address: labProfile.address || detail.commonLayout?.address,
          },
        } : detail);
        setSelectedTemplateKey(matching?.templateKey || matching?.id || "");
        setTemplateDialogOpen(true);
        setValues(Object.fromEntries((detail?.pages || []).flatMap((page) => (page.fields || []).map((field) => [field.id, field.result || ""]))));
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || "Unable to load report details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [requestId]);

  const selectTemplate = async (templateKey) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/labs/templates/${encodeURIComponent(templateKey)}`);
      const detail = response.data?.data;
      setTemplate({
        ...detail,
        commonLayout: {
          ...(detail.commonLayout || {}),
          labName: labProfile?.lab_name || detail.commonLayout?.labName,
          registrationNumber: labProfile?.registration_number || detail.commonLayout?.registrationNumber,
          phoneNumber: labProfile?.phone_number || detail.commonLayout?.phoneNumber,
          address: labProfile?.address || detail.commonLayout?.address,
        },
      });
      setSelectedTemplateKey(templateKey);
      setTemplateDialogOpen(false);
      setValues(Object.fromEntries((detail?.pages || []).flatMap((page) => (page.fields || []).map((field) => [field.id, field.result || ""]))));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load selected template.");
    } finally {
      setLoading(false);
    }
  };

  const createPdfBlob = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    return html2pdf().from(reportRef.current).set({
      margin: 0,
      filename: `${request.order_id || request.orderId || requestId}-report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).outputPdf("blob");
  };

  const uploadPdf = async (pdfBlob, preservePrevious = false) => {
    const fileName = `${request.order_id || request.orderId || requestId}-report.pdf`;
    const formData = new FormData();
    formData.append("file", new File([pdfBlob], fileName, { type: "application/pdf" }));
    formData.append("testRequestId", request.id || requestId);
    if (preservePrevious) formData.append("preservePrevious", "true");
    return api.post("/api/lab-reports/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
  };

  const submitReport = async () => {
    if (!reportRef.current || !request || !template) return;
    try {
      setSubmitting(true);
      const firstUpload = await uploadPdf(await createPdfBlob());
      const reportId = firstUpload.data?.data?.reportId;
      if (reportId) {
        const reportResponse = await api.get(`/api/lab-reports/${reportId}`);
        const downloadUrl = reportResponse.data?.data?.downloadUrl;
        if (downloadUrl) {
          const QRious = (await import("qrious")).default;
          setQrDataUrl(new QRious({ value: downloadUrl, size: 120, level: "H" }).toDataURL());
          await new Promise((resolve) => setTimeout(resolve, 100));
          await uploadPdf(await createPdfBlob(), true);
        }
      }
      setNotice("Report submitted. Patient and doctor will be notified.");
      setTimeout(() => router.back(), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !template) return <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>;
  if (error && !template) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  const common = template?.commonLayout || {};
  const tests = getTests(request?.requested_tests || request?.requestedTests);

  return (
    <Box className="lab-composer-shell">
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1.5} sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackOutlined />} onClick={() => router.back()} sx={{ alignSelf: "flex-start", textTransform: "none" }}>Back to test requests</Button>
        <Button startIcon={<PictureAsPdfOutlined />} onClick={submitReport} disabled={submitting || !template} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>{submitting ? "Submitting..." : "Submit report"}</Button>
      </Stack>
      {error ? <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert> : null}
      {notice ? <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert> : null}
      <Dialog open={templateDialogOpen} onClose={() => router.back()} maxWidth="sm" fullWidth>
        <DialogTitle>Select report template</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
          <Typography sx={{ fontSize: 13, color: "#475467" }}>Test: {tests.join(", ") || request?.test_name || "Requested test"}</Typography>
          <Select size="small" value={selectedTemplateKey} onChange={(event) => setSelectedTemplateKey(event.target.value)}>
            {templates.map((item) => <MenuItem key={item.templateKey || item.id} value={item.templateKey || item.id}>{item.name}</MenuItem>)}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.back()} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button onClick={() => selectTemplate(selectedTemplateKey)} disabled={!selectedTemplateKey || loading} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>Open template</Button>
        </DialogActions>
      </Dialog>
      <Paper ref={reportRef} className="lab-template-page lab-composer-page" elevation={2}>
        <Box className="lab-template-top-rule" />
        <Box className="lab-template-brand"><Box className="lab-template-mark">{common.brandMark || "LAB"}</Box><Box><Typography className="lab-template-brand-name">{common.labName || "YOUR LAB NAME"}</Typography><Typography className="lab-template-brand-caption">{common.tagline || "ACCURATE & AFFORDABLE ALWAYS"}</Typography></Box></Box>
        {(common.registrationNumber || common.phoneNumber || common.address) ? <Box className="lab-template-contact"><span>{common.registrationNumber ? `Reg. No.: ${common.registrationNumber}` : ""}</span><span>{common.phoneNumber ? `Phone: ${common.phoneNumber}` : ""}</span><span>{common.address || ""}</span></Box> : null}
        <Box className="lab-template-title">{common.reportTitle || "TEST REPORT"}</Box>
        <Box className="lab-template-patient-grid"><PatientLine label="Name" value={request?.patient_name || request?.patientName || request?.patient_id || "-"} /><PatientLine label="Reg. No." value={request?.order_id || request?.orderId || "-"} /><PatientLine label="Age & Sex" value={request?.patient_age_sex || request?.patientAgeSex || "-"} /><PatientLine label="Reg. Date" value={request?.created_at || request?.createdAt || "-"} /><PatientLine label="Referred By" value={request?.doctor_name || request?.doctorName || request?.doctor_id || "-"} /><PatientLine label="Sample" value={request?.sample_type || request?.sampleType || "-"} /><PatientLine label="Tests" value={tests.join(", ") || "-"} /></Box>
        {(template.pages || []).map((page) => <Box key={page.id} className="lab-composer-section"><Box className="lab-template-panel-title">{page.panelTitle}</Box>{page.sampleType ? <Typography className="lab-template-sample-type"><b>Sample Type:</b> {page.sampleType}</Typography> : null}{page.instructions ? <Typography className="lab-template-method-note">{page.instructions}</Typography> : null}<Box className="lab-template-columns lab-composer-columns"><Box>Parameter</Box><Box>Result</Box><Box>Bio. Ref. Interval</Box><Box>Units</Box><Box>Method</Box></Box>{(page.fields || []).map((field) => <Box key={field.id} className="lab-template-result-row lab-composer-row"><span>{field.parameter}</span><TextField size="small" variant="standard" value={values[field.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))} placeholder="Result" /><span>{field.referenceInterval}</span><span>{field.unit}</span><span>{field.method}</span></Box>)}{(page.tableBlocks || []).map((table) => <Box key={table.id} className="lab-template-custom-table-wrap"><Typography className="lab-template-custom-table-title">{table.title}</Typography><Box className="lab-template-custom-table">{(table.rows || []).map((row, rowIndex) => <Box key={`${table.id}-${rowIndex}`} className={`lab-template-custom-table-row${rowIndex === 0 ? " lab-template-custom-table-header" : ""}`} sx={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>{row.map((cell, cellIndex) => <Box key={`${table.id}-${rowIndex}-${cellIndex}`} className="lab-template-custom-table-cell">{cell}</Box>)}</Box>)}</Box></Box>)}</Box>)}
        <Box className="lab-template-footer"><Box className="lab-template-authenticated"><Typography className="lab-template-auth-note">{common.authenticationText || "This is an electronically authenticated report."}</Typography>{qrDataUrl ? <img src={qrDataUrl} alt="Report verification QR code" width="72" height="72" /> : null}</Box><Box className="lab-template-approval"><Typography><b>Approved By:</b> {common.approvedBy || "Lab Pathologist"}</Typography><Typography>{common.qualification || "Qualification / Registration No."}</Typography></Box><Typography className="lab-template-page-number">Authorized report</Typography></Box>
      </Paper>
      <Button startIcon={<PictureAsPdfOutlined />} onClick={submitReport} disabled={submitting || !template} variant="contained" sx={{ display: "flex", ml: "auto", mr: 0, mt: 2, textTransform: "none", bgcolor: "#07876A" }}>{submitting ? "Submitting..." : "Submit report"}</Button>
      <style jsx global>{`.lab-composer-shell{min-height:100vh;padding:24px;background:#F8FAFC}.lab-composer-page{min-width:680px;max-width:900px;margin:0 auto;padding:20px 42px 74px;overflow:visible;color:#171717;background:#fff;font-family:Georgia,'Times New Roman',serif;box-sizing:border-box}.lab-template-top-rule{height:7px;margin:-20px -42px 20px;background:linear-gradient(90deg,#087c70 0 18%,#20a898 18% 100%)}.lab-template-brand{display:flex;justify-content:flex-end;align-items:center;gap:10px;min-height:74px;color:#12658a}.lab-template-mark{display:grid;place-items:center;width:44px;height:44px;border:2px solid #12658a;border-radius:50%;font:800 14px Arial}.lab-template-brand-name{color:#12658a;font:700 23px/1 Arial,sans-serif;white-space:nowrap}.lab-template-brand-caption{margin-top:4px;color:#264958;font:700 9px/1.2 Arial,sans-serif;text-align:right;letter-spacing:.6px}.lab-template-contact{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:4px 14px;color:#264958;font:10px/1.35 Arial;text-align:right}.lab-template-title{margin-top:20px;padding:8px 0;border-top:2px solid #303030;border-bottom:2px solid #303030;text-align:center;font-size:20px;font-weight:700}.lab-template-patient-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:9px 30px;padding:16px 0 22px}.lab-template-patient-line{display:grid;grid-template-columns:105px 12px minmax(0,1fr);gap:5px;font:14px/1.35 Georgia}.lab-template-patient-line:before{content:':' ;grid-column:2}.lab-template-patient-line span{grid-column:1}.lab-template-patient-line b{grid-column:3;font-weight:600}.lab-template-panel-title{display:grid;place-items:center;min-height:35px;margin:0 -10px 7px;border-radius:20px;background:#c7c7c7;color:#111;font-size:15px;font-weight:700;text-align:center}.lab-template-sample-type{margin:0 0 9px;font-size:13px}.lab-template-method-note{margin:0 0 18px;font:700 13px/1.55 Georgia}.lab-template-columns,.lab-template-result-row{display:grid;grid-template-columns:minmax(0,2.3fr) minmax(132px,1.2fr) minmax(100px,1.25fr) minmax(58px,.8fr) minmax(90px,1fr);column-gap:12px;align-items:center}.lab-template-columns{margin-bottom:5px}.lab-template-columns>*{min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;font-size:11px;font-weight:700;white-space:nowrap}.lab-template-result-row{min-height:27px;padding:0 9px;font-size:12.7px;line-height:1.25}.lab-template-result-row>*{min-width:0;overflow-wrap:anywhere}.lab-composer-row .MuiInputBase-root{font:inherit}.lab-template-custom-table-wrap{margin:16px 9px}.lab-template-custom-table{display:grid}.lab-template-custom-table-row{display:grid;column-gap:12px;align-items:center;min-height:27px;padding:0 9px}.lab-template-custom-table-header{margin-bottom:5px}.lab-template-custom-table-header .lab-template-custom-table-cell{min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;font-weight:700}.lab-template-custom-table-cell{min-width:0;overflow-wrap:anywhere}.lab-template-footer{display:grid;grid-template-columns:1fr 1.25fr;gap:8px 18px;align-items:end;margin-top:36px;padding-top:9px;border-top:2px solid #303030}.lab-template-auth-note{font-size:10px;text-align:center}.lab-template-approval{display:grid;gap:5px;font-size:10px}.lab-template-page-number{grid-column:2;margin-top:15px;font-size:10px;text-align:right}@media(max-width:700px){.lab-composer-shell{padding:10px}.lab-composer-page{padding-right:24px;padding-left:24px}.lab-template-top-rule{margin-right:-24px;margin-left:-24px}}@media print{.lab-composer-shell{padding:0}.lab-composer-page{width:210mm;min-width:0;max-width:none;min-height:297mm;overflow:hidden;box-shadow:none;break-after:page}}`}</style>
    </Box>
  );
}

function PatientLine({ label, value }) {
  return <Typography className="lab-template-patient-line"><span>{label}</span><b>{value}</b></Typography>;
}
