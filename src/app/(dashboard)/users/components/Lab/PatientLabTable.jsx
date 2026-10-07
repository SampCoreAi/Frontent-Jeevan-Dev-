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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

const COLUMNS = [
  "SNO",
  "ORDER ID",
  "SAMPLE",
  "LAB",
  "ADDRESS",
  "DOCTOR",
  "TESTS",
  "PRIORITY",
  "REPORT REVIEW",
  "DOCTOR INTERPRETATION / NEXT STEPS",
  "REPORT BY",
  "COLLECTION DATE & TIME",
  "TOKEN",
  "STATUS",
  "REMARKS",
  "REPORT",
  "",
];

const getValue = (...values) => {
  const value = values.find(
    (item) =>
      item !== undefined &&
      item !== null &&
      item !== "",
  );

  return value ?? "-";
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const normalizedValue =
    typeof value === "string"
      ? value.replace(" ", "T")
      : value;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
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

const getUserStatus = (status) => {
  const statusMap = {
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
  };

  return statusMap[status] || status || "Requested";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "COMPLETED":
    case "REPORT_UPLOADED":
    case "REPORT_READY":
      return {
        color: "#15803D",
        backgroundColor: "#F0FDF4",
        borderColor: "#BBF7D0",
      };

    case "REJECTED":
    case "CANCELLED":
      return {
        color: "#B91C1C",
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
      };

    case "PROCESSING":
    case "SAMPLE_COLLECTED":
    case "SAMPLE_SCHEDULED":
      return {
        color: "#0369A1",
        backgroundColor: "#F0F9FF",
        borderColor: "#BAE6FD",
      };

    case "APPROVED":
    case "ACCEPTED":
      return {
        color: "#047857",
        backgroundColor: "#ECFDF5",
        borderColor: "#A7F3D0",
      };

    default:
      return {
        color: "#B45309",
        backgroundColor: "#FFFBEB",
        borderColor: "#FDE68A",
      };
  }
};

const getReviewStyle = (status) => {
  if (status === "REVIEWED") {
    return {
      color: "#15803D",
      backgroundColor: "#F0FDF4",
      borderColor: "#BBF7D0",
    };
  }

  return {
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  };
};

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

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm"),
  );

  const borderColor =
    theme.palette.mode === "dark"
      ? theme.palette.divider
      : "#E2EAE7";

  const cellSx = {
    px: 1.5,
    py: 1.35,

    fontSize: "12.5px",

    color: "text.primary",

    verticalAlign: "middle",

    borderColor,
  };

  const secondaryCellSx = {
    ...cellSx,
    color: "text.secondary",
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,

        border: "1px solid",
        borderColor,

        borderRadius: "12px",

        overflow: "hidden",

        backgroundColor: "background.paper",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",

          "&::-webkit-scrollbar": {
            height: 6,
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#CBD5E1",
            borderRadius: 20,
          },
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 2400,
          }}
        >
          {/* ============================
              HEADER
          ============================ */}

          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#F6F9F8",
              }}
            >
              {COLUMNS.map((column, index) => (
                <TableCell
                  key={`${column}-${index}`}
                  align={
                    index === COLUMNS.length - 1
                      ? "center"
                      : "left"
                  }
                  sx={{
                    px: 1.5,
                    py: 1.4,

                    borderBottom: "1px solid",
                    borderColor,

                    color: "#52615D",

                    fontSize: "10.5px",
                    fontWeight: 700,

                    letterSpacing: "0.045em",

                    whiteSpace: "nowrap",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ============================
              BODY
          ============================ */}

          <TableBody>
            {/* LOADING */}

            {loading &&
              Array.from({ length: 5 }).map(
                (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {COLUMNS.map((_, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          ...cellSx,
                          py: 1.7,
                        }}
                      >
                        <Skeleton
                          variant="rounded"
                          width={
                            cellIndex === 0
                              ? 25
                              : "75%"
                          }
                          height={11}
                          sx={{
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )}

            {/* DATA */}

            {!loading &&
              visibleRows.map((request, index) => {
                const status =
                  request.status || "PENDING";

                const remark =
                  getRequestNote(request);

                const report = request.report;

                const statusStyle =
                  getStatusStyle(status);

                const reviewStyle =
                  getReviewStyle(
                    report?.reviewStatus,
                  );

                return (
                  <TableRow
                    key={
                      request.id ||
                      `${request.labName || "lab"}-${index}`
                    }
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },

                      "&:hover": {
                        backgroundColor: "#FBFDFC",
                      },
                    }}
                  >
                    {/* SNO */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        fontWeight: 700,
                        color: "#64748B",
                      }}
                    >
                      {index +
                        1 +
                        (tablePage - 1) *
                          pageSize}
                    </TableCell>

                    {/* ORDER ID */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 120,

                        fontWeight: 700,
                        color: "#07876A",
                      }}
                    >
                      {request.order_id ||
                        request.orderId ||
                        "-"}
                    </TableCell>

                    {/* SAMPLE */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 110,
                        fontWeight: 600,
                      }}
                    >
                      {request.sample_type ||
                        request.sampleType ||
                        "-"}
                    </TableCell>

                    {/* LAB */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 140,
                        fontWeight: 600,
                      }}
                    >
                      {request.labName || "-"}
                    </TableCell>

                    {/* ADDRESS */}

                    <TableCell
                      sx={{
                        ...secondaryCellSx,

                        minWidth: 190,
                        maxWidth: 230,

                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {getValue(
                        request.lab_address,
                        request.labAddress,
                      )}
                    </TableCell>

                    {/* DOCTOR */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 140,
                      }}
                    >
                      {request.doctorName || "-"}
                    </TableCell>

                    {/* TEST */}

                    <TableCell
                      sx={{
                        ...cellSx,

                        minWidth: 170,
                        maxWidth: 230,

                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {request.testName || "-"}
                    </TableCell>

                    {/* PRIORITY */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 90,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,

                          color:
                            request.priority ===
                            "URGENT"
                              ? "#DC2626"
                              : "#64748B",
                        }}
                      >
                        {request.priority ||
                          "NORMAL"}
                      </Typography>
                    </TableCell>

                    {/* REPORT REVIEW */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 150,
                      }}
                    >
                      {report ? (
                        <Chip
                          size="small"
                          label={String(
                            report.reviewStatus ||
                              "AWAITING_REVIEW",
                          ).replaceAll("_", " ")}
                          variant="outlined"
                          sx={{
                            height: 24,

                            borderRadius: "6px",

                            fontSize: "10px",
                            fontWeight: 700,

                            color:
                              reviewStyle.color,

                            backgroundColor:
                              reviewStyle.backgroundColor,

                            borderColor:
                              reviewStyle.borderColor,

                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* DOCTOR INTERPRETATION */}

                    <TableCell
                      sx={{
                        ...secondaryCellSx,

                        minWidth: 220,
                        maxWidth: 300,

                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {report?.doctorComment ||
                        "Doctor interpretation is not available yet."}
                    </TableCell>

                    {/* REPORT BY */}

                    <TableCell
                      sx={{
                        ...secondaryCellSx,

                        minWidth: 160,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDateTime(
                        request.expected_report_at ||
                          request.expectedReportAt,
                      )}
                    </TableCell>

                    {/* COLLECTION DATE */}

                    <TableCell
                      sx={{
                        ...secondaryCellSx,

                        minWidth: 180,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDateTime(
                        request.collection_slot ||
                          request.collectionSlot,
                      )}
                    </TableCell>

                    {/* TOKEN */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 110,
                      }}
                    >
                      {request.collection_token ||
                      request.collectionToken ? (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#07876A",
                          }}
                        >
                          {request.collection_token ||
                            request.collectionToken}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "text.secondary",
                          }}
                        >
                          Not assigned
                        </Typography>
                      )}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 150,
                      }}
                    >
                      <Chip
                        size="small"
                        label={getUserStatus(status)}
                        variant="outlined"
                        sx={{
                          height: 25,

                          borderRadius: "6px",

                          fontSize: "10.5px",
                          fontWeight: 700,

                          color:
                            statusStyle.color,

                          backgroundColor:
                            statusStyle.backgroundColor,

                          borderColor:
                            statusStyle.borderColor,

                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>

                    {/* REMARKS */}

                    <TableCell
                      sx={{
                        ...secondaryCellSx,

                        minWidth: 170,
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        title={remark || ""}
                        sx={{
                          maxWidth: 190,

                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",

                          fontSize: "12px",
                          color: "text.secondary",
                        }}
                      >
                        {remark || "-"}
                      </Typography>
                    </TableCell>

                    {/* REPORT */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 120,
                      }}
                    >
                      {report?.downloadUrl ? (
                        <Button
                          size="small"
                          variant="text"
                          href={report.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          startIcon={
                            <DescriptionOutlinedIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          }
                          sx={{
                            p: 0,

                            minWidth: "auto",

                            color: "#07876A",

                            fontSize: "12px",
                            fontWeight: 600,

                            textTransform: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View Report
                        </Button>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Not Ready
                        </Typography>
                      )}
                    </TableCell>

                    {/* ACTION */}

                    <TableCell
                      align="center"
                      sx={{
                        ...cellSx,
                        width: 55,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          onMenuOpen?.(
                            event,
                            request,
                          )
                        }
                        sx={{
                          width: 30,
                          height: 30,

                          borderRadius: "7px",

                          color: "#64748B",

                          "&:hover": {
                            color: "#07876A",
                            backgroundColor:
                              "#EDF7F4",
                          },
                        }}
                      >
                        <MoreVertIcon
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

            {/* ============================
                EMPTY STATE
            ============================ */}

            {!loading &&
              visibleRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    sx={{
                      borderBottom: 0,
                      p: 0,
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: 240,

                        display: "flex",
                        flexDirection: "column",

                        alignItems: "center",
                        justifyContent: "center",

                        px: 2,
                        py: 5,

                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,

                          mb: 1.4,

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          borderRadius: "12px",

                          color: "#07876A",

                          backgroundColor:
                            "#EDF7F4",

                          border:
                            "1px solid #DCECE7",
                        }}
                      >
                        <ScienceOutlinedIcon
                          sx={{
                            fontSize: 23,
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,

                          color: "text.primary",
                        }}
                      >
                        No lab tests found
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,

                          maxWidth: 330,

                          fontSize: "11.5px",
                          lineHeight: 1.6,

                          color:
                            "text.secondary",
                        }}
                      >
                        Your lab requests and
                        reports will appear here
                        when they become
                        available.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ============================
          PAGINATION
      ============================ */}

      {!loading && rows.length > 0 && (
        <Box
          sx={{
            minHeight: 58,

            px: 2,
            py: 1.2,

            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "center",
              sm: "flex-end",
            },

            borderTop: "1px solid",
            borderColor,

            backgroundColor: "#FFFFFF",
          }}
        >
          <Pagination
            count={pageCount}
            page={tablePage}
            onChange={(_, value) =>
              onPageChange?.(value)
            }
            size={
              isMobile
                ? "small"
                : "medium"
            }
            color="primary"
            siblingCount={
              isMobile ? 0 : 1
            }
            boundaryCount={1}
          />
        </Box>
      )}
    </Box>
  );
}