
"use client";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

const COLUMNS = [
  "Order",
  "Patient / Doctor",
  "Tests / Sample",
  "Collection Details",
  "Report Details",
  "Status / Reason",
  "Action",
];

const getValue = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "") ?? "-";

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(
    typeof value === "string" ? value.replace(" ", "T") : value
  );

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const getRequestNote = (request = {}) =>
  request.latest_status_note ||
  request.latestStatusNote ||
  request.status_note ||
  request.note ||
  request.reason ||
  request.statusReason ||
  "";

const getUserStatus = (status) =>
  ({
    PENDING: "Requested",
    REQUESTED: "Requested",
    APPROVED: "Accepted",
    ACCEPTED: "Accepted",
    SAMPLE_SCHEDULED: "Sample Scheduled",
    SAMPLE_COLLECTED: "Sample Collected",
    RECOLLECTION_REQUIRED: "Recollection Required",
    PROCESSING: "Testing",
    REPORT_READY: "Report Ready",
    REPORT_UPLOADED: "Report Ready",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  })[status] || status || "Requested";

const getStatusStyle = (status) => {
  if (["COMPLETED", "REPORT_UPLOADED", "REPORT_READY"].includes(status))
    return { color: "#15803D", bgcolor: "#F0FDF4", borderColor: "#BBF7D0" };

  if (["REJECTED", "CANCELLED"].includes(status))
    return { color: "#B91C1C", bgcolor: "#FEF2F2", borderColor: "#FECACA" };

  if (["PROCESSING", "SAMPLE_COLLECTED", "SAMPLE_SCHEDULED"].includes(status))
    return { color: "#0369A1", bgcolor: "#F0F9FF", borderColor: "#BAE6FD" };

  if (["APPROVED", "ACCEPTED"].includes(status))
    return { color: "#047857", bgcolor: "#ECFDF5", borderColor: "#A7F3D0" };

  return { color: "#B45309", bgcolor: "#FFFBEB", borderColor: "#FDE68A" };
};

const getReviewStyle = (status) =>
  status === "REVIEWED"
    ? { color: "#15803D", bgcolor: "#F0FDF4", borderColor: "#BBF7D0" }
    : { color: "#B45309", bgcolor: "#FFFBEB", borderColor: "#FDE68A" };

const cellSx = {
  px: 1.5,
  py: 1.5,
  fontSize: "12px",
  verticalAlign: "middle",
  borderColor: "#E2EAE7",
};

function InfoLine({ label, value, color = "text.primary", bold = false }) {
  return (
    <Typography
      title={String(value ?? "-")}
      sx={{
        fontSize: "12px",
        lineHeight: 1.8,
        color,
        fontWeight: bold ? 700 : 400,
        overflowWrap: "anywhere",
      }}
    >
      {label && (
        <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
          {label}
        </Box>
      )}
      {value ?? "-"}
    </Typography>
  );
}

function StatusChip({ status }) {
  const style = getStatusStyle(status);

  return (
    <Chip
      size="small"
      label={getUserStatus(status)}
      variant="outlined"
      sx={{
        height: 25,
        maxWidth: "100%",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 700,
        color: style.color,
        bgcolor: style.bgcolor,
        borderColor: style.borderColor,
      }}
    />
  );
}

export default function PatientLabTable({
  rows = [],
  visibleRows = [],
  loading = false,
  tablePage = 1,
  pageCount = 1,
  pageSize = 10,
  onPageChange,
  onMenuOpen,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const borderColor =
    theme.palette.mode === "dark" ? theme.palette.divider : "#E2EAE7";

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        border: "1px solid",
        borderColor,
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <TableContainer sx={{ width: "100%", overflowX: "hidden" }}>
        <Table
          size="small"
          sx={{
            width: "100%",
            tableLayout: "fixed",
            "& th, & td": { boxSizing: "border-box" },
          }}
        >
          <colgroup>
{["15%", "12%", "15%", "16%", "18%", "12%", "8%"].map(
  (width, index) => (
    <col key={index} style={{ width }} />
  )
)}
          </colgroup>

          <TableHead>
            <TableRow sx={{ bgcolor: "#EDF7F2" }}>
              {COLUMNS.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    ...cellSx,
                    color: "#52615D",
                    fontWeight: 700,
                    whiteSpace: "normal",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column} sx={cellSx}>
                      <Skeleton height={18} />
                      <Skeleton width="70%" height={18} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              visibleRows.map((request, index) => {
                const status = request.status || "PENDING";
                const report = request.report;
                const remark = getRequestNote(request);
                const token = getValue(
                  request.collection_token,
                  request.collectionToken
                );

                return (
                  <TableRow
                    key={request.id || request.order_id || index}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { bgcolor: "#FBFDFC" },
                    }}
                  >
                    {/* ORDER */}
                    <TableCell sx={cellSx}>
                      <InfoLine
                        label="Order ID"
                        value={getValue(request.order_id, request.orderId)}
                        color="#07876A"
                        bold
                      />
                      <InfoLine
                        label="Priority"
                        value={request.priority || "NORMAL"}
                        color={
                          request.priority === "URGENT" ? "#DC2626" : "text.secondary"
                        }
                        bold
                      />
                    </TableCell>

                    {/* PATIENT / DOCTOR */}
                    <TableCell sx={cellSx}>
                      <InfoLine
                        label="Patient"
                        value={getValue(request.patientName, request.patient_name, request.patient?.name)}
                        bold
                      />
                      <InfoLine
                        label="Doctor"
                        value={getValue(request.doctorName, request.doctor_name)}
                      />
                    </TableCell>

                    {/* TESTS / SAMPLE */}
                    <TableCell sx={cellSx}>
                      <InfoLine
                        label="Tests"
                        value={getValue(request.testName, request.test_name, request.requested_tests, request.requestedTests)}
                        bold
                      />
                      <InfoLine
                        label="Sample"
                        value={getValue(request.sample_type, request.sampleType)}
                      />
                    </TableCell>

                    {/* COLLECTION */}
                    <TableCell sx={cellSx}>
                      <InfoLine
                        label="Collection"
                        value={formatDateTime(
                          request.collection_slot || request.collectionSlot
                        )}
                      />
                      <InfoLine
                        label="Token"
                        value={token === "-" ? "Not assigned" : token}
                        color="#07876A"
                        bold
                      />
                      <InfoLine
                        label="Expected"
                        value={formatDateTime(
                          request.expected_report_at || request.expectedReportAt
                        )}
                      />
                    </TableCell>

                    {/* REPORT DETAILS */}
                    <TableCell sx={cellSx}>
                      <InfoLine
                        label="Review"
                        value={report?.reviewStatus
                          ? report.reviewStatus.replaceAll("_", " ")
                          : "Not available"}
                      />
                      <InfoLine
                        label="Doctor note"
                        value={report?.doctorComment || "-"}
                      />
                      {report?.downloadUrl ? (
                        <Button
                          href={report.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          startIcon={<DescriptionOutlinedIcon />}
                          sx={{
                            p: 0,
                            minWidth: 0,
                            mt: 0.5,
                            fontSize: "12px",
                            textTransform: "none",
                            color: "#07876A",
                          }}
                        >
                          View Report
                        </Button>
                      ) : (
                        <InfoLine label="Report" value="Not ready" />
                      )}
                    </TableCell>

                    {/* STATUS / REASON */}
                    <TableCell sx={cellSx}>
                      <StatusChip status={status} />
                      {remark && (
                        <Typography
                          title={remark}
                          sx={{
                            mt: 0.75,
                            fontSize: "12px",
                            lineHeight: 1.5,
                            color: "text.secondary",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {remark}
                        </Typography>
                      )}
                    </TableCell>

                    {/* ACTION */}
                    <TableCell align="center" sx={{ ...cellSx, px: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(event) => onMenuOpen?.(event, request)}
                        sx={{
                          width: 30,
                          height: 30,
                          color: "#64748B",
                          border: "1px solid #E2EAE7",
                          borderRadius: "7px",
                          "&:hover": {
                            color: "#07876A",
                            bgcolor: "#EDF7F4",
                          },
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 19 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

            {!loading && visibleRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ borderBottom: 0 }}>
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <ScienceOutlinedIcon
                      sx={{ fontSize: 30, color: "#07876A", mb: 1 }}
                    />
                    <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
                      No lab tests found
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "text.secondary", mt: 0.5 }}
                    >
                      Your lab requests and reports will appear here when available.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && rows.length > 0 && (
        <Box
          sx={{
            minHeight: 58,
            px: 2,
            py: 1.2,
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            borderTop: "1px solid",
            borderColor,
          }}
        >
          <Pagination
            count={pageCount}
            page={tablePage}
            onChange={(_, value) => onPageChange?.(value)}
            size={isMobile ? "small" : "medium"}
            color="primary"
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={1}
          />
        </Box>
      )}
    </Box>
  );
}
