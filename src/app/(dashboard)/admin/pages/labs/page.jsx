"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Alert, Box, Paper, Snackbar } from "@mui/material";
import { API_BASE_URL } from "../../../../../config/api";

import LabsHeader from "../../components/lab/LabsHeader";
import LabsFilters from "../../components/lab/LabsFilters";
import LabsTable from "../../components/lab/LabsTable";
import CreateLabDialog from "../../components/lab/CreateLabDialog";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  labName: "",
  labCode: "",
  registrationNumber: "",
  address: "",
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function LabsPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusLabId, setStatusLabId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatus, setTableStatus] = useState("");
  const [tableDate, setTableDate] = useState("");
  const [tablePage, setTablePage] = useState(1);

  const pageSize = 10;

  // =========================================
  // API CONFIG
  // =========================================
  const requestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  };

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_BASE_URL}/admin/getLabDetails`,
        {
          ...requestConfig(),
          params: {
            search: tableSearch.trim() || undefined,
            status: tableStatus || undefined,
            date: tableDate || undefined,
          },
        }
      );
      const data = response?.data?.data;
      setLabs(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setLabs([]);
      setError(getErrorMessage(requestError, "Unable to load labs."));
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EFFECTS
  // =========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLabs();
    }, tableSearch ? 350 : 0);
    return () => clearTimeout(timer);
  }, [tableSearch, tableStatus, tableDate]);

  useEffect(() => {
    setTablePage(1);
  }, [tableSearch, tableStatus, tableDate]);

  // =========================================
  // DERIVED
  // =========================================
  const stats = useMemo(
    () => ({
      total: labs.length,
      active: labs.filter(
        (lab) => String(lab?.status).toUpperCase() === "ACTIVE"
      ).length,
      doctors: labs.reduce(
        (sum, lab) => sum + Number(lab?.doctor_count || 0),
        0
      ),
      requests: labs.reduce(
        (sum, lab) => sum + Number(lab?.request_count || 0),
        0
      ),
    }),
    [labs]
  );

  const filteredLabs = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    return labs.filter((lab) => {
      const matchesSearch =
        !query ||
        [
          lab?.lab_name,
          lab?.lab_code,
          lab?.admin_name,
          lab?.email,
          lab?.phone_number,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        !tableStatus ||
        String(lab?.status).toUpperCase() === tableStatus;

      const matchesDate =
        !tableDate ||
        String(lab?.created_at || "").startsWith(tableDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [labs, tableSearch, tableStatus, tableDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLabs.length / pageSize)
  );

  const visibleLabs = useMemo(() => {
    const start = (tablePage - 1) * pageSize;
    return filteredLabs.slice(start, start + pageSize);
  }, [filteredLabs, tablePage]);

  useEffect(() => {
    if (tablePage > totalPages) setTablePage(totalPages);
  }, [tablePage, totalPages]);

  // =========================================
  // FORM VALIDATION
  // =========================================
  const validateForm = () => {
    const errors = {};
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phoneNumber = form.phoneNumber.trim();
    const labName = form.labName.trim();
    const labCode = form.labCode.trim();
    const registrationNumber = form.registrationNumber.trim();
    const address = form.address.trim();

    if (!fullName) errors.fullName = "Lab owner name is required.";
    else if (fullName.length < 2)
      errors.fullName = "Name must be at least 2 characters.";
    else if (fullName.length > 100)
      errors.fullName = "Name must be under 100 characters.";

    if (!email) errors.email = "Owner email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Enter a valid email address.";
    else if (email.length > 150) errors.email = "Email is too long.";

    if (!labName) errors.labName = "Lab name is required.";
    else if (labName.length < 2)
      errors.labName = "Lab name must be at least 2 characters.";
    else if (labName.length > 120) errors.labName = "Lab name is too long.";

    if (phoneNumber && !/^[6-9]\d{9}$/.test(phoneNumber))
      errors.phoneNumber = "Enter a valid 10-digit mobile number.";

    if (labCode && !/^[A-Za-z0-9_-]{2,30}$/.test(labCode))
      errors.labCode = "Use 2-30 letters, numbers, _ or - only.";

    if (registrationNumber.length > 100)
      errors.registrationNumber = "Registration number is too long.";

    if (address.length > 300)
      errors.address = "Address must be under 300 characters.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================================
  // HANDLERS
  // =========================================
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim(),
        labName: form.labName.trim(),
        labCode: form.labCode.trim(),
        registrationNumber: form.registrationNumber.trim(),
        address: form.address.trim(),
      };

      if (!payload.phoneNumber) delete payload.phoneNumber;
      if (!payload.labCode) delete payload.labCode;
      if (!payload.registrationNumber) delete payload.registrationNumber;
      if (!payload.address) delete payload.address;

      const response = await axios.post(
        `${API_BASE_URL}/admin/createLabs`,
        payload,
        requestConfig()
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Unable to create lab."
        );
      }

      setDialogOpen(false);
      setForm(initialForm);
      setFormErrors({});
      setNotice(
        response?.data?.data?.emailSent === false
          ? "Lab created, but credential email could not be sent. Check SMTP settings."
          : "Lab created successfully. Login credentials were emailed to the lab owner."
      );
      await fetchLabs();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create lab."));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (lab) => {
    if (!lab?.id || statusLabId) return;

    const currentStatus = String(lab?.status || "").toUpperCase();
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setStatusLabId(lab.id);
      setError("");

      await axios.patch(
        `${API_BASE_URL}/admin/labs/${lab.id}/status`,
        { status: nextStatus },
        requestConfig()
      );

      setLabs((current) =>
        current.map((item) =>
          item.id === lab.id ? { ...item, status: nextStatus } : item
        )
      );

      setNotice(
        nextStatus === "ACTIVE"
          ? "Lab activated successfully."
          : "Lab deactivated successfully."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to update lab status.")
      );
    } finally {
      setStatusLabId(null);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "phoneNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((current) => ({ ...current, [name]: nextValue }));

    if (formErrors[name]) {
      setFormErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const openCreateDialog = () => {
    setForm(initialForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeCreateDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setForm(initialForm);
    setFormErrors({});
  };

  const clearFilters = () => {
    setTableSearch("");
    setTableStatus("");
    setTableDate("");
    setTablePage(1);
  };

  const statsData = [
    { label: "Total Labs", value: stats.total },
    { label: "Active Labs", value: stats.active },
    { label: "Connected Doctors", value: stats.doctors },
    { label: "Test Requests", value: stats.requests },
  ];

  // =========================================
  // UI
  // =========================================
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5 },
        mt: { xs: 7, md: 8 },
        bgcolor: "white",
        minHeight: "100vh",
        overflowX: "hidden",
        "& .MuiTypography-root": { fontSize: "13px" },
        "& .MuiButton-root": { fontSize: "13px", textTransform: "none" },
        "& .MuiTableCell-root": { fontSize: "13px" },
        "& .MuiChip-label": { fontSize: "13px" },
      }}
    >
      <LabsHeader
        loading={loading}
        onRefresh={fetchLabs}
        onAdd={openCreateDialog}
      />

     

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <LabsFilters
          tableSearch={tableSearch}
          tableStatus={tableStatus}
          tableDate={tableDate}
          onSearchChange={setTableSearch}
          onStatusChange={setTableStatus}
          onDateChange={setTableDate}
          onClear={clearFilters}
        />

        <LabsTable
          loading={loading}
          labs={labs}
          filteredLabs={filteredLabs}
          visibleLabs={visibleLabs}
          totalPages={totalPages}
          tablePage={tablePage}
          onPageChange={setTablePage}
          statusLabId={statusLabId}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <CreateLabDialog
        open={dialogOpen}
        onClose={closeCreateDialog}
        form={form}
        formErrors={formErrors}
        onChange={updateField}
        onSubmit={handleSubmit}
        saving={saving}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
          sx={{ fontSize: "12.5px" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setNotice("")}
          sx={{ fontSize: "12.5px" }}
        >
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}