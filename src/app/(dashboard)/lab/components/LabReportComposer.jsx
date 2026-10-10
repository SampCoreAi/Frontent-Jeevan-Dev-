"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import {
  AddOutlined,
  CloseOutlined,
  DeleteOutline,
  EditOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import api from "../../../../utils/axiosInstance";
import LabReportPage, {
  CreateTableDialog,
  LabReportEditActions,
  createReportColumn as newColumn,
  createReportField as newField,
  createReportPage,
  createReportTable as newTableBlock,
  createReportTextBlock as newTextBlock,
  paginateReportPage,
} from "./LabReportPage";

const ACTIVE_TEMPLATE_PREFIX = "lab-active-report-template-v1";

const normalizeTemplateDetail = (detail, labProfile) => {
  const layout = detail?.layout || {};
  const commonLayout = detail?.commonLayout || layout.commonLayout || {};
  return {
    ...detail,
    ...layout,
    commonLayout: {
      ...commonLayout,
      labName: labProfile?.lab_name || commonLayout.labName,
      registrationNumber:
        labProfile?.registration_number || commonLayout.registrationNumber,
      phoneNumber: labProfile?.phone_number || commonLayout.phoneNumber,
      address: labProfile?.address || commonLayout.address,
    },
  };
};

const getTests = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return [];
};

const getPatientAgeAndSex = (request) => {
  const combined = request?.patient_age_sex || request?.patientAgeSex;
  if (combined) return combined;

  const age = request?.patient_age ?? request?.patientAge ?? request?.age;
  const sex =
    request?.patient_gender ??
    request?.patientGender ??
    request?.gender ??
    request?.sex;
  return (
    [age, sex]
      .filter((value) => value !== null && value !== undefined && value !== "")
      .join(" / ") || "-"
  );
};

const templateMatches = (template, testName) => {
  const name = String(template.name || "").toLowerCase();
  const test = String(testName || "").toLowerCase();
  return Boolean(test && (name.includes(test) || test.includes(name)));
};

const clonePages = (pages) => structuredClone(pages || []);
const resolveLogoUrl = (logo) => {
  if (typeof logo !== "string" || !logo.trim()) return "";
  try {
    return new URL(logo, api.defaults.baseURL).toString();
  } catch {
    return logo;
  }
};

export default function LabReportComposer({ requestId }) {
  const router = useRouter();
  const reportRef = useRef(null);
  const qrImageRef = useRef(null);
  const [request, setRequest] = useState(null);
  const [labProfile, setLabProfile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [draftPages, setDraftPages] = useState([]);
  const [draftOutOfRangeColor, setDraftOutOfRangeColor] = useState("#c62828");
  const [approvedOn, setApprovedOn] = useState("");
  const [values, setValues] = useState({});
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [pdfMode, setPdfMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [layoutEditing, setLayoutEditing] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tablePageIndex, setTablePageIndex] = useState(0);

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
        const testName =
          getTests(
            requestData.requested_tests || requestData.requestedTests,
          )[0] || "";
        const activeTemplateKey = localStorage.getItem(
          `${ACTIVE_TEMPLATE_PREFIX}:${labProfile.id}`,
        );
        const activeTemplate = activeTemplateKey
          ? summaries.find((item) => String(item.id) === activeTemplateKey) ||
            summaries.find(
              (item) => item.isOwner && item.templateKey === activeTemplateKey,
            ) ||
            summaries.find((item) => item.templateKey === activeTemplateKey)
          : null;
        const matchingTest =
          summaries.find(
            (item) => item.isOwner && templateMatches(item, testName),
          ) || summaries.find((item) => templateMatches(item, testName));
        const matching =
          activeTemplate && templateMatches(activeTemplate, testName)
            ? activeTemplate
            : matchingTest || activeTemplate || summaries[0];
        const detailResponse = matching
          ? await api.get(
              `/api/labs/templates/by-id/${encodeURIComponent(matching.id)}`,
            )
          : null;
        const detail = detailResponse?.data?.data || null;
        const selectedDetail = detail
          ? normalizeTemplateDetail(detail, labProfile)
          : null;
        if (!mounted) return;
        setRequest(requestData);
        setLabProfile(labProfile);
        setTemplates(summaries);
        setTemplate(selectedDetail);
        setDraftPages(clonePages(selectedDetail?.pages));
        setDraftOutOfRangeColor(selectedDetail?.outOfRangeColor || "#c62828");
        setApprovedOn(new Date().toISOString());
        setLayoutEditing(Boolean(selectedDetail));
        setSelectedTemplateId(matching?.id == null ? "" : String(matching.id));
        setTemplateDialogOpen(true);
        setValues(
          Object.fromEntries(
            (selectedDetail?.pages || []).flatMap((page) =>
              (page.fields || []).map((field) => [
                field.id,
                field.result || "",
              ]),
            ),
          ),
        );
      } catch (requestError) {
        if (mounted)
          setError(
            requestError.response?.data?.message ||
              "Unable to load report details.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [requestId]);

  const selectTemplate = async (templateId) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/labs/templates/by-id/${encodeURIComponent(templateId)}`,
      );
      const detail = response.data?.data;
      const selectedDetail = normalizeTemplateDetail(detail, labProfile);
      setTemplate(selectedDetail);
      setDraftPages(clonePages(selectedDetail?.pages));
      setDraftOutOfRangeColor(selectedDetail?.outOfRangeColor || "#c62828");
      setApprovedOn(new Date().toISOString());
      setLayoutEditing(true);
      setSelectedTemplateId(String(templateId));
      setTemplateDialogOpen(false);
      setValues(
        Object.fromEntries(
          (selectedDetail?.pages || []).flatMap((page) =>
            (page.fields || []).map((field) => [field.id, field.result || ""]),
          ),
        ),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load selected template.",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateDraftPage = (pageIndex, key, value) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex ? { ...page, [key]: value } : page,
      ),
    );

  const updateDraftField = (pageIndex, fieldId, key, value) =>
    setDraftPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page;
        return {
          ...page,
          fields: page.fields.map((field) => {
            if (field.id !== fieldId) return field;
            if (key.startsWith("column:")) {
              const columnId = key.slice("column:".length);
              return {
                ...field,
                cells: { ...(field.cells || {}), [columnId]: value },
              };
            }
            if (key === "referenceInterval") {
              const resultWasReference =
                !field.result || field.result === field.referenceInterval;
              return {
                ...field,
                referenceInterval: value,
                result: resultWasReference ? value : field.result,
              };
            }
            return { ...field, [key]: value };
          }),
        };
      }),
    );

  const updateDraftColumnLabel = (pageIndex, columnId, label) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              columns: page.columns.map((column) =>
                column.id === columnId ? { ...column, label } : column,
              ),
            }
          : page,
      ),
    );

  const updateDraftTextBlock = (
    pageIndex,
    blockId,
    key,
    value,
    chunkIndex = null,
  ) =>
    setDraftPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page;
        return {
          ...page,
          textBlocks: page.textBlocks.map((block) => {
            if (block.id !== blockId) return block;
            if (key !== "content" || chunkIndex === null)
              return { ...block, [key]: value };
            const chunks = [];
            for (let offset = 0; offset < block.content.length; offset += 700)
              chunks.push(block.content.slice(offset, offset + 700));
            if (!chunks.length) chunks.push("");
            chunks[chunkIndex] = value;
            return { ...block, content: chunks.join("") };
          }),
        };
      }),
    );

  const updateDraftTable = (pageIndex, tableId, updateTable) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              tableBlocks: page.tableBlocks.map((table) =>
                table.id === tableId ? updateTable(table) : table,
              ),
            }
          : page,
      ),
    );

  const updateDraftTableCell = (
    pageIndex,
    tableId,
    rowIndex,
    columnIndex,
    value,
  ) =>
    updateDraftTable(pageIndex, tableId, (table) => {
      const rows = table.rows.map((row) => [...row]);
      rows[rowIndex][columnIndex] = value;
      return { ...table, rows };
    });
  const updateDraftTableTitle = (pageIndex, tableId, title) =>
    updateDraftTable(pageIndex, tableId, (table) => ({ ...table, title }));
  const addDraftTableRow = (pageIndex, tableId) =>
    updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: [
        ...table.rows,
        Array.from({ length: table.rows[0]?.length || 1 }, () => ""),
      ],
    }));
  const removeDraftTableRow = (pageIndex, tableId) =>
    updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: table.rows.length > 1 ? table.rows.slice(0, -1) : table.rows,
    }));
  const addDraftTableColumn = (pageIndex, tableId) =>
    updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: table.rows.map((row) => [...row, ""]),
    }));
  const removeDraftTableColumn = (pageIndex, tableId) =>
    updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows:
        table.rows[0]?.length > 1
          ? table.rows.map((row) => row.slice(0, -1))
          : table.rows,
    }));
  const removeDraftTable = (pageIndex, tableId) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              tableBlocks: page.tableBlocks.filter(
                (table) => table.id !== tableId,
              ),
            }
          : page,
      ),
    );

  const addTableBlock = (rows, columns) => {
    setDraftPages((current) =>
      current.map((page, index) =>
        index === tablePageIndex
          ? {
              ...page,
              tableBlocks: [...page.tableBlocks, newTableBlock(rows, columns)],
            }
          : page,
      ),
    );
    setTableDialogOpen(false);
  };
  const openTableDialog = (pageIndex) => {
    setTablePageIndex(pageIndex);
    setTableDialogOpen(true);
  };

  const addDraftColumn = (pageIndex) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? { ...page, columns: [...page.columns, newColumn()] }
          : page,
      ),
    );
  const removeLastDraftColumn = (pageIndex) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex && page.columns.length > 1
          ? { ...page, columns: page.columns.slice(0, -1) }
          : page,
      ),
    );
  const addDraftField = (pageIndex) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? { ...page, fields: [...page.fields, newField()] }
          : page,
      ),
    );
  const removeLastDraftField = (pageIndex) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex && page.fields.length > 1
          ? { ...page, fields: page.fields.slice(0, -1) }
          : page,
      ),
    );
  const removeDraftTextBlock = (pageIndex, blockId) =>
    setDraftPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? {
              ...page,
              textBlocks: page.textBlocks.filter(
                (block) => block.id !== blockId,
              ),
            }
          : page,
      ),
    );

  const startLayoutEditing = () => {
    setDraftPages(clonePages(template?.pages));
    setDraftOutOfRangeColor(template?.outOfRangeColor || "#c62828");
    setLayoutEditing(true);
  };
  const cancelLayoutEditing = () => {
    setDraftPages(clonePages(template?.pages));
    setDraftOutOfRangeColor(template?.outOfRangeColor || "#c62828");
    setLayoutEditing(false);
  };

  const addReportPage = () =>
    setDraftPages((current) => [
      ...current,
      createReportPage(current.length + 1),
    ]);
  const removeReportPage = (pageIndex) =>
    setDraftPages((current) =>
      current.length > 1
        ? current.filter((_, index) => index !== pageIndex)
        : current,
    );

  const createPdfBlob = async () => {
    flushSync(() => setPdfMode(true));
    try {
      await document.fonts?.ready;
      await Promise.all(
        Array.from(reportRef.current.querySelectorAll("img"), async (image) => {
          if (!image.complete) {
            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = reject;
            });
          }
          if (image.naturalWidth && typeof image.decode === "function")
            await image.decode();
        }),
      );
      const html2canvas = (await import("html2canvas")).default;
      const { PDFDocument } = await import("pdf-lib");
      const pageElements = Array.from(
        reportRef.current.querySelectorAll(".lab-template-page"),
      );
      if (!pageElements.length)
        throw new Error("No report pages are available to export.");

      const pdf = await PDFDocument.create();
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      for (const pageElement of pageElements) {
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FFFFFF",
          ignoreElements: (element) =>
            element.hasAttribute("data-html2canvas-ignore"),
        });
        const image = await pdf.embedPng(canvas.toDataURL("image/png"));
        const pdfPage = pdf.addPage([pageWidth, pageHeight]);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
        });
      }

      return new Blob([await pdf.save()], { type: "application/pdf" });
    } finally {
      flushSync(() => setPdfMode(false));
    }
  };

  const uploadPdf = async (pdfBlob, reportId = null) => {
    const fileName = `${request.order_id || request.orderId || requestId}-report.pdf`;
    const formData = new FormData();
    formData.append(
      "file",
      new File([pdfBlob], fileName, { type: "application/pdf" }),
    );
    formData.append("testRequestId", request.id || requestId);
    if (reportId) formData.append("reportId", String(reportId));
    return api.post("/api/lab-reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const waitForQrImage = async () => {
    const image = qrImageRef.current;
    if (!image)
      throw new Error("Verification QR could not be rendered in the report.");
    if (typeof image.decode === "function") await image.decode();
    else if (!image.complete) {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
    }
    if (!image.naturalWidth)
      throw new Error("Verification QR image failed to load.");
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
        const qrPath = firstUpload.data?.data?.qrPath;
        const apiUrl = new URL(
          api.defaults.baseURL || window.location.origin,
          window.location.origin,
        );
        const isLocalApi = [
          "localhost",
          "127.0.0.1",
          "0.0.0.0",
          "::1",
        ].includes(apiUrl.hostname);
        const qrValue =
          qrPath && !isLocalApi
            ? new URL(qrPath, apiUrl).toString()
            : downloadUrl;
        if (qrValue) {
          const QRious = (await import("qrious")).default;
          const qrDataUrl = new QRious({
            value: qrValue,
            size: 320,
            level: "L",
            foreground: "#000000",
            background: "#FFFFFF",
          }).toDataURL();
          flushSync(() => setQrDataUrl(qrDataUrl));
          await waitForQrImage();
          await uploadPdf(await createPdfBlob(), reportId);
        }
      }
      setNotice("Report submitted. Patient and doctor will be notified.");
      setTimeout(() => router.back(), 900);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to submit report.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !template)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error && !template)
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );

  const common = template?.commonLayout || {};
  const labLogoPath =
    labProfile?.lab_logo_url ||
    labProfile?.lab_logo ||
    labProfile?.lab_logo_path ||
    labProfile?.logo_url ||
    labProfile?.logo ||
    labProfile?.profile_image ||
    labProfile?.image_url ||
    common.labLogo ||
    common.brandLogo ||
    common.logo ||
    "";
  const labLogo = resolveLogoUrl(labLogoPath);
  const tests = getTests(request?.requested_tests || request?.requestedTests);
  const reportPages = draftPages.length ? draftPages : template?.pages || [];
  const renderablePages = reportPages.flatMap((page, sourcePageIndex) =>
    paginateReportPage(page, layoutEditing ? 10 : 14).map(
      (contentPage, continuationIndex) => ({
        page: contentPage,
        sourcePageIndex,
        continuationIndex,
      }),
    ),
  );

  return (
    <Box sx={{ bgcolor: "white", mt: 8, p: 2 }}>
      <Box sx={{bgcolor: "#f4f7f6",p:2}}>
      <Stack
  direction={{ xs: "column", md: "row" }}
  alignItems={{ xs: "stretch", md: "center" }}
  justifyContent="space-between"
  gap={1.5}
  sx={{
    mb: 0.5,
    p: 1.5,
    bgcolor: "#fff",
    border: "1px solid #DDE9E5",
    borderRadius: "10px",
    boxShadow: "0 2px 10px #17203305",
    "& .MuiButton-root": {
      minHeight: 36,
      px: 1.5,
      borderRadius: "7px",
      fontSize: 12,
      fontWeight: 600,
      textTransform: "none",
      whiteSpace: "nowrap",
      boxShadow: "none",
    },
    "& .MuiButton-startIcon > *": { fontSize: 18 },
    "& .MuiButton-outlined": {
      color: "#475569",
      borderColor: "#DDE5E1",
      "&:hover": {
        bgcolor: "#F8FAF9",
        borderColor: "#AEC5BB",
      },
    },
    "& .MuiButton-contained": {
      bgcolor: "#07876A",
      "&:hover": { bgcolor: "#066D56", boxShadow: "none" },
      "&.Mui-disabled": { bgcolor: "#E8EEEB", color: "#94A39C" },
    },
  }}
>
  <Button
    startIcon={<ArrowBackOutlined />}
    onClick={() => router.back()}
    sx={{
      alignSelf: "flex-start",
      color: "#64748B",
      "&:hover": { bgcolor: "#F4F8F6", color: "#07876A" },
    }}
  >
    Back to test requests
  </Button>

  <Stack
    direction="row"
    useFlexGap
    flexWrap="wrap"
    gap={1}
    justifyContent={{ xs: "flex-start", md: "flex-end" }}
  >
    {layoutEditing ? (
      <>
        <Button
          startIcon={<AddOutlined />}
          onClick={addReportPage}
          variant="outlined"
        >
          Add page
        </Button>

        <Button
          startIcon={<CloseOutlined />}
          onClick={cancelLayoutEditing}
          variant="outlined"
        >
          Cancel layout
        </Button>

        <Button
          startIcon={<SaveOutlined />}
          onClick={() => setLayoutEditing(false)}
          variant="contained"
        >
          Done editing
        </Button>
      </>
    ) : (
      <Button
        startIcon={<EditOutlined />}
        onClick={startLayoutEditing}
        disabled={!template || submitting}
        variant="outlined"
      >
        Edit report layout
      </Button>
    )}

    <Button
      startIcon={<PictureAsPdfOutlined />}
      onClick={submitReport}
      disabled={submitting || !template}
      variant="contained"
    >
      {submitting ? "Submitting..." : "Submit report"}
    </Button>
  </Stack>
</Stack>
       {layoutEditing ? (
  <Stack
    direction="row"
    alignItems="center"
    gap={1.2}
    sx={{
      mb: 1.5,
      px: 1.5,
      py: 0.8,
      width: "fit-content",
      maxWidth: "100%",
      boxSizing: "border-box",
      bgcolor: "#fff",
      border: "1px solid #DDE9E5",
      borderRadius: "8px",
    }}
  >
    <Typography
      sx={{ fontSize: 12, fontWeight: 600, color: "#475569" }}
    >
      Out-of-range color
    </Typography>

    <Box
      component="input"
      aria-label="Report out-of-range color"
      type="color"
      value={draftOutOfRangeColor}
      onChange={(event) => setDraftOutOfRangeColor(event.target.value)}
      sx={{
        width: 32,
        height: 30,
        flexShrink: 0,
        p: "3px",
        bgcolor: "#F8FAF9",
        border: "1px solid #DDE9E5",
        borderRadius: "6px",
        cursor: "pointer",
        "&::-webkit-color-swatch-wrapper": { p: 0 },
        "&::-webkit-color-swatch": { border: 0, borderRadius: "3px" },
        "&::-moz-color-swatch": { border: 0, borderRadius: "3px" },
        "&:focus-visible": { outline: "2px solid #07876A", outlineOffset: 2 },
      }}
    />
  </Stack>
) : null}
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        ) : null}
        {notice ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        ) : null}
        <Dialog
          open={templateDialogOpen}
          onClose={() => router.back()}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Select report template</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
            <Typography sx={{ fontSize: 13, color: "#475467" }}>
              Test: {tests.join(", ") || request?.test_name || "Requested test"}
            </Typography>
            <Select
              size="small"
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
            >
              {templates.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => router.back()}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectTemplate(selectedTemplateId)}
              disabled={!selectedTemplateId || loading}
              variant="contained"
              sx={{ textTransform: "none", bgcolor: "#07876A" }}
            >
              Open template
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          ref={reportRef}
          className="lab-composer-document"
          sx={{ width: "100%", maxWidth: 900, mx: "auto" }}
        >
          {renderablePages.map(
            ({ page, sourcePageIndex, continuationIndex }, renderIndex) => {
              return (
                <Box
                  key={`${page.id}-continuation-${continuationIndex}`}
                  className="lab-report-page-wrap"
                >
                  {layoutEditing &&
                  continuationIndex === 0 &&
                  draftPages.length > 1 ? (
                    <Button
                      data-html2canvas-ignore="true"
                      color="error"
                      size="small"
                      startIcon={<DeleteOutline />}
                      onClick={() => removeReportPage(sourcePageIndex)}
                      sx={{ mb: 0.75, textTransform: "none" }}
                    >
                      Remove manual page {sourcePageIndex + 1}
                    </Button>
                  ) : null}
                  <LabReportPage
                    page={page}
                    commonLayout={common}
                    brandLogo={labLogo}
                    showLabLogo
                    patientFields={[
                      {
                        label: "Name",
                        value:
                          request?.patient_name ||
                          request?.patientName ||
                          request?.patient_id ||
                          "-",
                      },
                      {
                        label: "Reg. No.",
                        value: request?.order_id || request?.orderId || "-",
                      },
                      {
                        label: "Age & Sex",
                        value: getPatientAgeAndSex(request),
                      },
                      {
                        label: "Reg. Date",
                        value: request?.created_at || request?.createdAt || "-",
                      },
                      {
                        label: "Referred By",
                        value:
                          request?.doctor_name ||
                          request?.doctorName ||
                          request?.doctor_id ||
                          "-",
                      },
                      {
                        label: "Sample",
                        value:
                          request?.sample_type || request?.sampleType || "-",
                      },
                      { label: "Tests", value: tests.join(", ") || "-" },
                    ]}
                    pageNumber={renderIndex + 1}
                    pageCount={renderablePages.length}
                    continuationIndex={continuationIndex}
                    lastPage={renderIndex === renderablePages.length - 1}
                    approvedOn={approvedOn}
                    templateEditing={layoutEditing}
                    pdfMode={pdfMode}
                    editPageDetails={layoutEditing && continuationIndex === 0}
                    entryMode
                    resultValues={values}
                    onResultChange={(fieldId, value) =>
                      setValues((current) => ({ ...current, [fieldId]: value }))
                    }
                    outOfRangeColor={
                      layoutEditing
                        ? draftOutOfRangeColor
                        : template.outOfRangeColor || "#c62828"
                    }
                    qrDataUrl={qrDataUrl}
                    qrImageRef={renderIndex === 0 ? qrImageRef : undefined}
                    onPageChange={(key, value) =>
                      updateDraftPage(sourcePageIndex, key, value)
                    }
                    onFieldChange={(fieldId, key, value) =>
                      updateDraftField(sourcePageIndex, fieldId, key, value)
                    }
                    onColumnLabelChange={(columnId, label) =>
                      updateDraftColumnLabel(sourcePageIndex, columnId, label)
                    }
                    onTableTitleChange={(tableId, title) =>
                      updateDraftTableTitle(sourcePageIndex, tableId, title)
                    }
                    onTableCellChange={(
                      tableId,
                      rowIndex,
                      columnIndex,
                      value,
                    ) =>
                      updateDraftTableCell(
                        sourcePageIndex,
                        tableId,
                        rowIndex,
                        columnIndex,
                        value,
                      )
                    }
                    onAddTableRow={(tableId) =>
                      addDraftTableRow(sourcePageIndex, tableId)
                    }
                    onRemoveTableRow={(tableId) =>
                      removeDraftTableRow(sourcePageIndex, tableId)
                    }
                    onAddTableColumn={(tableId) =>
                      addDraftTableColumn(sourcePageIndex, tableId)
                    }
                    onRemoveTableColumn={(tableId) =>
                      removeDraftTableColumn(sourcePageIndex, tableId)
                    }
                    onRemoveTable={(tableId) =>
                      removeDraftTable(sourcePageIndex, tableId)
                    }
                    onTextBlockChange={(blockId, key, value, chunkIndex) =>
                      updateDraftTextBlock(
                        sourcePageIndex,
                        blockId,
                        key,
                        value,
                        chunkIndex,
                      )
                    }
                    onRemoveTextBlock={(blockId) =>
                      removeDraftTextBlock(sourcePageIndex, blockId)
                    }
                    actions={
                      layoutEditing &&
                      renderIndex === renderablePages.length - 1 ? (
                        <LabReportEditActions
                          onAddRow={() => addDraftField(sourcePageIndex)}
                          onRemoveRow={() =>
                            removeLastDraftField(sourcePageIndex)
                          }
                          canRemoveRow={
                            draftPages[sourcePageIndex].fields.length > 1
                          }
                          onAddColumn={() => addDraftColumn(sourcePageIndex)}
                          onRemoveColumn={() =>
                            removeLastDraftColumn(sourcePageIndex)
                          }
                          canRemoveColumn={
                            draftPages[sourcePageIndex].columns.length > 1
                          }
                          onCreateTable={() => openTableDialog(sourcePageIndex)}
                          onAddTextArea={() =>
                            updateDraftPage(sourcePageIndex, "textBlocks", [
                              ...draftPages[sourcePageIndex].textBlocks,
                              newTextBlock(),
                            ])
                          }
                        />
                      ) : null
                    }
                  />
                </Box>
              );
            },
          )}
        </Box>
        <CreateTableDialog
          open={tableDialogOpen}
          onClose={() => setTableDialogOpen(false)}
          onInsert={addTableBlock}
        />
        <Button
          startIcon={<PictureAsPdfOutlined />}
          onClick={submitReport}
          disabled={submitting || !template}
          variant="contained"
          sx={{
            display: "flex",
            ml: "auto",
            mr: 0,
            mt: 2,
            textTransform: "none",
            bgcolor: "#07876A",
          }}
        >
          {submitting ? "Submitting..." : "Submit report"}
        </Button>
        <style jsx global>{`
          .lab-composer-shell {
            min-height: 100vh;
            padding: 24px;
            background: #f8fafc;
          }
          @media (max-width: 700px) {
            .lab-composer-shell {
              padding: 10px;
            }
          }
          @media print {
            .lab-composer-shell {
              padding: 0;
            }
          }
        `}</style>
      </Box>
    </Box>
  );
}
