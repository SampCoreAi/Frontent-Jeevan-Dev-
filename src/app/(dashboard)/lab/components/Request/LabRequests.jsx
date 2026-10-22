"use client";

import { useEffect, useRef, useState } from "react";

import api from "../../../../../utils/axiosInstance";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  Stack,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import LabBill from "../../components/LabBill";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import LabAddTestDialog from "../LabAddTestDialog";

import { SectionTitle } from "../LabUi";
import LabRequestsTable from "./LabRequestsTable";
import LabRequestSidebar from "./LabRequestSidebar";

const REQUEST_STATUSES = [
  "PENDING",

  "REQUESTED",

  "APPROVED",

  "ACCEPTED",

  "REJECTED",

  "SAMPLE_SCHEDULED",

  "SAMPLE_COLLECTED",

  "RECOLLECTION_REQUIRED",

  "PROCESSING",

  "REPORT_READY",

  "REPORT_UPLOADED",

  "COMPLETED",

  "CANCELLED",
];

const STATUS_TRANSITIONS = {
  PENDING: ["APPROVED", "REJECTED", "CANCELLED"],

  REQUESTED: ["ACCEPTED", "REJECTED", "CANCELLED"],

  APPROVED: ["SAMPLE_SCHEDULED", "REJECTED", "CANCELLED"],

  ACCEPTED: ["SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "CANCELLED"],

  SAMPLE_SCHEDULED: ["SAMPLE_COLLECTED", "CANCELLED"],

  SAMPLE_COLLECTED: ["PROCESSING", "RECOLLECTION_REQUIRED", "CANCELLED"],

  RECOLLECTION_REQUIRED: ["SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "CANCELLED"],

  PROCESSING: ["REPORT_READY", "REPORT_UPLOADED", "CANCELLED"],

  REPORT_READY: ["REPORT_UPLOADED", "COMPLETED"],

  REPORT_UPLOADED: ["REPORT_READY", "PROCESSING", "COMPLETED"],
};

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const getReportRequestId = (report = {}) =>
  report.requestId ||
  report.testRequestId ||
  report.test_request_id ||
  report.request_id;

const getCreatorRole = (id) =>
  ({ 1: "Patient", 2: "Doctor", 3: "Assistant", 4: "Lab", 5: "Admin", 7: "Technician" }[
    Number(id)
  ] || "Unknown");

const formatDateTimeInputValue = (value) => {
  if (!value) return "";

  const normalized = String(value).replace(" ", "T");

  return normalized.slice(0, 16);
};

const formatDateInputValue = (value) => {
  if (!value) return "";

  return String(value).replace("T", " ").slice(0, 10);
};

const isCompleteDateTimeValue = (value) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value || ""));

const getInvoicePdfUrl = (request) => {
  const value = request?.invoicePdfUrl || request?.invoice_pdf_url;
  if (typeof value !== "string" || !value.trim()) return "";

  try {
    const bucketUrl = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
      /\/+$/,
      "",
    );
    return new URL(value, bucketUrl || window.location.origin).toString();
  } catch {
    return "";
  }
};

const hasInvoicePdf = (request) =>
  Boolean(
    typeof (request?.invoicePdfUrl || request?.invoice_pdf_url) === "string" &&
    (request.invoicePdfUrl || request.invoice_pdf_url).trim(),
  );

export default function LabRequests({
  reports = [],

  requests = [],

  loading = false,

  filters,

  page = 1,

  pageSize = 10,

  onPageChange,

  pagination,

  actionId,

  actionField,

  onStatusUpdate,

  onReportDateUpdate,

  onCollectionDetailsUpdate,

  uploading,

  onUploadReport,

  onDeleteReport,

  updateFeedback = { type: "", message: "" },

  pendingUploadCount = 0,

  showDelayedOnly = false,

  onToggleDelayedUpload,

  technicians = [],

  onAssignTechnician,

  onCreateRequest,

  requestOnlyPatient = false,

  onCreateReport,

  onDeleteInvoice,

  lab = {},
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    setFeedbackOpen(Boolean(updateFeedback?.message));
  }, [updateFeedback]);

  const closeFeedback = (_, reason) => {
    if (reason !== "clickaway") setFeedbackOpen(false);
  };

  const [uploadRequest, setUploadRequest] = useState(null);

  const [file, setFile] = useState(null);

  const [uploadError, setUploadError] = useState("");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [invoiceRequest, setInvoiceRequest] = useState(null);

  const invoiceBillRef = useRef(null);

  const [invoiceDraft, setInvoiceDraft] = useState({
    rates: {},
    discountAmount: "",
    otherCharges: "",
    paymentMode: "",
    amountReceived: "",
  });

  const [invoiceSaving, setInvoiceSaving] = useState(false);

  const [invoiceError, setInvoiceError] = useState("");

  const [invoiceSuccess, setInvoiceSuccess] = useState("");
  const [invoiceSuccessOpen, setInvoiceSuccessOpen] = useState(false);

  const [createdInvoice, setCreatedInvoice] = useState({});
  const [invoiceUrlsByRequest, setInvoiceUrlsByRequest] = useState({});
  const [createdInvoicesByRequest, setCreatedInvoicesByRequest] = useState({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteError, setDeleteError] = useState("");
  const [invoiceDeleteRequest, setInvoiceDeleteRequest] = useState(null);
  const [invoiceDeleteError, setInvoiceDeleteError] = useState("");
  const [deletingInvoice, setDeletingInvoice] = useState(false);

  const [reasonDialog, setReasonDialog] = useState({
    open: false,

    request: null,

    status: null,

    note: "",
  });

  const [dateDrafts, setDateDrafts] = useState({});

  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [collectionDialog, setCollectionDialog] = useState({
    open: false,

    request: null,

    date: "",

    instructions: "",
  });

  const safeRequests = Array.isArray(requests) ? requests : [];

  const safeReports = Array.isArray(reports) ? reports : [];

  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalPages =
    pagination?.totalPages ||
    Math.max(1, Math.ceil(safeRequests.length / safePageSize));

  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;

  const endIndex = Math.min(startIndex + safePageSize, safeRequests.length);

  const visible = pagination
    ? safeRequests
    : safeRequests.slice(startIndex, endIndex);

  useEffect(() => {
    if (!visible.some((request) => request.id === selectedRequestId)) {
      setSelectedRequestId(visible[0]?.id ?? null);
    }
  }, [visible, selectedRequestId]);

  const selectedRequest =
    visible.find((request) => request.id === selectedRequestId) || visible[0] || null;

  const detailReport = selectedRequest
    ? safeReports.find(
        (report) =>
          Number(getReportRequestId(report)) === Number(selectedRequest.id),
      )
    : null;

  const selectedReport = uploadRequest
    ? safeReports.find(
        (report) =>
          Number(getReportRequestId(report)) === Number(uploadRequest.id),
      )
    : null;

  const selectedStatus = String(selectedRequest?.status || "PENDING").toUpperCase();
  const selectedAllowedStatuses = [
    selectedStatus,
    ...(STATUS_TRANSITIONS[selectedStatus] || []),
  ];
  const selectedUpdating = actionId === selectedRequest?.id;
const selectedCancelled =
  String(selectedRequest?.status || "").toUpperCase() === "CANCELLED";
  const selectedReportDate = formatDateTimeInputValue(
    selectedRequest?.expected_report_at || selectedRequest?.expectedReportAt || "",
  );
  const selectedReportDateDraft = selectedRequest
    ? dateDrafts[selectedRequest.id] ?? selectedReportDate
    : "";

  const openInvoice = (request) => {
    if (!canCreateInvoice(request)) return;

    const testList = Array.isArray(request?.requested_tests)
      ? request.requested_tests
      : [];
    setInvoiceRequest(request);
    setInvoiceDraft({
      rates: Object.fromEntries(testList.map((_, index) => [index, ""])),
      discountAmount: "",
      otherCharges: "",
      paymentMode: "",
      amountReceived: "",
    });
    setInvoiceError("");
    setInvoiceSuccess("");
    setInvoiceSuccessOpen(false);
    setCreatedInvoice({});
  };

  const closeInvoice = () => {
    if (invoiceSaving) return;
    setInvoiceRequest(null);
    setInvoiceError("");
    setInvoiceSuccess("");
    setInvoiceSuccessOpen(false);
    setCreatedInvoice({});
  };

  const handleCreateInvoice = async () => {
    if (!canCreateInvoice(invoiceRequest)) {
      setInvoiceError("An invoice can only be created for accepted requests.");
      return;
    }

    if (!invoiceRequest?.id) {
      setInvoiceError("Lab order ID is missing.");
      return;
    }

    const requestedTests = Array.isArray(invoiceRequest.requested_tests)
      ? invoiceRequest.requested_tests
      : [];
    if (!requestedTests.length) {
      setInvoiceError("No requested tests are available for this invoice.");
      return;
    }
    const testCharges = requestedTests.map((test, index) => ({
      test_code:
        typeof test === "string" ? test : test.test_code || test.test_name,
      rate: Number(invoiceDraft.rates[index]),
    }));

    if (
      testCharges.some(
        (test, index) =>
          !test.test_code ||
          invoiceDraft.rates[index] === "" ||
          !Number.isFinite(test.rate) ||
          test.rate < 0,
      )
    ) {
      setInvoiceError("Enter a valid rate for every requested test.");
      return;
    }

    const discountAmount = Number(invoiceDraft.discountAmount);
    const otherCharges = Number(invoiceDraft.otherCharges);
    const amountReceived = Number(invoiceDraft.amountReceived);

    if (
      !invoiceDraft.paymentMode.trim() ||
      invoiceDraft.amountReceived === "" ||
      invoiceDraft.discountAmount === "" ||
      invoiceDraft.otherCharges === "" ||
      !Number.isFinite(discountAmount) ||
      discountAmount < 0 ||
      !Number.isFinite(otherCharges) ||
      otherCharges < 0 ||
      !Number.isFinite(amountReceived) ||
      amountReceived < 0
    ) {
      setInvoiceError(
        "Enter valid discount, other charges, payment mode and amount received.",
      );
      return;
    }

    if (!invoiceBillRef.current) {
      setInvoiceError("Invoice preview is not ready. Please try again.");
      return;
    }

    try {
      setInvoiceSaving(true);
      setInvoiceError("");
      setInvoiceSuccess("");

      const html2pdf = (await import("html2pdf.js")).default;
      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: `invoice-${invoiceRequest.order_id || invoiceRequest.id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(invoiceBillRef.current)
        .outputPdf("blob");

      const invoicePdf = new File(
        [pdfBlob],
        `invoice-${invoiceRequest.order_id || invoiceRequest.id}.pdf`,
        { type: "application/pdf" },
      );
      const formData = new FormData();
      formData.append("lab_order_id", String(invoiceRequest.id));
      formData.append("test_charges", JSON.stringify(testCharges));
      formData.append("discount_amount", String(discountAmount));
      formData.append("invoicePdf", invoicePdf);
      formData.append("payment_mode", invoiceDraft.paymentMode.trim());
      formData.append("amount_received", String(amountReceived));
      formData.append("other_charges", String(otherCharges));

      const response = await api.post("/api/labs/invoices", formData);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Invoice could not be created.",
        );
      }

      const invoiceData = response.data?.data || {};
      setCreatedInvoice(invoiceData);
      setCreatedInvoicesByRequest((current) => ({
        ...current,
        [invoiceRequest.id]: invoiceData,
      }));
      const pdfUrl =
        invoiceData.invoicePdfUrl ||
        invoiceData.invoice_pdf_url ||
        invoiceData.pdfUrl ||
        invoiceData.pdf_url;
      if (typeof pdfUrl === "string" && pdfUrl.trim()) {
        setInvoiceUrlsByRequest((current) => ({
          ...current,
          [invoiceRequest.id]: pdfUrl,
        }));
      }
      setInvoiceSuccess(
        response.data?.message || "Invoice created successfully.",
      );
      setInvoiceSuccessOpen(true);
    } catch (error) {
      setInvoiceError(
        error.response?.data?.message ||
          error.message ||
          "Invoice could not be created.",
      );
    } finally {
      setInvoiceSaving(false);
    }
  };

  const isCancelled = (request) =>
    String(request?.status || "").toUpperCase() === "CANCELLED";

  const canCreateInvoice = (request) =>
    [
      "APPROVED",
      "ACCEPTED",
      "SAMPLE_SCHEDULED",
      "SAMPLE_COLLECTED",
      "RECOLLECTION_REQUIRED",
      "PROCESSING",
      "REPORT_READY",
      "REPORT_UPLOADED",
    ].includes(String(request?.status || "").toUpperCase());

  const isCompleted = (request) =>
    String(request?.status || "").toUpperCase() === "COMPLETED";

  const canCreateReport = (request) =>
    String(request?.status || "").toUpperCase() === "REPORT_READY";

  const hasInvoice = (request) =>
    hasInvoicePdf(request) ||
    Boolean(invoiceUrlsByRequest[request?.id]) ||
    Boolean(createdInvoicesByRequest[request?.id]) ||
    Boolean(
      request?.invoice_id ||
      request?.invoiceId ||
      request?.invoice_no ||
      request?.invoice_number,
    );

  const canAssignTechnician = (request) => {
    if (!request) return false;

    return (
      ["APPROVED", "ACCEPTED"].includes(
        String(request.status || "").toUpperCase(),
      ) && !isCancelled(request)
    );
  };

  const getStatusStyle = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "COMPLETED":
        return {
          bgcolor: "#ECFDF3",

          color: "#15803D",

          borderColor: "#BBF7D0",
        };

      case "APPROVED":
        return {
          bgcolor: "#EFF6FF",

          color: "#1D4ED8",

          borderColor: "#BFDBFE",
        };

      case "PENDING":
        return {
          bgcolor: "#FFFBEB",

          color: "#B45309",

          borderColor: "#FDE68A",
        };

      case "PROCESSING":
        return {
          bgcolor: "#F0FDFA",

          color: "#0F766E",

          borderColor: "#99F6E4",
        };

      case "SAMPLE_COLLECTED":
        return {
          bgcolor: "#F5F3FF",

          color: "#6D28D9",

          borderColor: "#DDD6FE",
        };

      case "REPORT_UPLOADED":
        return {
          bgcolor: "#EFF6FF",

          color: "#0369A1",

          borderColor: "#BAE6FD",
        };

      case "REJECTED":

      case "CANCELLED":
        return {
          bgcolor: "#FEF2F2",

          color: "#DC2626",

          borderColor: "#FECACA",
        };

      default:
        return {
          bgcolor: "#F8FAFC",

          color: "#64748B",

          borderColor: "#E2E8F0",
        };
    }
  };

  const getPriorityStyle = (priority) => {
    if (String(priority).toUpperCase() === "URGENT") {
      return {
        bgcolor: "#FEF2F2",

        color: "#DC2626",

        borderColor: "#FECACA",
      };
    }

    return {
      bgcolor: "#F8FAFC",

      color: "#52646B",

      borderColor: "#E2E8F0",
    };
  };

  const openInvoicePdf = (request) => {
    const requestWithCachedUrl = {
      ...request,
      invoicePdfUrl:
        invoiceUrlsByRequest[request?.id] ||
        request?.invoicePdfUrl ||
        request?.invoice_pdf_url,
    };
    const url = getInvoicePdfUrl(requestWithCachedUrl);
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openCollectionDetails = (request = uploadRequest) => {

    setCollectionDialog({
      open: true,

      request,

      date: formatDateInputValue(
        request?.collection_slot || request?.collectionSlot || "",
      ),

      instructions:
        request?.collection_instructions ||
        request?.collectionInstructions ||
        "",
    });
  };

  const openUpload = (request = uploadRequest) => {
    setUploadRequest(request);
    setUploadDialogOpen(true);
  };

  const closeUploadDialog = () => {
    if (uploading) return;

    setUploadDialogOpen(false);

    setFile(null);

    setUploadError("");
  };

  const openDeleteConfirmation = (request = uploadRequest) => {
    const report = safeReports.find(
      (item) => Number(getReportRequestId(item)) === Number(request?.id),
    );
    if (!report?.canDelete || isCompleted(request)) return;

    setUploadRequest(request);
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const deleteReport = async () => {
    if (
      !selectedReport ||
      !selectedReport.canDelete ||
      isCompleted(uploadRequest)
    )
      return;

    try {
      await onDeleteReport(selectedReport.id);

      setDeleteDialogOpen(false);

      setUploadRequest(null);
    } catch (requestError) {
      setDeleteError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to delete report.",
      );
    }
  };

  const confirmDeleteInvoice = async () => {
    if (
      !invoiceDeleteRequest ||
      !hasInvoice(invoiceDeleteRequest) ||
      isCompleted(invoiceDeleteRequest)
    ) {
      return;
    }

    try {
      setDeletingInvoice(true);
      setInvoiceDeleteError("");
      if (typeof onDeleteInvoice !== "function") {
        throw new Error("Invoice deletion is not available.");
      }
      await onDeleteInvoice(invoiceDeleteRequest.id);
      setInvoiceUrlsByRequest((current) => {
        const next = { ...current };
        delete next[invoiceDeleteRequest.id];
        return next;
      });
      setCreatedInvoicesByRequest((current) => {
        const next = { ...current };
        delete next[invoiceDeleteRequest.id];
        return next;
      });
      setInvoiceDeleteRequest(null);
    } catch (requestError) {
      setInvoiceDeleteError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to delete invoice.",
      );
    } finally {
      setDeletingInvoice(false);
    }
  };

  const submitUpload = async (event) => {
    event.preventDefault();

    if (!file || !uploadRequest) return;

    if (file.size > MAX_PDF_SIZE) {
      setUploadError("PDF file must be 10 MB or smaller.");

      return;
    }

    const result = await onUploadReport(uploadRequest.id, file);

    if (result?.success === false) {
      setUploadError(result.message || "Unable to upload report.");

      return;
    }

    setFile(null);

    setUploadError("");

    setUploadRequest(null);

    setUploadDialogOpen(false);
  };

  const handleStatusChange = (request, nextStatus) => {
    if (["REJECTED", "CANCELLED"].includes(nextStatus)) {
      setReasonDialog({
        open: true,

        request,

        status: nextStatus,

        note: "",
      });

      return;
    }

    onStatusUpdate(
      request.id,

      nextStatus,

      request.expected_report_at || request.expectedReportAt || null,

      null,
    );
  };

  const submitReason = async () => {
    if (!reasonDialog.request || !reasonDialog.status) return;

    const note = reasonDialog.note.trim();

    await onStatusUpdate(
      reasonDialog.request.id,

      reasonDialog.status,

      reasonDialog.request.expected_report_at ||
        reasonDialog.request.expectedReportAt ||
        null,

      note || null,
    );

    setReasonDialog({
      open: false,

      request: null,

      status: null,

      note: "",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
        minWidth: 0,

        "& .MuiTypography-root": { overflowWrap: "anywhere" },
      }}
    >
      <SectionTitle
        title="Test Requests"
        description="Select a row to review and manage that test request in the sidebar."
        action={
          <LabAddTestDialog
            onCreateRequest={onCreateRequest}
            requestOnlyPatient={requestOnlyPatient}
            walkInEnabled={lab?.profile?.patientServices?.walkIn === true}
          />
        }
      />

      <Snackbar
        open={invoiceSuccessOpen}
        autoHideDuration={4500}
        onClose={() => setInvoiceSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Alert
          onClose={() => setInvoiceSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", fontSize: 13, borderRadius: 2 }}
        >
          {invoiceSuccess}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(0,1fr) 320px" },
          gridTemplateAreas: { xs: '"details" "list"', lg: '"list details"' },
          alignItems: "start",
          gap: 1.5,
          mt: 1.5,
        }}
      >
        <Box sx={{ gridArea: "list", minWidth: 0 }}>
      <LabRequestsTable
        filters={filters}
        showDelayedOnly={showDelayedOnly}
        pendingUploadCount={pendingUploadCount}
        onToggleDelayedUpload={onToggleDelayedUpload}
        totalPages={totalPages}
        currentPage={currentPage}
        safeRequests={safeRequests}
        startIndex={startIndex}
        endIndex={endIndex}
        visible={visible}
        loading={loading}
        selectedRequest={selectedRequest}
        setSelectedRequestId={setSelectedRequestId}
        getStatusStyle={getStatusStyle}
        getPriorityStyle={getPriorityStyle}
        onPageChange={onPageChange}
      />
        </Box>

        <LabRequestSidebar
          selectedRequest={selectedRequest}
          detailReport={detailReport}
          selectedStatus={selectedStatus}
          selectedUpdating={selectedUpdating}
          selectedCancelled={selectedCancelled}
          selectedAllowedStatuses={selectedAllowedStatuses}
          loading={loading}
          actionId={actionId}
          actionField={actionField}
          handleStatusChange={handleStatusChange}
          getStatusStyle={getStatusStyle}
          getPriorityStyle={getPriorityStyle}
          hasInvoice={hasInvoice}
          technicians={technicians}
          canAssignTechnician={canAssignTechnician}
          onAssignTechnician={onAssignTechnician}
          selectedReportDateDraft={selectedReportDateDraft}
          dateDrafts={dateDrafts}
          setDateDrafts={setDateDrafts}
          selectedReportDate={selectedReportDate}
          onReportDateUpdate={onReportDateUpdate}
          isCompleted={isCompleted}
          openCollectionDetails={openCollectionDetails}
          canCreateInvoice={canCreateInvoice}
          openInvoice={openInvoice}
          getInvoicePdfUrl={getInvoicePdfUrl}
          invoiceUrlsByRequest={invoiceUrlsByRequest}
          openInvoicePdf={openInvoicePdf}
          setInvoiceDeleteError={setInvoiceDeleteError}
          setInvoiceDeleteRequest={setInvoiceDeleteRequest}
          canCreateReport={canCreateReport}
          onCreateReport={onCreateReport}
          openUpload={openUpload}
          openDeleteConfirmation={openDeleteConfirmation}
        />
      </Box>

      <Dialog
        open={collectionDialog.open}
        onClose={() =>
          actionId !== collectionDialog.request?.id &&
          setCollectionDialog({
            open: false,

            request: null,

            date: "",

            instructions: "",
          })
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}
        >
          Collection details
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
          <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
            Select the collection date. The collection time and next token
            number are assigned automatically from the lab schedule.
          </Typography>

          <TextField
            required
            size="small"
            type="date"
            label="Collection date"
            value={collectionDialog.date}
            onChange={(event) =>
              setCollectionDialog((current) => ({
                ...current,

                date: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            required
            size="small"
            multiline
            minRows={3}
            label="Collection instructions"
            placeholder="Example: Call the patient 30 minutes before arrival. Keep the sample refrigerated."
            value={collectionDialog.instructions}
            onChange={(event) =>
              setCollectionDialog((current) => ({
                ...current,

                instructions: event.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() =>
              setCollectionDialog({
                open: false,

                request: null,

                date: "",

                instructions: "",
              })
            }
            disabled={actionId === collectionDialog.request?.id}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={
              !collectionDialog.request ||
              !collectionDialog.date ||
              !collectionDialog.instructions.trim() ||
              actionId === collectionDialog.request.id
            }
            onClick={async () => {
              const saved = await onCollectionDetailsUpdate?.(
                collectionDialog.request.id,

                collectionDialog.date,

                collectionDialog.instructions,
              );

              if (saved !== false) {
                setCollectionDialog({
                  open: false,

                  request: null,

                  date: "",

                  instructions: "",
                });
              }
            }}
            sx={{ textTransform: "none" }}
          >
            {actionId === collectionDialog.request?.id
              ? "Saving..."
              : "Save details"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(invoiceRequest)}
        onClose={closeInvoice}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Invoice - {invoiceRequest?.order_id || "-"}</DialogTitle>
        <DialogContent dividers>
          {invoiceRequest && (
            <Stack spacing={2}>
              {invoiceError && <Alert severity="error">{invoiceError}</Alert>}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                {(invoiceRequest.requested_tests || []).map((test, index) => {
                  const testCode =
                    typeof test === "string"
                      ? test
                      : test.test_code || test.test_name || `Test ${index + 1}`;
                  return (
                    <TextField
                      key={`${testCode}-${index}`}
                      label={`Rate — ${testCode}`}
                      type="number"
                      size="small"
                      value={invoiceDraft.rates[index] ?? ""}
                      inputProps={{ min: 0, step: "0.01" }}
                      onChange={(event) =>
                        setInvoiceDraft((current) => ({
                          ...current,
                          rates: {
                            ...current.rates,
                            [index]: event.target.value,
                          },
                        }))
                      }
                    />
                  );
                })}
                <TextField
                  label="Discount amount"
                  type="number"
                  size="small"
                  value={invoiceDraft.discountAmount}
                  inputProps={{ min: 0, step: "0.01" }}
                  onChange={(event) =>
                    setInvoiceDraft((current) => ({
                      ...current,
                      discountAmount: event.target.value,
                    }))
                  }
                />
                <TextField
                  label="Other charges"
                  type="number"
                  size="small"
                  value={invoiceDraft.otherCharges}
                  inputProps={{ min: 0, step: "0.01" }}
                  onChange={(event) =>
                    setInvoiceDraft((current) => ({
                      ...current,
                      otherCharges: event.target.value,
                    }))
                  }
                />
                <TextField
                  label="Payment mode"
                  size="small"
                  value={invoiceDraft.paymentMode}
                  onChange={(event) =>
                    setInvoiceDraft((current) => ({
                      ...current,
                      paymentMode: event.target.value,
                    }))
                  }
                />
                <TextField
                  label="Amount received"
                  type="number"
                  size="small"
                  value={invoiceDraft.amountReceived}
                  inputProps={{ min: 0, step: "0.01" }}
                  onChange={(event) =>
                    setInvoiceDraft((current) => ({
                      ...current,
                      amountReceived: event.target.value,
                    }))
                  }
                />
              </Box>

              <LabBill
                order={invoiceRequest}
                lab={lab}
                billRef={invoiceBillRef}
                invoice={{
                  test_charges: (invoiceRequest.requested_tests || []).map(
                    (test, index) => ({
                      test_code:
                        typeof test === "string"
                          ? test
                          : test.test_code || test.test_name,
                      rate: invoiceDraft.rates[index],
                    }),
                  ),
                  discount_amount: invoiceDraft.discountAmount,
                  other_charges: invoiceDraft.otherCharges,
                  payment_mode: invoiceDraft.paymentMode,
                  amount_received: invoiceDraft.amountReceived,
                  ...createdInvoice,
                }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInvoice} disabled={invoiceSaving}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            disabled={invoiceSaving || Boolean(invoiceSuccess)}
          >
            {invoiceSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create invoice"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);

          setDeleteError("");
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}
        >
          Delete uploaded report?
        </DialogTitle>

        <DialogContent>
          {deleteError ? (
            <Alert severity="error" sx={{ mb: 1.5, fontSize: "12px" }}>
              {deleteError}
            </Alert>
          ) : null}

          <Typography
            sx={{ fontSize: "13px", color: "#52646B", lineHeight: 1.6 }}
          >
            This report will be removed from the request. You can upload a
            corrected PDF again while the request is not completed.
          </Typography>

          <Typography
            sx={{ mt: 1, fontSize: "12px", fontWeight: 700, color: "#334155" }}
          >
            {selectedReport?.originalFileName || "Uploaded report"}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none", color: "#52646B" }}
          >
            Keep report
          </Button>

          <Button
            onClick={deleteReport}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete report
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(invoiceDeleteRequest)}
        onClose={() => {
          if (!deletingInvoice) {
            setInvoiceDeleteRequest(null);
            setInvoiceDeleteError("");
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete invoice?</DialogTitle>
        <DialogContent>
          {invoiceDeleteError ? (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {invoiceDeleteError}
            </Alert>
          ) : null}
          <Typography sx={{ color: "#52646B" }}>
            This will remove the invoice for order{" "}
            {invoiceDeleteRequest?.order_id || invoiceDeleteRequest?.id || "-"}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setInvoiceDeleteRequest(null);
              setInvoiceDeleteError("");
            }}
            disabled={deletingInvoice}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteInvoice}
            disabled={deletingInvoice}
          >
            {deletingInvoice ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete invoice"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadDialogOpen}
        onClose={closeUploadDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <Box component="form" onSubmit={submitUpload}>
          <DialogTitle
            sx={{
              px: 2.5,

              py: 1.75,

              borderBottom: "1px solid #EDF1F3",
            }}
          >
            <Typography
              sx={{
                color: "#123F66",

                fontSize: "15px",

                fontWeight: 700,
              }}
            >
              Upload Report
            </Typography>

            <Typography
              sx={{
                fontSize: "10.5px",

                color: "#7A8C92",

                mt: 0.25,
              }}
            >
              Upload patient&apos;s laboratory report in PDF format.
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
              display: "grid",

              gap: 1.5,

              px: 2.5,

              py: "20px !important",
            }}
          >
            <Box
              sx={{
                p: 1.5,

                borderRadius: "7px",

                bgcolor: "#F8FAFC",

                border: "1px solid #E8EDF0",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",

                  color: "#84959B",

                  fontWeight: 600,
                }}
              >
                REQUEST
              </Typography>

              <Typography
                sx={{
                  fontSize: "12.5px",

                  color: "#334155",

                  fontWeight: 600,

                  mt: 0.3,
                }}
              >
                #{uploadRequest?.id} Â·{" "}
                {uploadRequest?.patient_name || "Patient"}
              </Typography>
            </Box>

            {uploadError ? (
              <Alert
                severity="error"
                sx={{
                  fontSize: "11px",

                  borderRadius: "7px",
                }}
              >
                {uploadError}
              </Alert>
            ) : null}

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                minHeight: 46,

                justifyContent: "flex-start",

                borderRadius: "7px",

                borderStyle: "dashed",

                borderColor: "#B8CCD6",

                color: file ? "#14734F" : "#52646B",

                bgcolor: file ? "#F3FAF6" : "#FFFFFF",

                fontSize: "11.5px",

                textTransform: "none",
              }}
            >
              {file ? file.name : "Choose PDF file"}

              <input
                hidden
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] || null;

                  if (selectedFile && selectedFile.size > MAX_PDF_SIZE) {
                    setFile(null);

                    setUploadError("PDF file must be 10 MB or smaller.");
                  } else {
                    setFile(selectedFile);

                    setUploadError("");
                  }
                }}
              />
            </Button>

            <Typography
              sx={{
                fontSize: "10px",

                color: "#84959B",
              }}
            >
              PDF files only Â· Maximum file size 10 MB
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 2.5,

              py: 1.5,

              borderTop: "1px solid #EDF1F3",
            }}
          >
            <Button
              onClick={closeUploadDialog}
              disabled={uploading}
              sx={{
                fontSize: "11.5px",

                textTransform: "none",

                color: "#64748B",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={uploading || !file}
              startIcon={
                uploading ? (
                  <CircularProgress size={13} color="inherit" />
                ) : (
                  <UploadFileIcon />
                )
              }
              sx={{
                minWidth: 125,

                height: 30,

                bgcolor: "#0B5C8E",

                borderRadius: "6px",

                fontSize: "11.5px",

                textTransform: "none",

                boxShadow: "none",

                "&:hover": {
                  bgcolor: "#094F79",

                  boxShadow: "none",
                },
              }}
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={reasonDialog.open}
        onClose={() => {
          if (actionId === reasonDialog.request?.id) return;

          setReasonDialog({
            open: false,

            request: null,

            status: null,

            note: "",
          });
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2.5,

            py: 1.75,

            borderBottom: "1px solid #EDF1F3",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",

              fontWeight: 700,

              color: "#123F66",
            }}
          >
            {reasonDialog.status === "CANCELLED"
              ? "Cancel Request"
              : "Reject Request"}
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",

              color: "#7A8C92",

              mt: 0.25,
            }}
          >
            Add a reason so the request history remains clear.
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 2.5,

            py: "20px !important",
          }}
        >
          <TextField
            multiline
            minRows={3}
            fullWidth
            size="small"
            label="Reason / comment"
            value={reasonDialog.note}
            onChange={(event) =>
              setReasonDialog((current) => ({
                ...current,

                note: event.target.value,
              }))
            }
            placeholder="Example: Sample was not collected on time."
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "7px",

                fontSize: "12px",
              },

              "& .MuiInputLabel-root": {
                fontSize: "12px",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,

            py: 1.5,

            borderTop: "1px solid #EDF1F3",
          }}
        >
          <Button
            disabled={actionId === reasonDialog.request?.id}
            onClick={() =>
              setReasonDialog({
                open: false,

                request: null,

                status: null,

                note: "",
              })
            }
            sx={{
              fontSize: "11.5px",

              textTransform: "none",

              color: "#64748B",
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            color={reasonDialog.status === "CANCELLED" ? "error" : "warning"}
            onClick={submitReason}
            disabled={actionId === reasonDialog.request?.id}
            sx={{
              minWidth: 90,

              height: 30,

              borderRadius: "6px",

              fontSize: "11.5px",

              textTransform: "none",

              boxShadow: "none",
            }}
          >
            {actionId === reasonDialog.request?.id
              ? "Submitting..."
              : reasonDialog.status === "CANCELLED"
                ? "Cancel Request"
                : "Reject Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
