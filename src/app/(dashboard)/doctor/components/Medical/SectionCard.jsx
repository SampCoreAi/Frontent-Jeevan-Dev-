import { Box, Paper, Stack, Typography } from "@mui/material";

export default function SectionCard({ title, subtitle, action, children, sx = {} }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
        background: "#fff",
        ...sx,
      }}
    >
      {(title || action) && (
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 2 }}>
          <Box>
            {title && (
              <Typography variant="h6" sx={{ color: "#123f66", fontWeight: 800 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      {children}
    </Paper>
  );
}
