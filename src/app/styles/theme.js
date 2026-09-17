import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#70BE72",
      light: "#A5D6A7",
      dark: "#4F9D52",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#4F9D52",
      light: "#EAF6EA",
      dark: "#357A38",
    },

    background: {
      default: "#F7FAF7",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172033",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },

    divider: "#E5ECE9",

    success: {
      main: "#70BE72",
      light: "#ECF8ED",
      dark: "#4F9D52",
    },

    warning: {
      main: "#F4B400",
    },

    error: {
      main: "#DC2626",
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
        },
        containedPrimary: {
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E5ECE9",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#70BE72",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#70BE72",
          },
        },
      },
    },
  },
});

export default theme;