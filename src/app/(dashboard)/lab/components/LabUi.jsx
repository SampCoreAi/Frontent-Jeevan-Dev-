"use client";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

const colors = {
  primary: "#07876A",
  primaryLight: "#ECF8F5",
  primaryHover: "#DFF3EE",
  text: "#111827",
  secondary: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  background: "#FFFFFF",
  header: "#F8FAFC",
  hover: "#F8FBFA",
};

export function SectionTitle({ title, description, action }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 2 },
        mb: 1.75,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "17px", sm: "19px" },
              fontWeight: 750,
              lineHeight: 1.25,
              color: "#172033",
              letterSpacing: "-0.35px",
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                mt: 0.35,
                maxWidth: 650,
                fontSize: { xs: "11.5px", sm: "12.5px" },
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#718087",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>

      {action && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },

            "& .MuiButton-root": {
              minHeight: 38,
              borderRadius: "8px",
              px: 1.8,
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
            },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}

export function DataTable({
  columns = [],
  children,
  loading = false,
  emptyMessage = "No records found.",
  footer,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        borderRadius: "10px",
        bgcolor: colors.background,
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.border} transparent`,
          "&::-webkit-scrollbar": {
            height: "5px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#CBD5E1",
            borderRadius: "20px",
          },
        }}
      >
        <Table
          size="small"
          sx={{
            width: "100%",
            minWidth: { xs: 850, md: 1000 },
            tableLayout: "auto",
            "& .MuiTableCell-root": {
              borderColor: colors.border,
            },
            "& .MuiChip-root": {
              height: 23,
              borderRadius: "6px",
              fontSize: "10.5px",
              fontWeight: 600,
            },
            "& .MuiChip-label": {
              px: 1,
            },
            "& .MuiButton-root": {
              minHeight: 30,
              px: 1.3,
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    height: 42,
                    py: 0.8,
                    px: { xs: 1.2, sm: 1.5 },
                    fontSize: "10.5px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    color: "#64748B",
                    bgcolor: "#F8FAFC",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableRow-root": {
                transition: "background-color 0.15s ease",
              },
              "& .MuiTableRow-root:hover": {
                bgcolor: "#F8FAFC",
              },
              "& .MuiTableCell-root": {
                height: 48,
                py: 0.8,
                px: { xs: 1.2, sm: 1.5 },
                fontSize: "12.5px",
                fontWeight: 400,
                lineHeight: 1.4,
                color: colors.text,
                whiteSpace: "nowrap",
              },
              "& .MuiTableRow-root:last-of-type .MuiTableCell-root": {
                borderBottom: 0,
              },
            }}
          >
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  align="center"
                  sx={{
                    height: "160px !important",
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 130,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <CircularProgress
                      size={23}
                      thickness={4}
                      sx={{
                        color: colors.primary,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: colors.secondary,
                      }}
                    >
                      Loading records...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : children ? (
              children
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  align="center"
                  sx={{
                    height: "150px !important",
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 500,
                        color: colors.secondary,
                      }}
                    >
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {footer ? (
        <Box
          sx={{
            minHeight: 48,
            px: { xs: 1, sm: 1.5 },
            py: 0.7,
            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "center",
              sm: "flex-end",
            },
            borderTop: `1px solid ${colors.border}`,
            bgcolor: "#FFFFFF",
            "& .MuiPagination-ul": {
              flexWrap: "nowrap",
              gap: 0.2,
            },
            "& .MuiPaginationItem-root": {
              minWidth: 29,
              height: 29,
              m: 0,
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              color: colors.secondary,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "#F1F5F9",
              },
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              bgcolor: `${colors.primary} !important`,
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: `${colors.primary} !important`,
              },
            },
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Paper>
  );
}

export function WorkspaceDashboard({
  eyebrow,
  title,
  subtitle,
  statusLabel,
  stats = [],
  profileFields,
  quickActions,
  profileButtonLabel = "View profile",
  profilePath,
  onNavigate,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          border: `1px solid ${colors.border}`,
          borderRadius: "10px",
          bgcolor: colors.primaryLight,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1.5}
        >
          <Box>
            <Typography
              sx={{
                color: colors.primary,
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              sx={{
                color: colors.text,
                fontSize: { xs: "18px", sm: "21px" },
                fontWeight: 800,
                mt: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{ color: colors.secondary, fontSize: "12px", mt: 0.4 }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={statusLabel || "UNKNOWN"}
            color={statusLabel === "ACTIVE" ? "success" : "default"}
          />
        </Stack>
      </Paper>

      <SectionTitle title="Overview" description={subtitle} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        {stats.map(([label, value, color]) => (
          <Paper
            key={label}
            elevation={0}
            sx={{
              p: 1.75,
              minHeight: 92,
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                color: colors.secondary,
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                color: color || colors.primary,
                fontSize: "24px",
                fontWeight: 800,
                mt: 0.5,
              }}
            >
              {value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.3fr 0.7fr" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography sx={{ color: colors.text, fontWeight: 800 }}>
                {profileFields?.title}
              </Typography>
              <Typography
                sx={{ color: colors.secondary, fontSize: "12px", mt: 0.35 }}
              >
                {profileFields?.description}
              </Typography>
            </Box>
            {profilePath ? (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onNavigate?.(profilePath)}
              >
                {profileButtonLabel}
              </Button>
            ) : null}
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {(profileFields?.items || []).map(([label, value]) => (
              <Box key={label}>
                <Typography
                  sx={{
                    color: colors.muted,
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: colors.text,
                    fontSize: "13px",
                    fontWeight: 650,
                    mt: 0.35,
                  }}
                >
                  {value || "-"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
          }}
        >
          <Typography sx={{ color: colors.text, fontWeight: 800 }}>
            Quick actions
          </Typography>
          <Typography
            sx={{
              color: colors.secondary,
              fontSize: "12px",
              mt: 0.35,
              mb: 1.5,
            }}
          >
            {quickActions?.description}
          </Typography>
          <Stack spacing={1}>
            {(quickActions?.items || []).map((action) => (
              <Button
                key={action.label}
                fullWidth
                variant={action.variant || "outlined"}
                onClick={() => onNavigate?.(action.route)}
                sx={{
                  justifyContent: "flex-start",
                  ...(action.variant === "contained"
                    ? {
                        bgcolor: colors.primary,
                        color: "#fff",
                        "&:hover": { bgcolor: "#066f58" },
                      }
                    : {}),
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
export function TableFilters({
  search = "",
  status = "",
  date = "",
  onSearch,
  onStatus,
  onDate,
  statusOptions = [],
  leftAction = null,
  onReset,
}) {
  const hasFilters = Boolean(search || status || date);

  const fieldSx = {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      height: 38,
      bgcolor: "#FFFFFF",
      borderRadius: "8px",
      fontSize: "12px",
      transition: "all 0.16s ease",

      "& fieldset": {
        borderColor: "#E2E8F0",
      },

      "&:hover fieldset": {
        borderColor: "#B7C3CF",
      },

      "&.Mui-focused fieldset": {
        borderWidth: "1px",
        borderColor: "#07876A",
      },

      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(7, 135, 106, 0.07)",
      },
    },

    "& .MuiOutlinedInput-input": {
      fontSize: "12px",
      color: "#172033",
      py: 0,
    },

    "& .MuiOutlinedInput-input::placeholder": {
      color: "#94A3B8",
      opacity: 1,
    },

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#475569",
    },
  };

  const handleReset = () => {
    onSearch?.("");
    onStatus?.("");
    onDate?.("");
    onReset?.();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: { xs: 1, sm: 1.1 },
        border: "1px solid #E5EAEF",
        borderRadius: "10px",
        bgcolor: "#FAFCFC",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.02)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: { xs: "stretch", lg: "center" },
          flexDirection: { xs: "column", lg: "row" },
          gap: 1,
        }}
      >
        {/* SEARCH */}
        <TextField
          size="small"
          placeholder="Search patient, order ID, test..."
          value={search}
          onChange={(event) => onSearch?.(event.target.value)}
          sx={{
            ...fieldSx,
            width: {
              xs: "100%",
              lg: 330,
            },
            flexShrink: 0,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    fontSize: 17,
                    color: search ? "#07876A" : "#94A3B8",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* STATUS */}
        {statusOptions.length > 0 && (
          <TextField
            select
            size="small"
            value={status}
            onChange={(event) => onStatus?.(event.target.value)}
            sx={{
              ...fieldSx,
              width: {
                xs: "100%",
                sm: 190,
              },
              flexShrink: 0,
            }}
            SelectProps={{
              displayEmpty: true,

              renderValue: (selected) =>
                selected
                  ? String(selected).replaceAll("_", " ")
                  : "All statuses",

              MenuProps: {
                PaperProps: {
                  sx: {
                    mt: 0.6,
                    p: 0.5,
                    maxHeight: 300,
                    border: "1px solid #E2E8F0",
                    borderRadius: "9px",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.10)",

                    "& .MuiMenuItem-root": {
                      minHeight: 34,
                      px: 1.2,
                      fontSize: "12px",
                      borderRadius: "6px",
                      color: "#334155",

                      "&:hover": {
                        bgcolor: "#F0F9F6",
                      },

                      "&.Mui-selected": {
                        bgcolor: "#E8F6F2 !important",
                        color: "#07876A",
                        fontWeight: 700,
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="">All statuses</MenuItem>

            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {String(option).replaceAll("_", " ")}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* DATE */}
        <TextField
          size="small"
          type="date"
          value={date}
          onChange={(event) => onDate?.(event.target.value)}
          sx={{
            ...fieldSx,
            width: {
              xs: "100%",
              sm: 170,
            },
            flexShrink: 0,
          }}
          inputProps={{
            max: "9999-12-31",
          }}
        />

        {/* RIGHT ACTIONS */}
        <Box
          sx={{
            ml: { lg: "auto" },

            display: "flex",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },

            width: {
              xs: "100%",
              lg: "auto",
            },

            gap: 0.8,

            pl: {
              lg: 1.25,
            },

            borderLeft: {
              xs: "none",
              lg: "1px solid #E2E8F0",
            },

            flexShrink: 0,
          }}
        >
          {leftAction && (
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },

                display: "flex",

                "& .MuiButton-root": {
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  height: "38px !important",
                  minHeight: "38px !important",
                  borderRadius: "8px !important",
                  fontSize: "11.5px !important",
                  fontWeight: "650 !important",
                  whiteSpace: "nowrap",
                },
              }}
            >
              {leftAction}
            </Box>
          )}

          {/* RESET */}
          <Button
            disabled={!hasFilters}
            onClick={handleReset}
            startIcon={
              <RestartAltRoundedIcon
                sx={{
                  fontSize: "16px !important",
                }}
              />
            }
            sx={{
              height: 38,

              width: {
                xs: "100%",
                sm: "auto",
              },

              minWidth: 82,
              px: 1.35,

              borderRadius: "8px",
              border: "1px solid #DCE6E2",

              bgcolor: "#FFFFFF",
              color: "#52646B",

              fontSize: "11.5px",
              fontWeight: 650,
              textTransform: "none",

              "&:hover": {
                bgcolor: "#F0F9F6",
                borderColor: "#A9D8CC",
                color: "#07876A",
              },

              "&.Mui-disabled": {
                bgcolor: "#F8FAFC",
                color: "#B5BEC8",
                borderColor: "#EDF1F4",
              },
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* ACTIVE FILTER INDICATOR */}
      {hasFilters && (
        <Box
          sx={{
            mt: 0.8,
            pt: 0.8,
            borderTop: "1px solid #EDF1F4",

            display: "flex",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <FilterAltOutlinedIcon
            sx={{
              fontSize: 14,
              color: "#07876A",
            }}
          />

          <Typography
            sx={{
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#718087",
            }}
          >
            Filters applied
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
