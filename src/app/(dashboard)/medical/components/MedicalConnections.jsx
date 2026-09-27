"use client";

import {
  Box,
  Button,
  Chip,
  Pagination,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";

import {
  DataTable,
  SectionTitle,
  TableFilters,
} from "../../lab/components/LabUi";

export default function MedicalConnections({
  connections = [],
  loading = false,
  filters,
  page = 1,
  pageSize = 10,
  onPageChange,
  actionId,
  onStatusUpdate,
}) {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const safeConnections = Array.isArray(connections)
    ? connections
    : [];

  const safePageSize =
    Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalItems = safeConnections.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / safePageSize)
  );

  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    totalPages
  );

  const startIndex =
    (currentPage - 1) * safePageSize;

  const endIndex = Math.min(
    startIndex + safePageSize,
    totalItems
  );

  const visibleConnections =
    safeConnections.slice(
      startIndex,
      endIndex
    );

  const formatDate = (value) => {
    if (!value) return "-";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePageChange = (_, value) => {
    onPageChange?.(value);
  };

  const handleStatusUpdate = (
    connectionId,
    nextStatus
  ) => {
    if (!connectionId) return;

    if (typeof onStatusUpdate !== "function") {
      return;
    }

    if (
      !["APPROVED", "REJECTED"].includes(
        nextStatus
      )
    ) {
      return;
    }

    onStatusUpdate(
      connectionId,
      nextStatus
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Approved",
          bgcolor: "#ECFDF3",
          color: "#15803D",
          border: "#BBF7D0",
        };

      case "PENDING":
        return {
          label: "Pending",
          bgcolor: "#FFF7ED",
          color: "#C2410C",
          border: "#FED7AA",
        };

      case "REJECTED":
        return {
          label: "Rejected",
          bgcolor: "#FEF2F2",
          color: "#DC2626",
          border: "#FECACA",
        };

      default:
        return {
          label: status || "Unknown",
          bgcolor: "#F8FAFC",
          color: "#64748B",
          border: "#E2E8F0",
        };
    }
  };

  const SkeletonRow = ({ index }) => {
    return (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Skeleton
              variant="rounded"
              width={32}
              height={32}
              sx={{
                borderRadius: "7px",
              }}
            />

            <Skeleton
              variant="text"
              width={110}
              height={20}
            />
          </Stack>
        </TableCell>

        <TableCell>
          <Skeleton
            variant="text"
            width={145}
            height={20}
          />
        </TableCell>

        <TableCell>
          <Skeleton
            variant="text"
            width={95}
            height={20}
          />
        </TableCell>

        <TableCell>
          <Skeleton
            variant="text"
            width={90}
            height={20}
          />
        </TableCell>

        <TableCell>
          <Skeleton
            variant="rounded"
            width={72}
            height={24}
            sx={{
              borderRadius: "12px",
            }}
          />
        </TableCell>

        <TableCell>
          <Stack
            direction="row"
            spacing={0.7}
          >
            <Skeleton
              variant="rounded"
              width={68}
              height={30}
            />

            <Skeleton
              variant="rounded"
              width={68}
              height={30}
            />
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const EmptyRow = () => {
    return (
      <TableRow>
        <TableCell
          colSpan={6}
          sx={{
            borderBottom: "none",
            p: 0,
          }}
        >
          <Box
            sx={{
              minHeight: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 4,
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
              sx={{
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "#F1F7F5",
                  color: "#07876A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LinkOffRoundedIcon
                  sx={{
                    fontSize: 23,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                No doctor connections
              </Typography>

              <Typography
                sx={{
                  maxWidth: 330,
                  fontSize: "10.5px",
                  lineHeight: 1.5,
                  color: "#84959B",
                }}
              >
                Doctor connection requests will
                appear here when a doctor sends a
                request to your medical store.
              </Typography>
            </Stack>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        bgcolor: "white",
        height:"90vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1250px",
          mx: "auto",
        }}
      >
        <SectionTitle
          title="Doctor Connections"
          description="Review and manage doctor connection requests for your medical store."
        />

        <Box
          sx={{
            mt: 1.5,
          }}
        >
          <TableFilters
            {...filters}
            statusOptions={[
              "PENDING",
              "APPROVED",
              "REJECTED",
            ]}
          />
        </Box>

        <Box
          sx={{
            mt: 1.5,
            border: "1px solid #E1E8E6",
            borderRadius: "9px",
            overflow: "hidden",
            bgcolor: "#FFFFFF",

            "& table": {
              minWidth: 850,
            },

            "& thead th": {
              bgcolor: "#F8FAF9",
              color: "#64748B",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              borderBottom:
                "1px solid #E4EAE8",
              py: 1.25,
            },

            "& tbody td": {
              borderBottom:
                "1px solid #EEF2F1",
              py: 1.25,
            },

            "& tbody tr:last-of-type td": {
              borderBottom: "none",
            },
          }}
        >
          <DataTable
            columns={[
              "DOCTOR",
              "EMAIL",
              "PHONE",
              "REQUESTED",
              "STATUS",
              "ACTION",
            ]}
            loading={false}
            emptyMessage=""
            footer={
              !loading && totalItems > 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    px: 2,
                    py: 1.2,
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      color: "#84959B",
                    }}
                  >
                    Showing{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      {startIndex + 1}-
                      {endIndex}
                    </Box>{" "}
                    of{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      {totalItems}
                    </Box>{" "}
                    connections
                  </Typography>

                  {totalPages > 1 && (
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={
                        handlePageChange
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
                      sx={{
                        "& .MuiPaginationItem-root":
                          {
                            minWidth: 30,
                            height: 30,
                            fontSize: "11px",
                            borderRadius: "6px",
                          },

                        "& .Mui-selected": {
                          bgcolor:
                            "#07876A !important",
                          color: "#FFFFFF",
                        },
                      }}
                    />
                  )}
                </Box>
              ) : null
            }
          >
            {loading ? (
              <>
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <SkeletonRow
                    key={index}
                    index={index}
                  />
                ))}
              </>
            ) : visibleConnections.length ===
              0 ? (
              <EmptyRow />
            ) : (
              visibleConnections.map(
                (connection, index) => {
                  const connectionId =
                    connection?.connection_id ||
                    connection?.id;

                  const doctorName =
                    connection?.doctor_name ||
                    connection?.doctorName ||
                    connection?.full_name ||
                    "-";

                  const doctorEmail =
                    connection?.doctor_email ||
                    connection?.email ||
                    "-";

                  const doctorPhone =
                    connection?.doctor_phone ||
                    connection?.phone ||
                    "-";

                  const status = String(
                    connection?.status ||
                      "PENDING"
                  ).toUpperCase();

                  const isPending =
                    status === "PENDING";

                  const isUpdating =
                    String(actionId) ===
                    String(connectionId);

                  const statusStyle =
                    getStatusStyle(status);

                  return (
                    <TableRow
                      key={
                        connectionId ||
                        `${doctorName}-${index}`
                      }
                      hover
                      sx={{
                        transition:
                          "background 0.15s ease",

                        "&:hover": {
                          bgcolor:
                            "#FBFDFC !important",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "7px",
                              bgcolor:
                                "#EDF7F3",
                              color:
                                "#07876A",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              flexShrink: 0,
                            }}
                          >
                            <PersonOutlineRoundedIcon
                              sx={{
                                fontSize: 17,
                              }}
                            />
                          </Box>

                          <Typography
                            sx={{
                              fontSize:
                                "12.5px",
                              fontWeight: 600,
                              color:
                                "#26373D",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {doctorName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography
                          title={doctorEmail}
                          sx={{
                            maxWidth: 190,
                            fontSize: "12px",
                            color: "#596575",
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doctorEmail}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#596575",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doctorPhone}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "#718087",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(
                            connection?.requested_at ||
                              connection?.created_at
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            statusStyle.label
                          }
                          sx={{
                            height: 23,
                            bgcolor:
                              statusStyle.bgcolor,
                            color:
                              statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontSize: "9.5px",
                            fontWeight: 700,
                            textTransform:
                              "uppercase",

                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {isPending ? (
                          <Stack
                            direction="row"
                            spacing={0.7}
                            alignItems="center"
                          >
                            <Button
                              size="small"
                              variant="contained"
                              disabled={
                                isUpdating ||
                                !connectionId
                              }
                              startIcon={
                                <CheckRoundedIcon
                                  sx={{
                                    fontSize:
                                      "15px !important",
                                  }}
                                />
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  connectionId,
                                  "APPROVED"
                                )
                              }
                              sx={{
                                minWidth: 78,
                                height: 30,
                                px: 1.1,
                                borderRadius:
                                  "6px",
                                bgcolor:
                                  "#07876A",
                                fontSize:
                                  "10.5px",
                                fontWeight: 600,
                                textTransform:
                                  "none",
                                boxShadow: "none",

                                "&:hover": {
                                  bgcolor:
                                    "#066F58",
                                  boxShadow:
                                    "none",
                                },
                              }}
                            >
                              {isUpdating
                                ? "Saving..."
                                : "Accept"}
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              disabled={
                                isUpdating ||
                                !connectionId
                              }
                              startIcon={
                                <CloseRoundedIcon
                                  sx={{
                                    fontSize:
                                      "15px !important",
                                  }}
                                />
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  connectionId,
                                  "REJECTED"
                                )
                              }
                              sx={{
                                minWidth: 76,
                                height: 30,
                                px: 1.1,
                                borderRadius:
                                  "6px",
                                color:
                                  "#DC2626",
                                borderColor:
                                  "#FECACA",
                                bgcolor:
                                  "#FFFFFF",
                                fontSize:
                                  "10.5px",
                                fontWeight: 600,
                                textTransform:
                                  "none",

                                "&:hover": {
                                  borderColor:
                                    "#FCA5A5",
                                  bgcolor:
                                    "#FEF2F2",
                                },
                              }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#94A3B8",
                            }}
                          >
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            )}
          </DataTable>
        </Box>
      </Box>
    </Box>
  );
}