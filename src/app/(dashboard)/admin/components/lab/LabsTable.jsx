"use client";

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
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  LocationOnOutlined,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";

/* =========================================
   TABLE COLUMNS
========================================= */

const COLUMNS = [
  "LAB",
  "OWNER",
  "CONTACT",
  "STATUS",
  "DOCTORS",
  "REQUESTS",
  "ACTION",
];

/* =========================================
   COMPONENT
========================================= */

const LabsTable = ({
  loading = false,
  labs = [],
  filteredLabs = [],
  visibleLabs = [],
  totalPages = 1,
  tablePage = 1,
  onPageChange,
  statusLabId,
  onStatusChange,
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  /* =========================================
     HELPERS
  ========================================= */

  const getDisplayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  const getAddress = (lab) => {
    // Existing backend single address
    if (lab?.address) {
      return lab.address;
    }

    // Structured address support
    const addressParts = [
      lab?.building_plot,
      lab?.buildingPlot,

      lab?.street_name,
      lab?.streetName,

      lab?.area_locality,
      lab?.areaLocality,

      lab?.landmark,

      lab?.city,

      lab?.district,

      lab?.state,

      lab?.pin_code,
      lab?.pinCode,
    ].filter(Boolean);

    return addressParts.join(", ");
  };

  /* =========================================
     LOADING
  ========================================= */

  const renderLoading = () => (
    <TableRow>
      <TableCell
        colSpan={COLUMNS.length}
        align="center"
        sx={{
          py: 7,
          borderBottom: 0,
        }}
      >
        <CircularProgress
          size={26}
          color="primary"
        />

        <Typography
          sx={{
            mt: 1,
            fontSize: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          Loading labs...
        </Typography>
      </TableCell>
    </TableRow>
  );

  /* =========================================
     EMPTY STATE
  ========================================= */

  const renderEmpty = () => (
    <TableRow>
      <TableCell
        colSpan={COLUMNS.length}
        align="center"
        sx={{
          py: 7,
          borderBottom: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {labs.length
            ? "No matching labs found"
            : "No labs found"}
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: "11px",
            color: theme.palette.text.secondary,
          }}
        >
          {labs.length
            ? "Try changing your search or filters."
            : "Registered labs will appear here."}
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {/* =====================================
          TABLE
      ====================================== */}

      <TableContainer
        sx={{
          width: "100%",

          maxHeight: {
            xs: "calc(100vh - 390px)",
            md: "calc(100vh - 360px)",
          },

          overflowX: "auto",
          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: 5,
            height: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: theme.palette.divider,
            borderRadius: 5,
          },

          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            minWidth: 900,

            "& .MuiTableCell-root": {
              fontSize: "12px",
              borderColor: theme.palette.divider,
            },
          }}
        >
          {/* =================================
              TABLE HEADER
          ================================== */}

          <TableHead>
            <TableRow>
              {COLUMNS.map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    py: 1.25,
                    px: 1.5,

                    fontSize: "11px !important",
                    fontWeight: 700,

                    color: theme.palette.text.secondary,

                    bgcolor:
                      theme.palette.background.default,

                    whiteSpace: "nowrap",

                    letterSpacing: "0.25px",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* =================================
              TABLE BODY
          ================================== */}

          <TableBody>
            {loading && renderLoading()}

            {!loading &&
              filteredLabs.length === 0 &&
              renderEmpty()}

            {!loading &&
              visibleLabs.map((lab) => {
                const isActive =
                  String(
                    lab?.status || ""
                  ).toUpperCase() === "ACTIVE";

                const changing =
                  statusLabId === lab?.id;

                const address = getAddress(lab);

                return (
                  <TableRow
                    key={lab?.id}
                    hover
                    sx={{
                      transition:
                        "background-color 0.15s ease",

                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* =========================
                        LAB
                    ========================== */}

                    <TableCell
                      sx={{
                        py: 1.3,
                        px: 1.5,
                        minWidth: 170,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,

                          color:
                            theme.palette.text.primary,

                          lineHeight: 1.4,
                        }}
                      >
                        {getDisplayValue(
                          lab?.lab_name
                        )}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: "10.5px",

                          color:
                            theme.palette.text
                              .secondary,
                        }}
                      >
                        Code:{" "}
                        {getDisplayValue(
                          lab?.lab_code
                        )}
                      </Typography>
                    </TableCell>

                    {/* =========================
                        OWNER
                    ========================== */}

                    <TableCell
                      sx={{
                        minWidth: 180,
                        px: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,

                          color:
                            theme.palette.text.primary,
                        }}
                      >
                        {getDisplayValue(
                          lab?.admin_name
                        )}
                      </Typography>

                      <Tooltip
                        title={lab?.email || ""}
                        arrow
                      >
                        <Typography
                          sx={{
                            mt: 0.25,

                            maxWidth: 190,

                            fontSize: "10.5px",

                            color:
                              theme.palette.text
                                .secondary,

                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getDisplayValue(
                            lab?.email
                          )}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* =========================
                        CONTACT + ADDRESS
                    ========================== */}

                    <TableCell
                      sx={{
                        minWidth: 220,
                        px: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,

                          color:
                            theme.palette.text.primary,
                        }}
                      >
                        {getDisplayValue(
                          lab?.phone_number
                        )}
                      </Typography>

                      {address && (
                        <Tooltip
                          title={address}
                          arrow
                          placement="top"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={0.4}
                            sx={{
                              mt: 0.35,
                              maxWidth: 230,
                            }}
                          >
                            <LocationOnOutlined
                              sx={{
                                flexShrink: 0,
                                fontSize: 13,

                                color:
                                  theme.palette.text
                                    .secondary,
                              }}
                            />

                            <Typography
                              sx={{
                                minWidth: 0,

                                fontSize: "10.5px",

                                color:
                                  theme.palette.text
                                    .secondary,

                                overflow: "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {address}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* =========================
                        STATUS
                    ========================== */}

                    <TableCell
                      sx={{
                        px: 1.5,
                        minWidth: 100,
                      }}
                    >
                      <Chip
                        size="small"
                        label={
                          isActive
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          isActive
                            ? "success"
                            : "default"
                        }
                        variant="outlined"
                        sx={{
                          height: 23,

                          borderRadius: 1.2,

                          "& .MuiChip-label": {
                            px: 1,
                            fontSize: "10px",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </TableCell>

                    {/* =========================
                        DOCTORS
                    ========================== */}

                    <TableCell
                      sx={{
                        px: 1.5,
                        minWidth: 80,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,

                          color:
                            theme.palette.text.primary,
                        }}
                      >
                        {Number(
                          lab?.doctor_count || 0
                        )}
                      </Typography>
                    </TableCell>

                    {/* =========================
                        REQUESTS
                    ========================== */}

                    <TableCell
                      sx={{
                        px: 1.5,
                        minWidth: 90,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,

                          color:
                            theme.palette.text.primary,
                        }}
                      >
                        {Number(
                          lab?.request_count || 0
                        )}
                      </Typography>
                    </TableCell>

                    {/* =========================
                        ACTION
                    ========================== */}

                    <TableCell
                      sx={{
                        px: 1.5,
                        minWidth: 125,
                      }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        color={
                          isActive
                            ? "warning"
                            : "success"
                        }
                        disabled={changing}
                        onClick={() =>
                          onStatusChange?.(lab)
                        }
                        startIcon={
                          changing ? (
                            <CircularProgress
                              size={13}
                              color="inherit"
                            />
                          ) : isActive ? (
                            <ToggleOff
                              sx={{
                                fontSize: 17,
                              }}
                            />
                          ) : (
                            <ToggleOn
                              sx={{
                                fontSize: 17,
                              }}
                            />
                          )
                        }
                        sx={{
                          minWidth: 100,

                          px: 1,

                          fontSize: "11px",

                          textTransform: "none",

                          whiteSpace: "nowrap",

                          borderRadius: 1.5,
                        }}
                      >
                        {changing
                          ? "Updating..."
                          : isActive
                            ? "Deactivate"
                            : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =====================================
          PAGINATION
      ====================================== */}

      {!loading &&
        filteredLabs.length > 0 && (
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            justifyContent="space-between"
            gap={1.2}
            sx={{
              px: 1.5,
              py: 1.25,

              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* RESULT COUNT */}

            <Typography
              sx={{
                fontSize: "11px",
                color:
                  theme.palette.text.secondary,
              }}
            >
              Showing{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  color:
                    theme.palette.text.primary,
                }}
              >
                {visibleLabs.length}
              </Box>{" "}
              of{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  color:
                    theme.palette.text.primary,
                }}
              >
                {filteredLabs.length}
              </Box>{" "}
              results
            </Typography>

            {/* PAGINATION */}

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={tablePage}
                onChange={(_, value) =>
                  onPageChange?.(value)
                }
                size="small"
                color="primary"
                siblingCount={
                  isMobile ? 0 : 1
                }
                boundaryCount={
                  isMobile ? 1 : 1
                }
                sx={{
                  alignSelf: {
                    xs: "center",
                    sm: "auto",
                  },

                  "& .MuiPaginationItem-root": {
                    fontSize: "11px",
                    minWidth: 30,
                    height: 30,
                  },
                }}
              />
            )}
          </Stack>
        )}
    </>
  );
};

export default LabsTable;