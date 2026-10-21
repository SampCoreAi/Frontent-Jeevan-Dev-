"use client";

import { Box, Button, Chip, CircularProgress, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

const REQUEST_STATUSES = ["PENDING", "REQUESTED", "APPROVED", "ACCEPTED", "REJECTED", "SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "RECOLLECTION_REQUIRED", "PROCESSING", "REPORT_READY", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"];
const getCreatorRole = (id) => ({ 1: "Patient", 2: "Doctor", 3: "Assistant", 4: "Lab", 5: "Admin", 7: "Technician" }[Number(id)] || "Unknown");
const isCompleteDateTimeValue = (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value || ""));
const detailText = (value) => {
  if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item : item?.test_name || item?.test_code).filter(Boolean).join(", ") || "—";
  if (value && typeof value === "object") return value.test_name || value.test_code || "—";
  return value === 0 ? "0" : value ? String(value) : "—";
};
const formatAddress = (address) => {
  if (!address) return "—";
  if (typeof address !== "object") return String(address);

  return [
    address.street || address.streetRoadName,
    address.areaLocality || address.locality,
    address.city || address.cityTown,
    address.state,
    address.pincode || address.pinCode || address.postalCode,
  ]
    .filter(Boolean)
    .join(", ") || "—";
};
function DetailSection({ title, rows }) {
  return (
    <Box sx={{ p: 1.25, border: "1px solid #E6ECE9", borderRadius: 1.5 }}>
      <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 750, color: "#334155" }}>{title}</Typography>
      <Stack spacing={0.8}>{rows.map(([label, value]) => (
        <Box key={label} sx={{ display: "grid", gridTemplateColumns: "82px minmax(0,1fr)", gap: 0.75 }}>
          <Typography sx={{ fontSize: 10.5, color: "#74807B" }}>{label}</Typography>
          <Typography sx={{ minWidth: 0, fontSize: 11, fontWeight: 600, color: "#14734F", overflowWrap: "anywhere" }}>{detailText(value)}</Typography>
        </Box>
      ))}</Stack>
    </Box>
  );
}

export default function LabRequestSidebar(props) {
  const { selectedRequest, detailReport, selectedStatus, selectedUpdating, selectedCancelled, selectedAllowedStatuses, loading, actionId, actionField, handleStatusChange, getStatusStyle, getPriorityStyle, hasInvoice, technicians, canAssignTechnician, onAssignTechnician, selectedReportDateDraft, dateDrafts, setDateDrafts, selectedReportDate, onReportDateUpdate, isCompleted, openCollectionDetails, canCreateInvoice, openInvoice, getInvoicePdfUrl, invoiceUrlsByRequest, openInvoicePdf, setInvoiceDeleteError, setInvoiceDeleteRequest, canCreateReport, onCreateReport, openUpload, openDeleteConfirmation } = props;
  return (
        <Box
          component="aside"
          aria-label="Selected test request details"
          sx={{
            gridArea: "details",
            position: { lg: "sticky" },
            top: 12,
            minWidth: 0,
            maxHeight: { lg: "calc(85vh - 12px)" },
            overflowY: { lg: "auto" },
            p: 1.5,
            border: "1px solid #DDE7E3",
            borderRadius: 2,
            bgcolor: "#fff",
            boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
          }}
        >
          <Stack spacing={1.25}>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 750, color: "#172033" }}>
                Order details
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: 11.5, color: "#74807B" }}>
                Click any row to see its complete details here.
              </Typography>
            </Box>

            {selectedRequest ? (
              <>
                <Box sx={{ p: 1.25, border: "1px solid #E6ECE9", borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 750, color: "#172033" }}>
                    {selectedRequest.order_id || selectedRequest.orderId || `Request #${selectedRequest.id}`}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={String(selectedRequest.status || "PENDING").replaceAll("_", " ")}
                      sx={{ ...getStatusStyle(selectedRequest.status || "PENDING"), height: 23, fontWeight: 700, fontSize: 10 }}
                    />
                    <Chip
                      size="small"
                      label={String(selectedRequest.priority || "NORMAL")}
                      sx={{ ...getPriorityStyle(selectedRequest.priority || "NORMAL"), height: 23, fontWeight: 700, fontSize: 10 }}
                    />
                  </Stack>
                </Box>

                <Box sx={{ p: 1.25, border: "1px solid #E6ECE9", borderRadius: 1.5 }}>
                  <Typography sx={{ mb: 0.8, fontSize: 12, fontWeight: 750, color: "#334155" }}>
                    Order status
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Select
                      size="small"
                      fullWidth
                      value={selectedStatus}
                      disabled={selectedUpdating || selectedCancelled}
                      onChange={(event) =>
                        handleStatusChange(selectedRequest, event.target.value)
                      }
                      sx={{ fontSize: 12, fontWeight: 700, color: getStatusStyle(selectedStatus).color }}
                    >
                      {REQUEST_STATUSES.map((item) => (
                        <MenuItem
                          key={item}
                          value={item}
                          disabled={!selectedAllowedStatuses.includes(item)}
                          sx={{ fontSize: 12 }}
                        >
                          {item.replaceAll("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
                    {actionId === selectedRequest.id && actionField === "status" ? (
                      <CircularProgress size={16} />
                    ) : null}
                  </Stack>
                </Box>

                <DetailSection
                  title="Patient information"
                  rows={[
                    ["Patient", selectedRequest.patient_name || selectedRequest.patient_id],
                    ["Age", selectedRequest.patient_age || selectedRequest.age],
                    ["Gender", selectedRequest.patient_gender || selectedRequest.gender],
                    ["Phone", selectedRequest.patient_phone || selectedRequest.phone || selectedRequest.mobile],
                    ["Email", selectedRequest.patient_email || selectedRequest.email],
                    ["Address", formatAddress(selectedRequest.patient_address || selectedRequest.address)],
                  ]}
                />
                <DetailSection
                  title="Doctor & request"
                  rows={[
                    ["Doctor", selectedRequest.doctor_name || selectedRequest.referring_doctor_name || selectedRequest.created_by_name],
                    ["Created by", `${getCreatorRole(selectedRequest.created_by_role_id)} · ${selectedRequest.created_by_name || "-"}`],
                    ["Order ID", selectedRequest.order_id || selectedRequest.orderId || selectedRequest.id],
                    ["Created", selectedRequest.created_at || selectedRequest.createdAt],
                  ]}
                />
                <DetailSection
                  title="Tests & sample"
                  rows={[
                    ["Tests", selectedRequest.requested_tests],
                    ["Sample type", selectedRequest.sample_type || selectedRequest.sampleType],
                    ["Doctor note", selectedRequest.doctor_note || selectedRequest.doctorNote],
                  ]}
                />
                <DetailSection
                  title="Collection & handling"
                  rows={[
                    ["Technician", selectedRequest.assigned_technician_name || selectedRequest.assigned_technician_email],
                    ["Collection", selectedRequest.collection_slot || selectedRequest.collectionSlot],
                    ["Token", selectedRequest.collection_token || selectedRequest.collectionToken],
                    ["Instructions", selectedRequest.collection_instructions || selectedRequest.collectionInstructions],
                  ]}
                />
                <DetailSection
                  title="Report & invoice"
                  rows={[
                    ["Report due", selectedRequest.expected_report_at || selectedRequest.expectedReportAt],
                    ["Report", detailReport ? (detailReport.originalFileName || "Available") : "Not uploaded"],
                    ["Invoice", hasInvoice(selectedRequest) ? "Available" : "Not created"],
                    ["Status note", selectedRequest.latest_status_note || selectedRequest.latestStatusNote || selectedRequest.status_note || selectedRequest.note],
                  ]}
                />
               <Box
  sx={{
    p: 1.25,
    border: "1px solid #E6ECE9",
    borderRadius: 1.5,
    minWidth: 0,
  }}
>
  <Typography
    sx={{ mb: 1, fontSize: 12, fontWeight: 750, color: "#334155" }}
  >
    Order handling
  </Typography>

  <Stack spacing={1.1}>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ mb: 0.4, fontSize: 10.5, color: "#74807B" }}>
        Technician
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={selectedRequest.assigned_technician_email || ""}
          disabled={
            selectedCancelled ||
            selectedUpdating ||
            !technicians.length ||
            !canAssignTechnician(selectedRequest)
          }
          onChange={(event) => {
            if (event.target.value) {
              onAssignTechnician?.(
                selectedRequest.id,
                event.target.value
              );
            }
          }}
          sx={{
            minWidth: 0,
            fontSize: 12,
            "& .MuiSelect-select": {
              minHeight: "40px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              py: 0,
            },
          }}
        >
          <MenuItem value="" sx={{ fontSize: 12 }}>
            {canAssignTechnician(selectedRequest)
              ? technicians.length
                ? "Select technician"
                : "Add technician first"
              : "Approved or accepted requests only"}
          </MenuItem>

          {technicians.map((technician) => (
            <MenuItem
              key={technician.email}
              value={technician.email}
              sx={{ fontSize: 12 }}
            >
              {technician.full_name}
            </MenuItem>
          ))}
        </Select>

        {actionId === selectedRequest.id && actionField === "technician" && (
          <CircularProgress size={16} sx={{ flexShrink: 0 }} />
        )}
      </Stack>
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ mb: 0.4, fontSize: 10.5, color: "#74807B" }}>
        Report due date and time
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <TextField
          size="small"
          fullWidth
          type="datetime-local"
          value={selectedReportDateDraft}
          onChange={(event) =>
            setDateDrafts((current) => ({
              ...current,
              [selectedRequest.id]: event.target.value || "",
            }))
          }
          onBlur={() => {
            const nextValue =
              dateDrafts[selectedRequest.id] ?? selectedReportDate;

            if (
              isCompleteDateTimeValue(nextValue) &&
              nextValue !== selectedReportDate
            ) {
              onReportDateUpdate?.(selectedRequest.id, nextValue);
            }
          }}
          disabled={selectedUpdating || selectedCancelled}
          InputLabelProps={{ shrink: true }}
          sx={{
            minWidth: 0,
            "& .MuiInputBase-root": {
              minHeight: 42,
            },
            "& .MuiInputBase-input": {
              fontSize: 12,
            },
          }}
        />

        {actionId === selectedRequest.id && actionField === "reportDate" && (
          <CircularProgress size={16} sx={{ flexShrink: 0 }} />
        )}
      </Stack>
    </Box>

    <Button
  fullWidth
  size="small"
  variant="outlined"
  disabled={selectedCancelled || isCompleted(selectedRequest)}
  onClick={() => openCollectionDetails(selectedRequest)}
  sx={{
    height: 38,
    minHeight: 38,
    maxHeight: 38,
    px: 1.25,
    py: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    color: "#07876A",
    borderColor: "#07876A",
    fontSize: "12px !important",
    fontWeight: 500,
    lineHeight: "18px",
    textTransform: "none",
    "& .MuiButton-startIcon, & .MuiButton-endIcon": {
      fontSize: 16,
    },
  }}
>
  Edit collection slot &amp; instructions
</Button>
  </Stack>
</Box>
<Box sx={{ p: 1.25, border: "1px solid #E6ECE9", borderRadius: 1.5 }}>
  <Typography
    sx={{ mb: 0.5, fontSize: 12, fontWeight: 750, color: "#334155" }}
  >
    Invoice
  </Typography>

  <Typography
    sx={{
      mb: 1,
      fontSize: 10.5,
      color: hasInvoice(selectedRequest) ? "#15803D" : "#74807B",
    }}
  >
    {hasInvoice(selectedRequest) ? "Invoice available" : "No invoice created"}
  </Typography>

  <Stack spacing={0.75}>
    <Button
      fullWidth
      size="small"
      variant="outlined"
      disabled={
        !canCreateInvoice(selectedRequest) ||
        isCompleted(selectedRequest) ||
        hasInvoice(selectedRequest)
      }
      onClick={() => openInvoice(selectedRequest)}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      Create invoice
    </Button>

    <Button
      fullWidth
      size="small"
      variant="outlined"
      disabled={
        !getInvoicePdfUrl({
          ...selectedRequest,
          invoicePdfUrl:
            invoiceUrlsByRequest[selectedRequest.id] ||
            selectedRequest.invoicePdfUrl ||
            selectedRequest.invoice_pdf_url,
        })
      }
      onClick={() => openInvoicePdf(selectedRequest)}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      View invoice
    </Button>

    <Button
      fullWidth
      size="small"
      color="error"
      variant="outlined"
      disabled={!hasInvoice(selectedRequest) || isCompleted(selectedRequest)}
      onClick={() => {
        setInvoiceDeleteError("");
        setInvoiceDeleteRequest(selectedRequest);
      }}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      Delete invoice
    </Button>
  </Stack>
</Box>

               <Box sx={{ p: 1.25, border: "1px solid #E6ECE9", borderRadius: 1.5 }}>
  <Typography
    sx={{ mb: 0.5, fontSize: 12, fontWeight: 750, color: "#334155" }}
  >
    Report
  </Typography>

  <Typography
    title={detailReport?.originalFileName || ""}
    sx={{
      mb: 1,
      fontSize: 10.5,
      color: detailReport ? "#15803D" : "#74807B",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    {detailReport?.originalFileName ||
      (detailReport ? "Report available" : "No report uploaded")}
  </Typography>

  <Stack spacing={0.75}>
    <Button
      fullWidth
      size="small"
      variant="outlined"
      disabled={!canCreateReport(selectedRequest)}
      onClick={() => onCreateReport?.(selectedRequest)}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      Create report
    </Button>

    <Button
      fullWidth
      size="small"
      variant="outlined"
      disabled={selectedCancelled || isCompleted(selectedRequest)}
      onClick={() => openUpload(selectedRequest)}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      Upload report
    </Button>

    <Button
      fullWidth
      size="small"
      variant="outlined"
      component="a"
      href={detailReport?.downloadUrl || undefined}
      target="_blank"
      rel="noreferrer"
      disabled={!detailReport?.downloadUrl}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      View uploaded report
    </Button>

    <Button
      fullWidth
      size="small"
      color="error"
      variant="outlined"
      disabled={!detailReport?.canDelete || isCompleted(selectedRequest)}
      onClick={() => openDeleteConfirmation(selectedRequest)}
      sx={{
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        px: 1.25,
        py: 0,
        justifyContent: "flex-start",
        fontSize: "12px !important",
        lineHeight: "18px",
        whiteSpace: "nowrap",
        textTransform: "none",
      }}
    >
      Delete report
    </Button>
  </Stack>
</Box>

              </>
            ) : (
              <Box sx={{ p: 2, border: "1px dashed #CBD5E1", borderRadius: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: 12, color: "#74807B" }}>
                  {loading ? "Loading test requests…" : "No test request selected."}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

  );
}
