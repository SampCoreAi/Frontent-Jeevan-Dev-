"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Snackbar,
  useTheme,
} from "@mui/material";

import Card from "../../components/Qr/Card";
import QRTable from "../../components/Qr/QRTable";

const Page = () => {
  const theme = useTheme();

  const [numberOfQR, setNumberOfQR] =
    useState("");

  const [qrData, setQrData] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(
      /\/$/,
      ""
    );

  // Snackbar
  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (
    event,
    reason
  ) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Fetch QR
  const getQRDetails = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token");

        if (!token) {
          showMessage(
            "Authentication token not found.",
            "error"
          );

          setQrData([]);
          setTotal(0);

          return;
        }

        const response = await axios.get(
          `${API_URL}/api/QR/details`,
          {
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },

            headers: {
              Authorization: `Bearer ${token}`,
            },

            signal,
          }
        );

        const data =
          response?.data?.data || [];

        const pagination =
          response?.data?.pagination;

        setQrData(
          Array.isArray(data) ? data : []
        );

        setTotal(
          Number(pagination?.total) || 0
        );
      } catch (error) {
        // Ignore cancelled request
        if (
          error?.code === "ERR_CANCELED" ||
          error?.name === "CanceledError"
        ) {
          return;
        }

        console.error(
          "QR details error:",
          error
        );

        setQrData([]);
        setTotal(0);

        const message =
          error?.response?.data?.message ||
          "Unable to load QR codes.";

        showMessage(message, "error");
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [API_URL, page, rowsPerPage]
  );

  // Fetch on pagination change
  useEffect(() => {
    const controller =
      new AbortController();

    getQRDetails(controller.signal);

    return () => {
      controller.abort();
    };
  }, [getQRDetails]);

  // Generate QR
  const handleGenerateQR = async () => {
    const count = Number(numberOfQR);

    // Frontend validation
    if (!numberOfQR) {
      showMessage(
        "Please enter number of QR codes.",
        "warning"
      );

      return;
    }

    if (
      !Number.isInteger(count) ||
      count <= 0
    ) {
      showMessage(
        "Please enter a valid QR count.",
        "warning"
      );

      return;
    }

    try {
      setGenerating(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        showMessage(
          "Authentication token not found.",
          "error"
        );

        return;
      }

      const response = await axios.post(
        `${API_URL}/api/QR/generate`,
        {
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showMessage(
        response?.data?.message ||
          `${count} QR code${
            count > 1 ? "s" : ""
          } generated successfully.`,
        "success"
      );

      setNumberOfQR("");

      // New QR usually appears on first page
      if (page !== 0) {
        setPage(0);
      } else {
        await getQRDetails();
      }
    } catch (error) {
      console.error(
        "Generate QR error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to generate QR codes.";

      showMessage(message, "error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: 8.5,
          height:"90.5vh",
          p: { xs: 1.5, sm: 2.5, md: 3 },
          bgcolor: "background.paper",
          boxShadow: theme.shadows[1],
        }}
      >
        <Card
          numberOfQR={numberOfQR}
          setNumberOfQR={setNumberOfQR}
          handleGenerateQR={
            handleGenerateQR
          }
          generating={generating}
        />

        <QRTable
          qrData={qrData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={
            setRowsPerPage
          }
          total={total}
          loading={loading}
          showMessage={showMessage}
        />
      </Box>

      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleCloseSnackbar}
          sx={{
            width: "100%",
            borderRadius: 1.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Page;