"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

import { scheduleService } from "../../services/api";
import api from "../../../../../utils/axiosInstance";

import AppointmentHeader from "./AppointmentHeader";
import AppointmentTable from "./AppointmentTable";
import PatientDetailsDialog from "./PatientDetailsDialog";
import MedicalDetailsDialog from "./MedicalDetailsDialog";
import TokenVerificationDialog from "./TokenVerificationDialog";
import PastDetailsDialog from "./PastDetailsDialog";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OnOffCard({
  selectedHospital,
  selectedMode,
}) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const appointmentIdFromDashboard =
    searchParams.get("appointment_id");

  const verifyFromDashboard =
    searchParams.get("verify");

  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState(null);

const [pastSelectedDate, setPastSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [tokenOpen, setTokenOpen] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
;
const [pastOpen, setPastOpen] = useState(false);
const [pastLoading, setPastLoading] = useState(false);
const [pastData, setPastData] = useState([]);
const [pastError, setPastError] = useState("");
const [pastPatient, setPastPatient] = useState(null);
  const [status, setStatus] = useState("pending");
  const [token, setToken] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [
    approvedMedicalStores,
    setApprovedMedicalStores,
  ] = useState([]);

  const [
    medicalDetailsOpen,
    setMedicalDetailsOpen,
  ] = useState(false);

  const [
    medicalDetailRows,
    setMedicalDetailRows,
  ] = useState([]);

  const [
    medicalDetailsLoading,
    setMedicalDetailsLoading,
  ] = useState(false);

  const [
    medicalDetailsPatient,
    setMedicalDetailsPatient,
  ] = useState(null);
  


  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5,
  });

  const user =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      : {};

  const roleId = user?.role_id;

  useEffect(() => {
    const loadApprovedMedicalStores = async () => {
      try {
        const response = await api.get(
          "/api/medical-stores/doctor/connections"
        );

        const connections =
          response?.data?.data || [];

        const stores = connections
          .filter(
            (connection) =>
              String(
                connection?.status || ""
              ).toUpperCase() === "APPROVED"
          )
          .map((connection) => ({
            id:
              connection.medical_store_id ||
              connection.store_id ||
              connection.id,

            name:
              connection.store_name ||
              connection.medical_store_name ||
              "Medical Store",

            city:
              connection.city ||
              connection.address ||
              "",

            phone:
              connection.phone ||
              connection.phone_number ||
              "",
          }))
          .filter((store) => store.id);

        setApprovedMedicalStores(stores);
      } catch (requestError) {
        console.error(
          "Medical stores error:",
          requestError
        );
      }
    };

    loadApprovedMedicalStores();
  }, []);

  useEffect(() => {
    if (
      verifyFromDashboard === "true" &&
      appointmentIdFromDashboard
    ) {
      setSelectedAppointmentId(
        appointmentIdFromDashboard
      );

      setTokenOpen(true);
    }
  }, [
    verifyFromDashboard,
    appointmentIdFromDashboard,
  ]);

  useEffect(() => {
    if (!selectedHospital || !selectedMode) {
      setPatients([]);
      return;
    }

    const fetchAppointments = async () => {
      setTableLoading(true);

      try {
        const paginationParams = {
          limit: pagination.pageSize,
          offset:
            pagination.page *
            pagination.pageSize,
        };

        const res =
          await scheduleService.getDoctorAppointments(
            selectedHospital,
            selectedMode,
            status,
            date,
            paginationParams
          );

        const appointments = Array.isArray(
          res?.appointments
        )
          ? res.appointments
          : [];

        const formattedPatients =
          appointments.map((appointment) => ({
            id: appointment.appointment_id,

            patientId:
              appointment.patient_id ||
              appointment.patientId ||
              appointment.user_id ||
              appointment.userId,

            tokenNumber:
              appointment.token_number,

            name:
              appointment.name ||
              "Not provided",

            phoneNumber:
              appointment.phone_number ||
              "Not provided",

            Diagnostic:
              appointment.diagnostic ||
              "Not provided",

            date:
              appointment.date ||
              "Not provided",

            time:
              appointment.time ||
              "Not provided",

            mode:
              appointment.mode ||
              "Not provided",

            hospitalName:
              appointment.hospital_name ||
              "Not provided",

            status:
              appointment.status ||
              "Not provided",

            bookedAt:
              appointment.booked_at,
          }));

        setPatients(formattedPatients);
      } catch (err) {
        console.error(
          "Appointment API Error:",
          err
        );

        setPatients([]);
      } finally {
        setTableLoading(false);
      }
    };

    fetchAppointments();
  }, [
    selectedHospital,
    selectedMode,
    status,
    date,
    pagination.page,
    pagination.pageSize,
  ]);

  const handleOpen = (patient) => {
    const appointmentStatus =
      patient?.status?.toLowerCase();

    if (
      appointmentStatus === "in_progress" ||
      appointmentStatus === "completed"
    ) {
      router.push(
        `/doctor/pages/prescription?appointment_id=${patient.id}`
      );

      return;
    }

    if (appointmentStatus === "pending") {
      setSelectedAppointmentId(patient.id);
      setToken("");
      setError("");
      setTokenOpen(true);
    }
  };

  const handleView = async (patient) => {
    if (!patient?.id) return;

    try {
      const authToken =
        localStorage.getItem("token");

      if (!authToken) return;

      const response = await fetch(
        `${API_URL}/api/user/getPatientDetails/${patient.id}`,
        {
          headers: {
            Authorization:
              `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        setSelectedPatient(result.data);
        setViewOpen(true);
      }
    } catch (err) {
      console.error(
        "Patient details error:",
        err
      );
    }
  };

  const handleViewDetails = (row) => {
    setMedicalDetailsPatient(row);
    handleView(row);
  };
const fetchPastPrescription = async (patientId, prescriptionDate) => {
  if (!patientId || !prescriptionDate) return;

  setPastLoading(true);
  setPastError("");
  setPastData([]);

  try {
    const response = await api.get(
      "/api/appointments/getprescriptions",
      {
        params: {
          user_id: patientId,
          date: prescriptionDate,
        },
      }
    );

    const prescriptions = Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

    setPastData(prescriptions);

    if (!prescriptions.length) {
      setPastError("No prescription found for this date.");
    }
  } catch (err) {
    console.error("Prescription API Error:", err);

    setPastError(
      err?.response?.data?.message ||
        "Unable to load prescription."
    );
  } finally {
    setPastLoading(false);
  }
};

const normalizeApiDate = (value) => {
  if (!value || value === "Not provided") return "";

  const cleanValue = String(value).split("T")[0].trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    return cleanValue;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(cleanValue)) {
    const [day, month, year] = cleanValue.split("-");
    return `${year}-${month}-${day}`;
  }

  return "";
};

const handleViewHistory = async (row) => {
  setPastPatient(row);
  setPastOpen(true);
  setPastLoading(true);
  setPastError("");
  setPastData([]);
  setPastSelectedDate("");

  if (!row?.patientId) {
    setPastError("Patient ID not found.");
    setPastLoading(false);
    return;
  }

  try {
    const response = await api.get(
      "/api/appointments/getprescriptions",
      {
        params: {
          user_id: row.patientId,
        },
      }
    );

    const prescriptions = Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

    if (!prescriptions.length) {
      setPastData([]);
      setPastError("No past prescriptions found.");
      return;
    }

    const sortedPrescriptions = [...prescriptions].sort((a, b) => {
      const dateA = a?.appointment?.date || "";
      const dateB = b?.appointment?.date || "";

      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      const timeA = a?.appointment?.start_time || "";
      const timeB = b?.appointment?.start_time || "";

      return timeB.localeCompare(timeA);
    });

    setPastData(sortedPrescriptions);

    const latestDate =
      sortedPrescriptions[0]?.appointment?.date || "";

    setPastSelectedDate(latestDate);
  } catch (err) {
    console.error("Past prescriptions error:", err);

    setPastError(
      err?.response?.data?.message ||
        "Unable to load past prescriptions."
    );
  } finally {
    setPastLoading(false);
  }
};

const handlePastClose = () => {
  setPastOpen(false);
  setPastPatient(null);
  setPastData([]);
  setPastError("");
  setPastSelectedDate("");
  setPastLoading(false);
};

const handlePastDateChange = async (selectedDate) => {
  if (!pastPatient?.patientId || !selectedDate) return;

  setPastSelectedDate(selectedDate);

  await fetchPastPrescription(
    pastPatient.patientId,
    selectedDate
  );
};





  const handleViewMedicalDetails = async (
    row
  ) => {
    if (!row?.patientId) {
      setError("Patient ID not found.");
      return;
    }

    setMedicalDetailsPatient(row);
    setMedicalDetailsLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/api/medical-requests/doctor"
      );

      const requests =
        response?.data?.data || [];

      const patientRequests =
        requests.filter(
          (request) =>
            Number(request.patient_id) ===
              Number(row.patientId) &&
            String(
              request.status || ""
            ).toUpperCase() === "COMPLETED"
        );

      if (!patientRequests.length) {
        setError(
          "Invoice tabhi available hoga jab medical store medicine deliver karega."
        );

        return;
      }

      const rows = patientRequests.map(
        (request) => ({
          id: request.id,

          medicineName:
            request.medicine_name,

          quantity:
            request.quantity || 1,

          storeId:
            request.medical_store_id,

          amount:
            request.total_amount ||
            request.amount ||
            0,

          status:
            request.status,
        })
      );

      setMedicalDetailRows(rows);
      setMedicalDetailsOpen(true);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to load medical details."
      );
    } finally {
      setMedicalDetailsLoading(false);
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedPatient(null);
  };

  const handleTokenClose = () => {
    if (loading) return;

    setTokenOpen(false);
    setToken("");
    setSelectedAppointmentId(null);
    setError("");
  };

  const handleNext = async () => {
    const cleanToken = token.trim();

    if (!cleanToken) {
      setError("Token is required");
      return;
    }

    if (!selectedAppointmentId) {
      setError("Appointment not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const jwtToken =
        localStorage.getItem("token");

      if (!jwtToken) {
        setError(
          "Authentication token not found"
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/appointments/${selectedAppointmentId}/token/${cleanToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${jwtToken}`,
          },
        }
      );

      const res = await response.json();

      if (res?.success) {
        router.push(
          `/doctor/pages/prescription?appointment_id=${selectedAppointmentId}`
        );

        return;
      }

      setError(
        res?.message || "Invalid token"
      );
    } catch (err) {
      setError(
        err?.message ||
          "Token expired or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (value) => {
    setDate(value);

    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const handleStatusChange = (value) => {
    setStatus(value);

    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const handleClearFilters = () => {
    setDate("");
    setStatus("pending");

    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          bgcolor:
            theme.palette.background.paper,
          border:
            `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <AppointmentHeader
          selectedHospital={selectedHospital}
          selectedMode={selectedMode}
          date={date}
          status={status}
          onDateChange={handleDateChange}
          onStatusChange={handleStatusChange}
          onClear={handleClearFilters}
        />

        <AppointmentTable
          patients={patients}
          loading={tableLoading}
          pagination={pagination}
          setPagination={setPagination}
          roleId={roleId}
          onStart={handleOpen}
          onViewDetails={handleViewDetails}
          onViewMedicalDetails={
            handleViewMedicalDetails
          }
          onViewHistory={handleViewHistory}
          medicalDetailsLoading={
            medicalDetailsLoading
          }
        />
      </Paper>

      <PatientDetailsDialog
        open={viewOpen}
        patient={selectedPatient}
        onClose={handleViewClose}
      />

      <MedicalDetailsDialog
        open={medicalDetailsOpen}
        onClose={() => {
          setMedicalDetailsOpen(false);
          setMedicalDetailRows([]);
          setMedicalDetailsPatient(null);
        }}
        patient={medicalDetailsPatient}
        stores={approvedMedicalStores}
        rows={medicalDetailRows}
      />

<PastDetailsDialog
  open={pastOpen}
  onClose={handlePastClose}
  loading={pastLoading}
  error={pastError}
  data={pastData}
  patient={pastPatient}
  selectedDate={pastSelectedDate}
  onDateChange={setPastSelectedDate}
/>
      <TokenVerificationDialog
        open={tokenOpen}
        token={token}
        error={error}
        loading={loading}
        onTokenChange={setToken}
        onErrorClear={() => setError("")}
        onClose={handleTokenClose}
        onVerify={handleNext}
      />
    </>
  );
}