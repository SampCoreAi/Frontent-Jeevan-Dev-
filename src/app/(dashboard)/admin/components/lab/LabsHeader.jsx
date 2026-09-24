"use client";

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";

const LabsHeader = ({ loading, onRefresh, onAdd }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1.5}
      mb={2}
    >
      <Box>
        <Typography
          fontWeight={700}
          sx={{ color: "text.primary", fontSize: "12.5px" }}
        >
          Labs
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.25 }}>
          Manage diagnostic labs and their access.
        </Typography>
      </Box>

      <Stack
        direction="row"
        gap={1}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          variant="outlined"
          startIcon={
            loading ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <Refresh sx={{ fontSize: 17 }} />
            )
          }
          onClick={onRefresh}
          disabled={loading}
          sx={{ flex: { xs: 1, sm: "initial" } }}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={<Add sx={{ fontSize: 17 }} />}
          onClick={onAdd}
          sx={{ flex: { xs: 1, sm: "initial" } }}
        >
          Add Lab
        </Button>
      </Stack>
    </Stack>
  );
};

export default LabsHeader;