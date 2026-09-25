"use client";

import React from "react";
import {
  Box,
  Button,
  Chip,
  Pagination,
  Stack,
  TableCell,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable, TableFilters } from "./LabUi";

export default function LabReports({
  reports = [],
  loading = false,
  filters,
  page = 1,
  pageSize = 10,
  onPageChange,
  pagination,
  showPrevious = false,
  onShowCurrent,
  onShowPrevious,
  previousReportsCount = 0,
  onReview,
}) {
  const safeReports = Array.isArray(reports) ? reports : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalPages = pagination?.totalPages || Math.max(1, Math.ceil(safeReports.length / safePageSize));

  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(
    startIndex + safePageSize,
    safeReports.length
  );

  const visible = pagination ? safeReports : safeReports.slice(startIndex, endIndex);
  const [reviewReport, setReviewReport] = React.useState(null);
  const [reviewComment, setReviewComment] = React.useState("");
  const [reviewSaving, setReviewSaving] = React.useState(false);

  const getStatusStyle = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "COMPLETED") {
      return {
        color: "#15803D",
      };
    }

    if (value === "REJECTED" || value === "CANCELLED") {
      return {
        color: "#DC2626",
      };
    }

    if (value === "REPORT_UPLOADED") {
      return {
        color: "#0369A1",
      };
    }

    return {
      color: "#64748B",
    };
  };

  const cellSx = {
    fontSize: "12.5px",
    color: "#334155",
    py: 1.5,
    borderColor: "#E8EDF0",
    bgcolor: "#FFFFFF",
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
          mb: 2,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "16px" },
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#172033",
            }}
          >
            Lab Reports
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: "12.5px",
              lineHeight: 1.4,
              color: "#64748B",
            }}
          >
            View lab test requests and uploaded reports.
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <TableFilters {...filters} />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          borderRadius: "8px",
        }}
      >
        <DataTable
          columns={[
            "SNO",
            "REPORT ID",
            "PATIENT",
            "LAB",
            "TEST",
            "STATUS",
            "REVIEW",
            "UPLOADED",
            "DOWNLOAD",
          ]}
          loading={loading}
          emptyMessage="No reports found."
          footer={
            safeReports.length > 0 ? (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{
                  width: "100%",
                  bgcolor: "#FFFFFF",
                  py: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11.5px",
                    color: "#718087",
                  }}
                >
                  Showing{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {startIndex + 1}-{endIndex}
                  </Box>{" "}
                  of{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {safeReports.length}
                  </Box>
                </Typography>

                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => onPageChange?.(value)}
                  size="small"
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      minWidth: 30,
                      height: 30,
                      borderRadius: "6px",
                      fontSize: "11.5px",
                    },
                    "& .Mui-selected": {
                      fontWeight: 700,
                    },
                  }}
                />
              </Stack>
            ) : null
          }
        >
          {visible.map((report, index) => {
            const status =
              report.status ||
              report.request_status ||
              "REPORT_UPLOADED";

            const uploadedAt =
              report.uploadedAt ||
              report.uploaded_at ||
              report.reportedAt ||
              report.reported_at ||
              report.createdAt ||
              report.created_at ||
              null;

            const statusStyle = getStatusStyle(status);

            return (
              <TableRow
                key={report.id || index}
                sx={{
                  bgcolor: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#F8FBFC",
                  },
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    ...cellSx,
                    fontWeight: 600,
                    width: 70,
                  }}
                >
                  {startIndex + index + 1}
                </TableCell>

                <TableCell
                  sx={{
                    ...cellSx,
                    fontWeight: 700,
                    color: "#1F2937",
                    letterSpacing: 0.2,
                  }}
                >
                  {report.reportCode || report.report_code || "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  {report.patientName ||
                    report.patient_name ||
                    report.patientId ||
                    "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  {report.labName ||
                    report.lab_name ||
                    report.labId ||
                    "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  {Array.isArray(
                    report.requestedTests ||
                      report.requested_tests
                  )
                    ? (
                        report.requestedTests ||
                        report.requested_tests
                      ).join(", ")
                    : report.testName ||
                      report.test_name ||
                      report.requestedTests ||
                      report.requested_tests ||
                      "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  <Chip
                    size="small"
                    label={String(status).replaceAll("_", " ")}
                    variant="outlined"
                    sx={{
                      height: 23,
                      color: statusStyle.color,
                      bgcolor: "transparent",
                      border: 0,
                      fontSize: "9.5px",
                      fontWeight: 700,
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </TableCell>

                <TableCell sx={{ ...cellSx, minWidth: 170 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                    <Chip
                      size="small"
                      label={String(report.reviewStatus || report.review_status || "AWAITING_REVIEW").replaceAll("_", " ")}
                      sx={{ height: 23, fontSize: "9.5px", fontWeight: 700, bgcolor: "transparent", border: 0, color: (report.reviewStatus || report.review_status) === "REVIEWED" ? "#15803D" : "#B45309" }}
                    />
                    {onReview && report.downloadUrl && Number.isInteger(Number(report.id)) ? (
                      <Button
                        size="small"
                        onClick={() => {
                          setReviewReport(report);
                          setReviewComment(report.doctorComment || report.doctor_comment || "");
                        }}
                        sx={{ minWidth: 0, px: 0.5, fontSize: "11px", textTransform: "none" }}
                      >
                        Review
                      </Button>
                    ) : null}
                  </Stack>
                </TableCell>

                <TableCell
                  sx={{
                    ...cellSx,
                    color: "#64748B",
                  }}
                >
                  {uploadedAt
                    ? new Date(uploadedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  {report.downloadUrl ? (
                    <Button
                      size="small"
                      href={report.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{
                        minWidth: 0,
                        px: 0.75,
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#07876A",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#F0FDF8",
                        },
                      }}
                    >
                      Open PDF
                    </Button>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#94A3B8",
                      }}
                    >
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </DataTable>
      </Box>

      <Dialog
        open={Boolean(reviewReport)}
        onClose={() => !reviewSaving && setReviewReport(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Doctor interpretation and next steps</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {reviewReport?.reportCode || reviewReport?.report_code || "Selected report"}
          </Typography>
          <TextField
            label="What the result means and what to do next"
            multiline
            minRows={4}
            value={reviewComment}
            onChange={(event) => setReviewComment(event.target.value)}
            placeholder="Explain what the report shows, whether it looks normal or concerning, and what the patient should do next."
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewReport(null)} disabled={reviewSaving} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={reviewSaving || !reviewReport}
            onClick={async () => {
              setReviewSaving(true);
              const saved = await onReview(reviewReport.id, reviewComment.trim() || null);
              setReviewSaving(false);
              if (saved !== false) setReviewReport(null);
            }}
            sx={{ textTransform: "none" }}
          >
            {reviewSaving ? "Saving..." : "Save interpretation"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}