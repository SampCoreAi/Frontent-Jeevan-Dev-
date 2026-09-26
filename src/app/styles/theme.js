"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
  setColorMode: () => {},
});

export const useColorMode = () => {
  return useContext(ColorModeContext);
};

const getTheme = (mode) => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: isDark ? "#2EC4A0" : "#07876A",
        light: isDark ? "#58D4B5" : "#8DDBC7",
        dark: isDark ? "#20A989" : "#066E57",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: isDark ? "#35B99A" : "#159272",
        light: isDark ? "#1D3A35" : "#EDF7F2",
        dark: isDark ? "#249A80" : "#078969",
        contrastText: "#FFFFFF",
      },

      background: {
        default: isDark ? "#0F1419" : "#F8FAF9",
        paper: isDark ? "#171D23" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#F1F5F9" : "#172033",
        secondary: isDark ? "#A7B0BA" : "#596575",
        disabled: isDark ? "#6F7882" : "#7B8491",
      },

      divider: isDark ? "#2A333D" : "#E5ECE9",

      success: {
        main: isDark ? "#34D399" : "#10B981",
        light: isDark ? "#17372F" : "#ECFDF5",
        dark: isDark ? "#20B486" : "#078969",
        contrastText: "#FFFFFF",
      },

      warning: {
        main: isDark ? "#FBBF24" : "#F4B400",
        light: isDark ? "#3A3014" : "#FFF8E1",
        dark: isDark ? "#D99A00" : "#C58F00",
        contrastText: isDark ? "#111827" : "#172033",
      },

      error: {
        main: isDark ? "#F87171" : "#DC2626",
        light: isDark ? "#3D2023" : "#FEF2F2",
        dark: isDark ? "#DC5252" : "#B91C1C",
        contrastText: "#FFFFFF",
      },

      info: {
        main: isDark ? "#38BDF8" : "#0284C7",
        light: isDark ? "#17313E" : "#F0F9FF",
        dark: isDark ? "#1595C8" : "#0369A1",
        contrastText: "#FFFFFF",
      },
    },

    shape: {
      borderRadius: 8,
    },

typography: {
  fontFamily: "var(--font-inter), Arial, Helvetica, sans-serif",
  button: {
    textTransform: "none",
    fontFamily: "var(--font-inter), Arial, Helvetica, sans-serif",
  },

      h1: {
        fontWeight: 700,
      },

      h2: {
        fontWeight: 700,
      },

      h3: {
        fontWeight: 700,
      },

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 700,
      },

      h6: {
        fontWeight: 700,
      },

      body1: {
        color: isDark ? "#F1F5F9" : "#172033",
      },

      body2: {
        color: isDark ? "#A7B0BA" : "#596575",
      },

    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            backgroundColor: isDark ? "#0F1419" : "#F8FAF9",
            overflowY: "scroll",
            scrollbarGutter: "stable",
          },

          body: {
            backgroundColor: isDark ? "#0F1419" : "#F8FAF9",
            color: isDark ? "#F1F5F9" : "#172033",
            transition: "background-color 0.2s ease, color 0.2s ease",
            paddingRight: "0px !important",
          },

          "#__next": {
            minHeight: "100vh",
            backgroundColor: isDark ? "#0F1419" : "#F8FAF9",
          },
        },
      },

      // Keep global modal behavior neutral to avoid leaking MUI modal props
      // to the rendered DOM in React 19 / MUI 7 combinations.
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#171D23" : "#FFFFFF",
            color: isDark ? "#F1F5F9" : "#172033",
            backgroundImage: "none",
            border: isDark
              ? "1px solid #2A333D"
              : "1px solid #E5ECE9",
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.45)"
              : "0 20px 50px rgba(15,23,42,0.15)",
          },
        },
      },

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
            backgroundColor: isDark
              ? "#1FA889"
              : "#0A9F7D",

            color: "#FFFFFF",

            "&:hover": {
              backgroundColor: isDark
                ? "#188D74"
                : "#07876A",

              boxShadow: "none",
            },

            "&.Mui-disabled": {
              backgroundColor: isDark
                ? "#263630"
                : "#D7E7E2",

              color: isDark
                ? "#71807B"
                : "#7B8491",
            },
          },

          outlinedPrimary: {
            color: isDark
              ? "#43CEAC"
              : "#07876A",

            borderColor: isDark
              ? "#367D6D"
              : "#0A9F7D",

            "&:hover": {
              borderColor: isDark
                ? "#43CEAC"
                : "#07876A",

              backgroundColor: isDark
                ? "rgba(46,196,160,0.08)"
                : "#F0FDF8",
            },
          },

          textPrimary: {
            color: isDark
              ? "#43CEAC"
              : "#07876A",

            "&:hover": {
              backgroundColor: isDark
                ? "rgba(46,196,160,0.08)"
                : "#F0FDF8",
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#171D23"
              : "#FFFFFF",

            color: isDark
              ? "#F1F5F9"
              : "#172033",

            border: `1px solid ${
              isDark
                ? "#2A333D"
                : "#E5ECE9"
            }`,

            borderRadius: "12px",

            boxShadow: isDark
              ? "0 4px 14px rgba(0,0,0,0.16)"
              : "0 2px 8px rgba(15,23,42,0.05)",
          },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            color: "inherit",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark
              ? "#171D23"
              : "#FFFFFF",

            color: isDark
              ? "#F1F5F9"
              : "#172033",
          },
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#F1F5F9"
              : "#172033",
          },
        },
      },

      MuiDialogContent: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "8px",

            backgroundColor: isDark
              ? "#12181E"
              : "#FFFFFF",

            color: isDark
              ? "#F1F5F9"
              : "#172033",

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "#53606C"
                : "#9EA9A6",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "#2EC4A0"
                : "#0A9F7D",

              borderWidth: "1px",
            },

            "&.Mui-disabled": {
              backgroundColor: isDark
                ? "#151B20"
                : "#F5F7F6",
            },
          },

          notchedOutline: {
            borderColor: isDark
              ? "#39434D"
              : "#B8C1BF",
          },

          input: {
            "&::placeholder": {
              color: isDark
                ? "#77818B"
                : "#8A94A3",

              opacity: 1,
            },

            "&:-webkit-autofill": {
              WebkitBoxShadow: isDark
                ? "0 0 0 100px #12181E inset"
                : "0 0 0 100px #FFFFFF inset",

              WebkitTextFillColor: isDark
                ? "#F1F5F9"
                : "#172033",

              caretColor: isDark
                ? "#F1F5F9"
                : "#172033",
            },
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#F1F5F9"
              : "#172033",
          },

          input: {
            "&::placeholder": {
              color: isDark
                ? "#77818B"
                : "#8A94A3",

              opacity: 1,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",

            "&.Mui-focused": {
              color: isDark
                ? "#2EC4A0"
                : "#0A9F7D",
            },

            "&.Mui-disabled": {
              color: isDark
                ? "#66717B"
                : "#7B8491",
            },
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",

            "&.Mui-focused": {
              color: isDark
                ? "#2EC4A0"
                : "#0A9F7D",
            },
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#8B959F"
              : "#596575",
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            color: isDark
              ? "#F1F5F9"
              : "#172033",
          },

          icon: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark
              ? "#1A2128"
              : "#FFFFFF",

            border: `1px solid ${
              isDark
                ? "#303A44"
                : "#E5ECE9"
            }`,

            boxShadow: isDark
              ? "0 12px 30px rgba(0,0,0,0.35)"
              : "0 12px 30px rgba(15,23,42,0.12)",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "12.5px",

            color: isDark
              ? "#E8EDF2"
              : "#172033",

            "&:hover": {
              backgroundColor: isDark
                ? "#222B33"
                : "#F4F8F6",
            },

            "&.Mui-selected": {
              backgroundColor: isDark
                ? "rgba(46,196,160,0.12)"
                : "#EDF7F2",

              color: isDark
                ? "#43CEAC"
                : "#07876A",

              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(46,196,160,0.18)"
                  : "#E3F3EC",
              },
            },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: isDark
              ? "#2EC4A0"
              : "#07876A",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",

            textTransform: "none",

            "&.Mui-selected": {
              color: isDark
                ? "#43CEAC"
                : "#07876A",
            },
          },
        },
      },

      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#07876A",

            borderRadius: "8px",
            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: isDark
                ? "#222B33"
                : "#EDF7F2",
            },

            "&.Mui-selected": {
              backgroundColor: isDark
                ? "#1FA889"
                : "#0A9F7D",

              color: "#FFFFFF",
              fontWeight: 600,

              "&:hover": {
                backgroundColor: isDark
                  ? "#188D74"
                  : "#07876A",
              },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            fontWeight: 600,

            backgroundColor: isDark
              ? "#222A31"
              : undefined,

            color: isDark
              ? "#DCE3E8"
              : undefined,
          },

          colorPrimary: {
            backgroundColor: isDark
              ? "rgba(46,196,160,0.12)"
              : "#ECFDF5",

            color: isDark
              ? "#43CEAC"
              : "#078969",
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#63707A"
              : "#8DDBC7",

            "&.Mui-checked": {
              color: isDark
                ? "#2EC4A0"
                : "#0A9F7D",
            },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#63707A"
              : "#8DDBC7",

            "&.Mui-checked": {
              color: isDark
                ? "#2EC4A0"
                : "#0A9F7D",
            },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: isDark
              ? "#77818B"
              : undefined,

            "&.Mui-checked": {
              color: isDark
                ? "#2EC4A0"
                : "#0A9F7D",

              "& + .MuiSwitch-track": {
                backgroundColor: isDark
                  ? "#2EC4A0"
                  : "#0A9F7D",

                opacity: 0.55,
              },
            },
          },

          track: {
            backgroundColor: isDark
              ? "#53606A"
              : "#AAB4B1",
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark
              ? "#E8EDF2"
              : "#172033",

            color: isDark
              ? "#172033"
              : "#FFFFFF",

            borderRadius: "6px",
            fontSize: "12px",
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark
              ? "#2A333D"
              : "#E5ECE9",
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#A7B0BA"
              : "#596575",

            "&:hover": {
              backgroundColor: isDark
                ? "#222B33"
                : "#F1F5F3",
            },
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#171D23"
              : "#FFFFFF",
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#1C242B"
              : "#F8FAF9",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#DCE3E8"
              : "#172033",

            borderColor: isDark
              ? "#2A333D"
              : "#E5ECE9",

            fontSize: "12.5px",
          },

          head: {
            color: isDark
              ? "#AEB8C1"
              : "#596575",

            fontWeight: 600,
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: isDark
                ? "#1C242B"
                : "#F8FAF9",
            },
          },
        },
      },

      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#222A31"
              : "#172033",

            color: "#FFFFFF",
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#29323A"
              : "#E8EEEB",
          },
        },
      },
    },
  });
};

export default function AppThemeProvider({
  children,
}) {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode =
      localStorage.getItem("jeevan-theme");

    if (
      savedMode === "light" ||
      savedMode === "dark"
    ) {
      setMode(savedMode);
    }

    setMounted(true);
  }, []);

  const setColorMode = (newMode) => {
    if (
      newMode !== "light" &&
      newMode !== "dark"
    ) {
      return;
    }

    setMode(newMode);

    localStorage.setItem(
      "jeevan-theme",
      newMode
    );
  };

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode =
        prevMode === "light"
          ? "dark"
          : "light";

      localStorage.setItem(
        "jeevan-theme",
        newMode
      );

      return newMode;
    });
  };

  const theme = useMemo(
    () => getTheme(mode),
    [mode]
  );

  const colorModeValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setColorMode,
    }),
    [mode]
  );

  if (!mounted) {
    return null;
  }

  return (
    <ColorModeContext.Provider
      value={colorModeValue}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export { getTheme };