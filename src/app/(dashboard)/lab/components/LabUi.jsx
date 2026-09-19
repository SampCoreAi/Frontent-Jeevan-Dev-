"use client";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
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
