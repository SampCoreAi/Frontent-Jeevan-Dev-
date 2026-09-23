import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function MedicalStoreDialog({
  open,
  onClose,
  stores,
  selectedStoreIds,
  search,
  onSearchChange,
  onToggleStore,
  onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select medical store</DialogTitle>
      <DialogContent dividers>
        <TextField
          size="small"
          fullWidth
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, city or phone"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {stores.length ? (
          <Stack spacing={1.25}>
            {stores.map((store) => (
              <Box
                key={store.id}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  background: selectedStoreIds.includes(store.id) ? "#f0fdf4" : "#fff",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>{store.name}</Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {store.city} • {store.phone}
                  </Typography>
                </Box>
                <Checkbox
                  checked={selectedStoreIds.includes(store.id)}
                  onChange={() => onToggleStore(store.id)}
                  color="success"
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            No matching medical store found.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} sx={{ textTransform: "none" }}>
          Save selection
        </Button>
      </DialogActions>
    </Dialog>
  );
}
