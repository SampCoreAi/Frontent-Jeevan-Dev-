"use client";

import { Tooltip, useMediaQuery } from "@mui/material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TableFilters } from "../LabUi";

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

function RequestField({ label, children }) {
  const control = ["Technician", "Report by", "Status", "Actions"].includes(
    label,
  );
  return (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        flexDirection: control ? "column" : "row",
        gap: 0.4,
        alignItems: control ? "stretch" : "baseline",
      }}
    >
      {label ? (
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "#74807B",
            flexShrink: 0,
          }}
        >
          {label}
        </Typography>
      ) : null}
      <Box sx={{ fontSize: 12, color: "#172033", minWidth: 0, flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

export default function LabRequestsTable({
  filters,
  showDelayedOnly,
  pendingUploadCount,
  onToggleDelayedUpload,
  totalPages,
  currentPage,
  safeRequests,
  startIndex,
  endIndex,
  visible,
  loading,
  selectedRequest,
  setSelectedRequestId,
  getStatusStyle,
  getPriorityStyle,
  onPageChange,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Box sx={{ mb: 1.5, width: "100%" }}>
        <TableFilters
          {...filters}
          statusOptions={REQUEST_STATUSES}
          hasExtraFilter={showDelayedOnly}
          leftAction={
            <Button
              variant={showDelayedOnly ? "contained" : "outlined"}
              size="small"
              disabled={pendingUploadCount === 0}
              onClick={onToggleDelayedUpload}
              sx={{
                minWidth: { xs: "100%", md: 190 },
                height: 38,
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: showDelayedOnly ? "#0B5C8E" : "#FFFFFF",
                color: showDelayedOnly ? "#FFFFFF" : "#0B5C8E",
                borderColor: "#B8D1E2",
                boxShadow: "none",
              }}
            >
              {showDelayedOnly
                ? `Showing ${pendingUploadCount} delayed`
                : "Pending uploads"}
            </Button>
          }
          onReset={() => {
            if (showDelayedOnly) onToggleDelayedUpload?.();
          }}
        />
      </Box>

      <Box
        sx={{
          border: "1px solid #DDE7E3",

          borderRadius: 1.5,

          minWidth: 0,

          bgcolor: "#fff",
        }}
      >
        <Table
          size="small"
          aria-label="Test requests"
          sx={{
            width: "100%",

            tableLayout: "fixed",

            "& th": {
              bgcolor: "#edf7f2",

              fontSize: 11,

              height: "40px",

              fontWeight: 700,

              color: "#64748B",

              py: 1,
            },

            "& td": {
              verticalAlign: "top",

              py: 1,

              fontSize: 12,

              overflowWrap: "anywhere",
            },

            "& th, & td": { px: 1, borderColor: "#EDF1F3", minWidth: 0 },

            "& tbody tr:last-child td": { borderBottom: 0 },

            "& .MuiSelect-select": {
              whiteSpace: "normal",

              overflowWrap: "anywhere",

              paddingRight: "24px !important",
            },

            [theme.breakpoints.down("md")]: {
              "& thead": { display: "none" },

              "& tbody": { display: "block" },

              "& tbody tr": {
                display: "grid",

                gridTemplateColumns: "repeat(3,minmax(0,1fr))",

                borderBottom: "1px solid #DDE7E3",
              },

              "& tbody td": { display: "block", borderBottom: 0 },

              "& tbody tr:last-child": { borderBottom: 0 },

              "& tbody td:last-child": { gridColumn: "1 / -1" },

              "& tbody td[colspan]": { gridColumn: "1 / -1" },
            },

            [theme.breakpoints.down("sm")]: {
              "& tbody tr": { gridTemplateColumns: "repeat(2,minmax(0,1fr))" },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "13%" }}>Order</TableCell>

              <TableCell sx={{ width: "17%" }}>Patient / doctor</TableCell>

              <TableCell sx={{ width: "16%" }}>Tests / sample</TableCell>

              <TableCell sx={{ width: "14%" }}>Collection details</TableCell>

              <TableCell sx={{ width: "23%" }}>
                Technician / report due
              </TableCell>

              <TableCell sx={{ width: "17%" }}>Status / reason</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ textAlign: "center", py: "32px !important" }}
                >
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ textAlign: "center", py: "32px !important" }}
                >
                  No test requests found.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((request, index) => {
                const status = String(
                  request?.status || "PENDING",
                ).toUpperCase();

                const priority = String(
                  request?.priority || "NORMAL",
                ).toUpperCase();

                const statusStyle = getStatusStyle(status);

                const priorityStyle = getPriorityStyle(priority);

                const reason =
                  request.latest_status_note ||
                  request.latestStatusNote ||
                  request.status_note ||
                  request.note;

                return (
                  <TableRow
                    key={request.id}
                    onClick={() => setSelectedRequestId(request.id)}
                    onKeyDown={(event) => {
                      if (
                        event.target === event.currentTarget &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        setSelectedRequestId(request.id);
                      }
                    }}
                    tabIndex={0}
                    aria-selected={selectedRequest?.id === request.id}
                    sx={{
                      cursor: "pointer",
                      bgcolor:
                        selectedRequest?.id === request.id ? "#edf7f2" : "#fff",
                      "&:hover": { bgcolor: "#f2f8f5" },
                      "&:focus-visible": {
                        outline: "2px solid #159272",
                        outlineOffset: -2,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack spacing={0.5}>
                        <RequestField>
                          {request.order_id || request.orderId || "-"}
                        </RequestField>

                        <RequestField>
                          <Chip
                            size="small"
                            label={priority}
                            variant="outlined"
                            sx={{
                              height: 23,

                              bgcolor: "transparent",

                              color: priorityStyle.color,

                              border: 0,

                              fontSize: "9.5px",

                              fontWeight: 700,

                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        </RequestField>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <RequestField>
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: "#24363D",
                            }}
                          >
                            {request.patient_name || request.patient_id || "-"}
                          </Typography>
                        </RequestField>

                        <RequestField>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#52646B",
                            }}
                          >
                            {{
                              1: "Patient",

                              2: "Doctor",

                              3: "Assistant",

                              4: "Lab",

                              5: "Admin",

                              7: "Technician",
                            }[Number(request.created_by_role_id)] || "Unknown"}

                            {" · "}

                            {request.created_by_name || "-"}
                          </Typography>
                        </RequestField>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <RequestField>
                          <Typography
                            sx={{
                              fontSize: "12px",

                              color: "#52646B",

                              lineHeight: 1.45,
                            }}
                          >
                            {Array.isArray(request.requested_tests)
                              ? request.requested_tests.join(", ")
                              : request.requested_tests || "-"}
                          </Typography>
                        </RequestField>

                        <RequestField>
                          <Typography
                            sx={{ fontSize: "12.5px", fontWeight: 600 }}
                          >
                            {request.sample_type || request.sampleType || "-"}
                          </Typography>
                        </RequestField>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.8} sx={{ minWidth: 0 }}>
                        <RequestField>
                          {request.collection_slot || request.collectionSlot ? (
                            <Typography
                              sx={{
                                fontSize: 11.5,
                                color: "#52646B",
                                lineHeight: 1.5,
                              }}
                            >
                              {new Date(
                                request.collection_slot ||
                                  request.collectionSlot,
                              ).toLocaleString()}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{ fontSize: 11.5, color: "#94A3B8" }}
                            >
                              Not scheduled
                            </Typography>
                          )}
                        </RequestField>

                        {request.collection_token || request.collectionToken ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "#74807B",
                              }}
                            >
                              Token
                            </Typography>

                            <Chip
                              size="small"
                              label={
                                request.collection_token ||
                                request.collectionToken
                              }
                              sx={{
                                height: 22,

                                borderRadius: "6px",

                                bgcolor: "#edf7f2",

                                color: "#1e6658",

                                fontSize: 11,

                                fontWeight: 700,

                                "& .MuiChip-label": { px: 1 },
                              }}
                            />
                          </Box>
                        ) : null}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <RequestField>
                          {request.assigned_technician_name || "Not assigned"}
                        </RequestField>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          size="small"
                          label={status.replaceAll("_", " ")}
                          sx={{
                            ...statusStyle,
                            width: "fit-content",
                            maxWidth: "100%",
                            height: 23,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                        {reason ? (
                          <Tooltip title={reason} arrow placement="top">
                            <Typography
                              noWrap
                              sx={{ fontSize: 10.5, color: "#64748B" }}
                            >
                              {reason}
                            </Typography>
                          </Tooltip>
                        ) : null}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 1.5 }}>
        {safeRequests.length > 0 ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap={1.5}
            sx={{
              width: "100%",

              px: { xs: 0.5, sm: 1 },

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
              <Box component="span" sx={{ fontWeight: 700, color: "#334155" }}>
                {startIndex + 1}-{endIndex}
              </Box>{" "}
              of{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#334155" }}>
                {safeRequests.length}
              </Box>
            </Typography>

            <Pagination
              count={totalPages}
              page={Math.min(currentPage, totalPages) - 1}
              onChange={(_, value) => onPageChange?.(value + 1)}
              size="small"
              color="primary"
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={1}
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
        ) : null}
      </Box>
    </>
  );
}
