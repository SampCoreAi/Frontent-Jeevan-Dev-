"use client";

import { useRef } from "react";
import { Box, Button, Chip, IconButton, Tooltip, CircularProgress, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { resolveReportDownloadUrl } from "../../utils/reportUrls";
const REQUEST_STATUSES = ["PENDING", "REQUESTED", "APPROVED", "ACCEPTED", "REJECTED", "SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "RECOLLECTION_REQUIRED", "PROCESSING", "REPORT_READY", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"];
const getCreatorRole = (id) => ({ 1: "Patient", 2: "Doctor", 3: "Assistant", 4: "Lab", 5: "Admin", 7: "Technician" }[Number(id)] || "Unknown");
const isCompleteDateTimeValue = (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value || ""));

function SidebarIconAction({
  label,
  disabled = false,
  disabledReason,
  icon,
  color = "primary",
  onClick,
  component,
  href,
  target,
  rel,
}) {
  return (
    <Tooltip title={disabled ? disabledReason : label} arrow placement="top">
      <span style={{ display: "inline-flex" }}>
        <IconButton
          aria-label={label}
          size="small"
          color={color}
          disabled={disabled}
          onClick={onClick}
          component={component}
          href={href}
          target={target}
          rel={rel}
          sx={{
            width: 38,
            height: 38,
            border: "1px solid #DDE7E3",
            borderRadius: 1.25,
            color: "#07876A",
            "&:hover": { bgcolor: "#F0FDF8", borderColor: "#07876A" },
            "&.Mui-disabled": {
              borderColor: "#E5E7EB",
              color: "#A8B0B8",
            },
            "& .MuiSvgIcon-root": {
              display: "block",
              width: 22,
              height: 22,
              fontSize: 22,
              flexShrink: 0,
            },
            ...(color === "error" && {
              color: "#DC2626",
              "&:hover": { bgcolor: "#FEF2F2", borderColor: "#DC2626" },
            }),
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

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
  const { selectedRequest, detailReport, selectedStatus, selectedUpdating, selectedCancelled, selectedAllowedStatuses, loading, actionId, actionField, handleStatusChange, getStatusStyle, getPriorityStyle, hasInvoice, technicians, canAssignTechnician, onAssignTechnician, selectedReportDateDraft, setDateDrafts, selectedReportDate, onReportDateUpdate, isCompleted, openCollectionDetails, canCreateInvoice, openInvoice, getInvoicePdfUrl, invoiceUrlsByRequest, openInvoicePdf, setInvoiceDeleteError, setInvoiceDeleteRequest, canCreateReport, onCreateReport, openUpload, openDeleteConfirmation } = props;
  const reportDateInputRef = useRef(null);
  const reportDownloadUrl = resolveReportDownloadUrl(detailReport?.downloadUrl);
  const openReportDatePicker = () => {
    const input = reportDateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") input.showPicker();
    else input.click();
  };

  return (
        <Box
          component="aside"
          aria-label="Selected test request details"
          sx={{
            gridArea: "details",
            position: { lg: "sticky" },
            top: 12,
            minWidth: 0,
            maxHeight: { lg: "calc(85vh - 50px)" },
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

                    ["Created", selectedRequest.created_at || selectedRequest.createdAt],
                  ]}
                />
                <DetailSection
                  title="Tests & sample"
                  rows={[
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
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <SidebarIconAction
          label="Choose report due date and time"
          disabled={selectedUpdating || selectedCancelled}
          disabledReason={
            selectedCancelled
              ? "Cancelled requests cannot be rescheduled."
              : "The report due date is currently being updated."
          }
          icon={<CalendarMonthOutlinedIcon fontSize="small" />}
          onClick={openReportDatePicker}
        />
        <SidebarIconAction
          label="Edit report due date and time"
          disabled={selectedUpdating || selectedCancelled}
          disabledReason={
            selectedCancelled
              ? "Cancelled requests cannot be rescheduled."
              : "The report due date is currently being updated."
          }
          icon={<EditOutlinedIcon fontSize="small" />}
          onClick={openReportDatePicker}
        />
        <TextField
          inputRef={reportDateInputRef}
          size="small"
          type="datetime-local"
          value={selectedReportDateDraft}
          onChange={(event) => {
            const nextValue = event.target.value || "";
            setDateDrafts((current) => ({
              ...current,
              [selectedRequest.id]: nextValue,
            }));
            if (
              isCompleteDateTimeValue(nextValue) &&
              nextValue !== selectedReportDate
            ) {
              onReportDateUpdate?.(selectedRequest.id, nextValue);
            }
          }}
          disabled={selectedUpdating || selectedCancelled}
          sx={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        />

        {actionId === selectedRequest.id && actionField === "reportDate" && (
          <CircularProgress size={16} sx={{ flexShrink: 0 }} />
        )}
      </Stack>
    </Box>

    <Tooltip
      title={
        selectedCancelled
          ? "Collection details cannot be changed for cancelled requests."
          : isCompleted(selectedRequest)
            ? "Collection details cannot be changed after a request is completed."
            : ""
      }
      arrow
      placement="top"
    >
      <span style={{ display: "flex" }}>
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
      </span>
    </Tooltip>
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

  <Stack direction="row" spacing={0.75} flexWrap="wrap">
    <SidebarIconAction
      label="Create invoice"
      disabled={
        !canCreateInvoice(selectedRequest) ||
        isCompleted(selectedRequest) ||
        hasInvoice(selectedRequest)
      }
      disabledReason={
        hasInvoice(selectedRequest)
          ? "An invoice already exists for this request."
          : isCompleted(selectedRequest)
            ? "Completed requests cannot have a new invoice created."
            : "An invoice can only be created for eligible requests."
      }
      icon={<AddCardOutlinedIcon fontSize="small" />}
      onClick={() => openInvoice(selectedRequest)}
    />
    <SidebarIconAction
      label="View invoice"
      disabled={
        !getInvoicePdfUrl({
          ...selectedRequest,
          invoicePdfUrl:
            invoiceUrlsByRequest[selectedRequest.id] ||
            selectedRequest.invoicePdfUrl ||
            selectedRequest.invoice_pdf_url,
        })
      }
      disabledReason="No invoice PDF is available to view."
      icon={<VisibilityOutlinedIcon fontSize="small" />}
      onClick={() => openInvoicePdf(selectedRequest)}
    />
    <SidebarIconAction
      label="Delete invoice"
      color="error"
      disabled={!hasInvoice(selectedRequest) || isCompleted(selectedRequest)}
      disabledReason={
        isCompleted(selectedRequest)
          ? "Invoices cannot be deleted after a request is completed."
          : "There is no invoice to delete."
      }
      icon={<DeleteOutlineIcon fontSize="small" />}
      onClick={() => {
        setInvoiceDeleteError("");
        setInvoiceDeleteRequest(selectedRequest);
      }}
    />
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

  <Stack direction="row" spacing={0.75} flexWrap="wrap">
    <SidebarIconAction
      label="Create report"
      disabled={!canCreateReport(selectedRequest)}
      disabledReason="A report can only be created when the request is report-ready."
      icon={<NoteAddOutlinedIcon fontSize="small" />}
      onClick={() => onCreateReport?.(selectedRequest)}
    />
    <SidebarIconAction
      label="Upload report"
      disabled={selectedCancelled || isCompleted(selectedRequest)}
      disabledReason={
        selectedCancelled
          ? "Reports cannot be uploaded for cancelled requests."
          : "Reports cannot be uploaded after a request is completed."
      }
      icon={<UploadFileOutlinedIcon fontSize="small" />}
      onClick={() => openUpload(selectedRequest)}
    />
    <SidebarIconAction
      label="View uploaded report"
      component="a"
      href={reportDownloadUrl || undefined}
      target="_blank"
      rel="noreferrer"
      disabled={!reportDownloadUrl}
      disabledReason="No uploaded report is available to view."
      icon={<VisibilityOutlinedIcon fontSize="small" />}
    />
    <SidebarIconAction
      label="Delete report"
      color="error"
      disabled={!detailReport?.canDelete || isCompleted(selectedRequest)}
      disabledReason={
        isCompleted(selectedRequest)
          ? "Reports cannot be deleted after a request is completed."
          : "There is no deletable report for this request."
      }
      icon={<DeleteOutlineIcon fontSize="small" />}
      onClick={() => openDeleteConfirmation(selectedRequest)}
    />
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
