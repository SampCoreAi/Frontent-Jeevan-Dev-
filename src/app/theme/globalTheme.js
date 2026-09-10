"use client";
import React from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: "#f3f5f6",
      paper: "#ffffff",
      primary:"#1e6658",
      secondary: " #dbdbdbff",
      third:"#e4eceb",
      fourth:"#fa001dff"
    },
    text: {
      primary: "#000000",
      secondary: "#ffffffff",
      third: "#1e6658",
      fourth:"#676f7e"
    },
    border:{
      primary: "#000000",
      secondary:"#ffffffff",
      third:"#1e6658",
      light:"#e0e0e0"
    },
    hover:{
      primary:"#439f8e"
    },
   
    
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
