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
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: "15px", sm: "17px" },
            fontWeight: 700,
            lineHeight: 1.3,
            color: "text.primary",
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              mt: 0.4,
              fontSize: { xs: "11.5px", sm: "12.5px" },
              fontWeight: 400,
              lineHeight: 1.5,
              color: "text.secondary",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {action && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },
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
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: `1px solid ${colors.border}`, borderRadius: "10px", bgcolor: colors.primaryLight }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1.5}>
          <Box>
            <Typography sx={{ color: colors.primary, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em" }}>{eyebrow}</Typography>
            <Typography sx={{ color: colors.text, fontSize: { xs: "18px", sm: "21px" }, fontWeight: 800, mt: 0.5 }}>{title}</Typography>
            <Typography sx={{ color: colors.secondary, fontSize: "12px", mt: 0.4 }}>{subtitle}</Typography>
          </Box>
          <Chip size="small" label={statusLabel || "UNKNOWN"} color={statusLabel === "ACTIVE" ? "success" : "default"} />
        </Stack>
      </Paper>

      <SectionTitle title="Overview" description={subtitle} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, mb: 2 }}>
        {stats.map(([label, value, color]) => (
          <Paper key={label} elevation={0} sx={{ p: 1.75, minHeight: 92, border: `1px solid ${colors.border}`, borderRadius: "10px" }}>
            <Typography sx={{ color: colors.secondary, fontSize: "12px", fontWeight: 600 }}>{label}</Typography>
            <Typography sx={{ color: color || colors.primary, fontSize: "24px", fontWeight: 800, mt: 0.5 }}>{value}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.3fr 0.7fr" }, gap: 2 }}>
        <Paper elevation={0} sx={{ p: { xs: 1.75, sm: 2.25 }, border: `1px solid ${colors.border}`, borderRadius: "10px" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box><Typography sx={{ color: colors.text, fontWeight: 800 }}>{profileFields?.title}</Typography><Typography sx={{ color: colors.secondary, fontSize: "12px", mt: 0.35 }}>{profileFields?.description}</Typography></Box>
            {profilePath ? <Button size="small" variant="outlined" onClick={() => onNavigate?.(profilePath)}>{profileButtonLabel}</Button> : null}
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
            {(profileFields?.items || []).map(([label, value]) => <Box key={label}><Typography sx={{ color: colors.muted, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Typography><Typography sx={{ color: colors.text, fontSize: "13px", fontWeight: 650, mt: 0.35 }}>{value || "-"}</Typography></Box>)}
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ p: { xs: 1.75, sm: 2.25 }, border: `1px solid ${colors.border}`, borderRadius: "10px" }}>
          <Typography sx={{ color: colors.text, fontWeight: 800 }}>Quick actions</Typography>
          <Typography sx={{ color: colors.secondary, fontSize: "12px", mt: 0.35, mb: 1.5 }}>{quickActions?.description}</Typography>
          <Stack spacing={1}>{(quickActions?.items || []).map((action) => <Button key={action.label} fullWidth variant={action.variant || "outlined"} onClick={() => onNavigate?.(action.route)} sx={{ justifyContent: "flex-start", ...(action.variant === "contained" ? { bgcolor: colors.primary, color: "#fff", "&:hover": { bgcolor: "#066f58" } } : {}) }}>{action.label}</Button>)}</Stack>
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
}) {
  const hasFilters = Boolean(search || status || date);

  const fieldSx = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      height: 40,
      bgcolor: "#FFFFFF",
      borderRadius: "8px",
      fontSize: "12.5px",
      transition: "all 0.15s ease",
      "& fieldset": {
        borderColor: colors.border,
      },
      "&:hover fieldset": {
        borderColor: "#A7B4C4",
      },
      "&.Mui-focused fieldset": {
        borderWidth: "1px",
        borderColor: colors.primary,
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(7,135,106,0.07)",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "12.5px",
      color: colors.text,
    },
    "& .MuiOutlinedInput-input::placeholder": {
      color: colors.muted,
      opacity: 1,
    },
  };

  const handleReset = () => {
    onSearch?.("");
    onStatus?.("");
    onDate?.("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        mt: 2,
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 1, md: 1.25 },
        borderRadius: "12px",
      }}
    >
      

      <TextField
        size="small"
        placeholder="Search lab, doctor or test"
        value={search}
        onChange={(event) => onSearch?.(event.target.value)}
        sx={{
          ...fieldSx,
          width: { xs: "100%", md: 320 },
          flexShrink: 0,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  fontSize: 18,
                  color: colors.muted,
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {statusOptions.length > 0 ? (
        <TextField
          select
          size="small"
          value={status}
          onChange={(event) => onStatus?.(event.target.value)}
          sx={{
            ...fieldSx,
            width: { xs: "100%", md: 190 },
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
                  mt: 0.5,
                  p: 0.5,
                  maxHeight: 300,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  "& .MuiMenuItem-root": {
                    minHeight: 36,
                    px: 1.2,
                    fontSize: "12.5px",
                    borderRadius: "6px",
                    color: colors.text,
                    "&:hover": {
                      bgcolor: colors.primaryLight,
                    },
                    "&.Mui-selected": {
                      bgcolor: `${colors.primaryLight} !important`,
                      color: colors.primary,
                      fontWeight: 600,
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
      ) : null}

      <TextField
        size="small"
        type="date"
        value={date}
        onChange={(event) => onDate?.(event.target.value)}
        sx={{
          ...fieldSx,
          width: { xs: "100%", md: 185 },
          flexShrink: 0,
        }}
        inputProps={{
          max: "9999-12-31",
        }}
      />

      <Box
        sx={{
          ml: { md: "auto" },
          pl: { md: 1.5 },
          display: "flex",
          justifyContent: { xs: "flex-end", md: "center" },
          borderLeft: {
            xs: "none",
            md: `1px solid ${colors.border}`,
          },
          flexShrink: 0,
        }}
      >
        <Button
          disabled={!hasFilters}
          onClick={handleReset}
          startIcon={
            <RestartAltRoundedIcon
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          sx={{
            height: 40,
            minWidth: 92,
            px: 1.5,
            borderRadius: "8px",
            border: `1px solid ${colors.primary}35`,
            bgcolor: colors.primaryLight,
            color: colors.primary,
            fontSize: "12.5px",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              bgcolor: colors.primaryHover,
              borderColor: colors.primary,
            },
            "&.Mui-disabled": {
              bgcolor: "#F8FAFC",
              borderColor: colors.border,
              color: "#B0BAC7",
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Paper>
  );
}