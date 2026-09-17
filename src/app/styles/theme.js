"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",

    // =========================
    // MAIN BRAND GREEN
    // =========================a
    primary: {
      main: "#07876A",
      light: "#8DDBC7",
      dark: "#07876A",
      contrastText: "#FFFFFF",
    },

    // =========================
    // SECONDARY GREEN
    // =========================
    secondary: {
      main: "#159272",
      light: "#EDF7F2",
      dark: "#078969",
      contrastText: "#FFFFFF",
    },

    // =========================
    // BACKGROUNDS
    // =========================
    background: {
      default: "#F8FAF9",
      paper: "#FFFFFF",
    },

    // =========================
    // TEXT
    // =========================
    text: {
      primary: "#172033",
      secondary: "#596575",
      disabled: "#7B8491",
    },

    // =========================
    // BORDER / DIVIDER
    // =========================
    divider: "#E5ECE9",

    // =========================
    // STATUS
    // =========================
    success: {
      main: "#10B981",
      light: "#ECFDF5",
      dark: "#078969",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#F4B400",
      light: "#FFF8E1",
      dark: "#C58F00",
    },

    error: {
      main: "#DC2626",
      light: "#FEF2F2",
      dark: "#B91C1C",
    },

    info: {
      main: "#0284C7",
      light: "#F0F9FF",
      dark: "#0369A1",
    },
  },

  // =========================
  // BORDER RADIUS
  // =========================
  shape: {
    borderRadius: 8,
  },

  // =========================
  // TYPOGRAPHY
  // =========================
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',

    h1: {
      fontWeight: 700,
      color: "#172033",
    },

    h2: {
      fontWeight: 700,
      color: "#172033",
    },

    h3: {
      fontWeight: 700,
      color: "#172033",
    },

    h4: {
      fontWeight: 700,
      color: "#172033",
    },

    h5: {
      fontWeight: 700,
      color: "#172033",
    },

    h6: {
      fontWeight: 700,
      color: "#172033",
    },

    body1: {
      color: "#172033",
    },

    body2: {
      color: "#596575",
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  // =========================
  // MUI COMPONENTS
  // =========================
  components: {
    // BUTTON
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
        },

        containedPrimary: {
          backgroundColor: "#0A9F7D",
          color: "#FFFFFF",

          "&:hover": {
            backgroundColor: "#07876A",
            boxShadow: "none",
          },
        },

        outlinedPrimary: {
          color: "#07876A",
          borderColor: "#0A9F7D",

          "&:hover": {
            borderColor: "#07876A",
            backgroundColor: "#F0FDF8",
          },
        },
      },
    },

    // CARD
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5ECE9",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        },
      },
    },

    // PAPER
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    // INPUT
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0A9F7D",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0A9F7D",
          },
        },

        notchedOutline: {
          borderColor: "#E5ECE9",
        },
      },
    },

    // INPUT LABEL
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#596575",

          "&.Mui-focused": {
            color: "#0A9F7D",
          },
        },
      },
    },

    // TEXT FIELD
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    // PAGINATION
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#07876A",
          borderRadius: "8px",
          transition: "all 0.2s ease",

          "&:hover": {
            backgroundColor: "#EDF7F2",
          },

          "&.Mui-selected": {
            backgroundColor: "#0A9F7D",
            color: "#FFFFFF",
            fontWeight: 600,

            "&:hover": {
              backgroundColor: "#07876A",
            },
          },
        },
      },
    },

    // CHIP
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          fontWeight: 600,
        },

        colorPrimary: {
          backgroundColor: "#ECFDF5",
          color: "#078969",
        },
      },
    },

    // CHECKBOX
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#8DDBC7",

          "&.Mui-checked": {
            color: "#0A9F7D",
          },
        },
      },
    },

    // RADIO
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#8DDBC7",

          "&.Mui-checked": {
            color: "#0A9F7D",
          },
        },
      },
    },

    // SWITCH
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#0A9F7D",

            "& + .MuiSwitch-track": {
              backgroundColor: "#0A9F7D",
            },
          },
        },
      },
    },

    // TOOLTIP
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#172033",
          color: "#FFFFFF",
          borderRadius: "6px",
          fontSize: "12px",
        },
      },
    },

    // DIVIDER
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5ECE9",
        },
      },
    },
  },
});

export default function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export { theme };