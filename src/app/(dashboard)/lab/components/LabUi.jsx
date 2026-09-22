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

export function SectionTitle({ title, description, action }) {
  return (
    <Box className="lab-workspace__section-title">
      <Box display="flex" justifyContent="space-between" alignItems={{ sm: "flex-end" }} gap={2} flexDirection={{ xs: "column", sm: "row" }}>
        <Box>
          <Typography variant="h4" sx={{ color: "#123f66", fontWeight: 750, lineHeight: 1.15 }}>{title}</Typography>
        </Box>
        {action}
      </Box>
    </Box>
  );
}

export function DataTable({ columns, children, loading, emptyMessage, footer }) {
  return (
    <Paper elevation={0} className="lab-workspace__table-shell" sx={{ borderRadius: "4px" }}>
      <TableContainer className="lab-workspace__table-scroll">
        <Table size="small">
          <TableHead><TableRow>{columns.map((column) => <TableCell key={column}>{column}</TableCell>)}</TableRow></TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}><CircularProgress size={32} sx={{ color: "#0b5c8e" }} /><Typography sx={{ mt: 1, color: "#64748b" }}>Loading...</Typography></TableCell></TableRow>
            ) : children || (
              <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 8, color: "#64748b" }}>{emptyMessage}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {footer ? <Box sx={{ px: 2, py: 1, borderTop: "1px solid #dbe4e8", display: "flex", justifyContent: "flex-end", bgcolor: "#fbfcfc" }}>{footer}</Box> : null}
    </Paper>
  );
}

export function WorkspaceDashboard({
  eyebrow,
  title,
  subtitle,
  statusLabel,
  stats,
  profileFields,
  quickActions,
  profileButtonLabel = "View profile",
  profilePath,
  onNavigate,
}) {
  return (
    <>
      <Paper elevation={0} className="lab-workspace__hero" sx={{ color: "#123f66", background: "#eaf5fb", boxShadow: "none", border: "1px solid #cfe3ef" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ fontSize: "0.58rem", letterSpacing: "0.12em", fontWeight: 800, color: "#0b5c8e" }}>{eyebrow}</Typography>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.12rem" }, fontWeight: 750, mt: 0.35, color: "#123f66" }}>{title}</Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "#65767b", mt: 0.25 }}>{subtitle}</Typography>
          </Box>
          <Chip size="small" label={statusLabel || "UNKNOWN"} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, bgcolor: "#d7f0e7", color: "#14734f", fontWeight: 700, position: "relative", zIndex: 1 }} />
        </Stack>
      </Paper>

      <SectionTitle title="Overview" description={subtitle || "A clear view of your workspace overview."} />

      <Box className="lab-workspace__kpis">
        {stats.map(([label, value, color]) => (
          <Paper key={label} elevation={0} sx={{ p: { xs: 1.75, md: 2 }, minHeight: 104, border: "1px solid #cfe3ef", borderRadius: "4px" }}>
            <Typography variant="body2" sx={{ color: "#65767b", fontWeight: 650 }}>{label}</Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 700, mt: 0.5 }}>{value}</Typography>
          </Paper>
        ))}
      </Box>

      <Box className="lab-workspace__split">
        <Paper elevation={0} className="lab-workspace__surface">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography sx={{ color: "#123f66", fontWeight: 750, fontSize: "1rem" }}>{profileFields.title}</Typography>
              <Typography sx={{ color: "#65767b", mt: 0.35 }}>{profileFields.description}</Typography>
            </Box>
            {profilePath ? (
              <Button size="small" variant="outlined" onClick={() => onNavigate(profilePath)}>{profileButtonLabel}</Button>
            ) : null}
          </Stack>

          <Box className="lab-workspace__profile-grid">
            {profileFields.items.map(([label, value]) => (
              <Box key={label}>
                <Typography variant="caption" sx={{ color: "#70858c", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Typography>
                <Typography sx={{ color: "#1f2937", fontWeight: 650, mt: 0.35 }}>{value || "-"}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper elevation={0} className="lab-workspace__surface">
          <Typography sx={{ color: "#123f66", fontWeight: 750, fontSize: "1rem" }}>Quick actions</Typography>
          <Typography sx={{ color: "#65767b", mt: 0.35, mb: 2 }}>{quickActions.description}</Typography>
          <Stack spacing={1}>
            {quickActions.items.map((action) => (
              <Button
                key={action.label}
                fullWidth
                variant={action.variant || "outlined"}
                onClick={() => onNavigate(action.route)}
                sx={{ justifyContent: "flex-start", ...(action.variant === "contained" ? { bgcolor: "#0b5c8e" } : {}) }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export function TableFilters({ search, status, date, onSearch, onStatus, onDate, statusOptions = [] }) {
  return (
    <Box className="lab-workspace__filter-bar">
      <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.06em", mr: 0.5 }}>FILTERS</Typography>
      <TextField size="small" label="Search records" value={search} onChange={(event) => onSearch(event.target.value)} sx={{ minWidth: { md: 280 } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#789096", fontSize: 18 }} /></InputAdornment> }} />
      {statusOptions.length ? <TextField select size="small" label="Status" value={status} onChange={(event) => onStatus(event.target.value)} sx={{ minWidth: { md: 190 } }}><MenuItem value="">All statuses</MenuItem>{statusOptions.map((option) => <MenuItem key={option} value={option}>{option.replaceAll("_", " ")}</MenuItem>)}</TextField> : null}
      <TextField size="small" type="date" label="Date" value={date} onChange={(event) => onDate(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: { md: 170 } }} />
      <Button variant="text" sx={{ color: "#0b5c8e", fontWeight: 700 }} onClick={() => { onSearch(""); onStatus(""); onDate(""); }}>Reset</Button>
    </Box>
  );
}
