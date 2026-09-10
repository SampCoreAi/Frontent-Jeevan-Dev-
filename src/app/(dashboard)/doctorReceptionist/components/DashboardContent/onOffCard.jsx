import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Paper, Typography, Stack } from "@mui/material";
const onOffCard = () => {
  const theme = useTheme();
  const text = theme.palette.text;
  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md="auto">
          <Paper
            sx={{
              p: 2,
              width: { xs: "100%", md: 580 },
              borderRadius: 0.5,
              border: "1px solid #0f7468",
            }}
          >
            <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="caption" sx={{color: text.primary}}>
                  Last month
                </Typography>
                <Typography variant="h6">Offline patients</Typography>
              </Grid>
              <Grid>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">15</Typography>
                  <Typography
                    color="error"
                    sx={{
                      backgroundColor: "#fee9e9",
                      borderRadius: 20,
                      px: 1,
                    }}
                  >
                    -6.43%
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              sx={{
                height: 80,
                mt: 1,
                background: "linear-gradient(90deg,#e91e63 40%,#fff 100%)",
                borderRadius: 0.5,
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md="auto">
          <Paper
            sx={{
              p: 2,
              width: { xs: "100%", md: 580 },
              borderRadius: 0.5,
              border: "1px solid #0f7468",
            }}
          >
            <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid>
                <Typography variant="caption" sx={{color: text}}>
                  Last month
                </Typography>
                <Typography variant="h6">Online patients</Typography>
              </Grid>
              <Grid>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h5">15</Typography>
                  <Typography
                    color="#0f7468"
                    sx={{
                      backgroundColor: "#e0fef4",
                      borderRadius: 20,
                      px: 1,
                    }}
                  >
                    +6.43%
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              sx={{
                height: 80,
                mt: 1,
                background: "linear-gradient(90deg,#00bcd4 40%,#fff 100%)",
                borderRadius: 0.5,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default onOffCard;
