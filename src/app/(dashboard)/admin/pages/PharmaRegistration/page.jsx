
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import PharmacyRegistrationDetailsDialog from "../../components/pharmacy/registration/PharmacyRegistrationDetailsDialog";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";

import RegistrationTable from "../../components/pharmacy/registration/RegistrationTable";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://13.203.192.191:4000"
).replace(/\/+$/, "");

const API_URL =
  `${API_BASE_URL}/api/pharmacy-registration/getAllPharmacyRegistrations`;

const formatLabel = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

function DetailSection({ title, data }) {
  if (!data || typeof data !== "object") return null;

  const entries = Object.entries(data).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      typeof value !== "object"
  );

  if (!entries.length) return null;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          mb: 1.5,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={2}>
        {entries.map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.secondary",
                mb: 0.5,
              }}
            >
              {formatLabel(key)}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                overflowWrap: "anywhere",
              }}
            >
              {formatValue(value)}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

function PharmacyDetailsDialog({ registration, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(registration);
  }, [registration]);

  const pharmacyData = data?.registrationData || {};

  const documentEntries = Object.entries(data?.documents || {});

  return (
    <Dialog
      open={Boolean(registration)}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            Pharmacy Registration Details
          </Typography>

          <Typography
            sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
          >
            Registration ID: {data?.id ?? "-"}
          </Typography>
        </Box>

        <IconButton onClick={onClose} aria-label="Close details">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {data && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 2.5,
              }}
            >
              {data.onboardingStatus && (
  <Chip
    size="small"
    label={formatLabel(data.onboardingStatus)}
    color={
      data.onboardingStatus === "APPROVED"
        ? "success"
        : data.onboardingStatus === "REJECTED"
        ? "error"
        : data.onboardingStatus === "SUBMITTED"
        ? "info"
        : "default"
    }
  />
)}
{typeof data.storeEmailVerified === "boolean" && (
  <Chip
    size="small"
    variant="outlined"
    label={`Store Email: ${
      data.storeEmailVerified ? "Verified" : "Not Verified"
    }`}
    color={data.storeEmailVerified ? "success" : "default"}
  />
)}

{typeof data.signatoryEmailVerified === "boolean" && (
  <Chip
    size="small"
    variant="outlined"
    label={`Signatory Email: ${
      data.signatoryEmailVerified ? "Verified" : "Not Verified"
    }`}
    color={data.signatoryEmailVerified ? "success" : "default"}
  />
)}
            </Box>

            <DetailSection
              title="Pharmacy Information"
              data={{
                licensedTradeName: pharmacyData.licensedTradeName,
                legalEntityName: pharmacyData.legalEntityName,
                entityType: pharmacyData.entityType,
                storeEmail: data.storeEmail || pharmacyData.storeEmail,
                storePhone: pharmacyData.storePhone,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              }}
            />

            <DetailSection
              title="Premises Details"
              data={pharmacyData.premisesDetails}
            />

            <DetailSection
              title="Signatory Details"
              data={pharmacyData.signatoryDetails}
            />

            <DetailSection
              title="Pharmacist Details"
              data={pharmacyData.pharmacistDetails}
            />

            <DetailSection
              title="Drug Licence Details"
              data={pharmacyData.drugLicenceDetails}
            />

            <DetailSection
              title="Additional Registration Information"
              data={{
                declarationAccepted: pharmacyData.declarationAccepted,
                retentionFeeRequired: pharmacyData.retentionFeeRequired,
                collectPlatformPayments:
                  pharmacyData.collectPlatformPayments,
                appointmentLetterRequired:
                  pharmacyData.appointmentLetterRequired,
                handlesColdChainMedicines:
                  pharmacyData.handlesColdChainMedicines,
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Documents
            </Typography>

            {documentEntries.length === 0 ? (
              <Typography
                sx={{ fontSize: 12, color: "text.secondary", py: 1 }}
              >
                No documents available.
              </Typography>
            ) : (
              <Grid container spacing={1.5}>
                {documentEntries.map(([documentName, files]) => {
                  const fileList = Array.isArray(files)
                    ? files
                    : files
                    ? [files]
                    : [];

                  return fileList.map((file, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={`${documentName}-${index}`}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            mb: 0.8,
                          }}
                        >
                          {formatLabel(documentName)}
                        </Typography>

                        {file?.url ? (
                          <Link
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ fontSize: 12 }}
                          >
                            View Document {index + 1}
                          </Link>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            Document URL unavailable
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ));
                })}
              </Grid>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Registration() {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchRegistrations = useCallback(
    async (signal) => {
      setLoading(true);

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const params = {
          page: page + 1,
          limit: rowsPerPage,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (status) {
          params.status = status;
        }

        const response = await axios.get(API_URL, {
          params,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
          signal,
        });

        const result = response.data;

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to fetch pharmacy registrations."
          );
        }

        setRegistrations(
          Array.isArray(result.data) ? result.data : []
        );

        setTotal(Number(result.pagination?.total) || 0);

        return true;
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return false;
        }

        setRegistrations([]);
        setTotal(0);

        showMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load pharmacy registrations.",
          "error"
        );

        return false;
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [page, rowsPerPage, debouncedSearch, status]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchRegistrations(controller.signal);

    return () => controller.abort();
  }, [fetchRegistrations]);

  const handleRefresh = async () => {
    const refreshed = await fetchRegistrations();

    if (refreshed) {
      showMessage("Pharmacy registrations refreshed.");
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleRegistrationActionSuccess = async () => {
    const refreshed = await fetchRegistrations();

    if (refreshed) {
      showMessage("Pharmacy account assigned successfully.");
    }
  };

  return (
    <Box
      sx={{
        pt: 9,
        px: { xs: 1.5, sm: 2.5 },
        pb: 3,
        minHeight: "100vh",
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Pharmacy Registration
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            Manage and review pharmacy registration applications
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 17 }} />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            height: 36,
            px: 1.8,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Refresh
        </Button>
      </Box>

      <RegistrationTable
        registrations={registrations}
        loading={loading}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={total}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onViewDocuments={handleViewDetails}
      />

     <PharmacyRegistrationDetailsDialog
       open={Boolean(selectedRegistration)}
       registration={selectedRegistration}
       onClose={() => setSelectedRegistration(null)}
       onActionSuccess={handleRegistrationActionSuccess}
     />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((current) => ({
            ...current,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((current) => ({
              ...current,
              open: false,
            }))
          }
          sx={{ fontSize: 12, borderRadius: 1.5 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
