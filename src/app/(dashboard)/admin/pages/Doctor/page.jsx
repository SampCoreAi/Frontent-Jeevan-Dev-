"use client";

import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import DoctorsFilters from "../../components/doctors/DoctorsFilters";
import DoctorsTable from "../../components/doctors/DoctorsTable";
import DoctorProfileDialog from "../../components/doctors/DoctorProfileDialog";
import AddDoctorDialog from "../../components/doctors/AddDoctorDialog";
import AssignQrDialog from "../../components/doctors/AssignQrDialog";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DoctorsPage() {
  // ================================
  // DOCTORS
  // ================================

  const [doctors, setDoctors] = useState([]);

const [qrOpen, setQrOpen] = useState(false);
const [qrDoctor, setQrDoctor] = useState(null);
const [qrLoading, setQrLoading] = useState(false);
const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [limit, setLimit] = useState(10);

  // ================================
  // LOADING
  // ================================

  const [loading, setLoading] = useState(false);

  // ================================
  // FILTERS
  // ================================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  // ================================
  // DIALOGS
  // ================================

  const [profileOpen, setProfileOpen] = useState(false);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [openAddDoctor, setOpenAddDoctor] =
    useState(false);

  // =========================================================
  // FETCH DOCTORS
  // =========================================================

const getAllDoctors = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const params = {
      page,
      limit: 10,
    };

    // Empty search API ko mat bhejo
    if (appliedSearch.trim()) {
      params.search = appliedSearch.trim();
    }

    const res = await axios.get(
      `${API_URL}/api/doctors/getAlldoctor`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DOCTORS RESPONSE:", res.data);

    setDoctors(res.data?.data || []);
    setTotalDoctors(res.data?.total ?? 0);
    setTotalPages(res.data?.totalPages ?? 1);
    setLimit(res.data?.limit ?? 10);

  } catch (error) {
    console.error(
      "Doctors API Error:",
      error.response?.data || error
    );
  } finally {
    setLoading(false);
  }
};
const handleAssignQROpen = (doctor) => {
  setQrDoctor(doctor);
  setQrOpen(true);
};

const handleAssignQRClose = () => {
  if (qrLoading) return;

  setQrOpen(false);
  setQrDoctor(null);
};

const handleAssignQR = async (qrCodes) => {
  if (!qrDoctor?.userId) return;

  try {
    setQrLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${API_URL}/api/QR/doctors/${qrDoctor.userId}/connect-qr`,
      {
        qrCodes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("ASSIGN QR RESPONSE:", res.data);

    alert(
      res.data?.message ||
        "QR Codes assigned successfully."
    );

    setQrOpen(false);
    setQrDoctor(null);

  } catch (error) {
    console.error(
      "Assign QR Error:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Unable to assign QR Codes."
    );
  } finally {
    setQrLoading(false);
  }
};
  // =========================================================
  // IMPORTANT
  // PAGE CHANGE HOTE HI API DOBARA CALL HOGI
  // =========================================================
const handleSearch = () => {
  const value = searchTerm.trim();
  setPage(1);
  setAppliedSearch(value);
};
useEffect(() => {
  getAllDoctors();
}, [page, appliedSearch]);

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);
  };

  // =========================================================
  // VIEW PROFILE
  // =========================================================

 const handleViewProfile = async (doctor) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_URL}/api/doctors/admin/doctors/${doctor.userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    setSelectedDoctor(res.data?.data || null);
    setProfileOpen(true);

  } catch (error) {
    console.error(
      "Doctor Details Error:",
      error.response?.data || error
    );
  }
};

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditDoctor = (doctor) => {
    console.log(
      "Edit doctor:",
      doctor
    );
  };

  // =========================================================
  // STATUS
  // =========================================================

 const handleStatusChange = async (doctor) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(
      `${API_URL}/api/doctors/doctors/${doctor.userId}/status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    // Status change ke baad current page refresh
    await getAllDoctors();

  } catch (error) {
    console.error(
      "Status Update Error:",
      error.response?.data || error
    );
  }
};

  // =========================================================
  // FILTER OPTIONS
  // NOTE:
  // Current getAlldoctor response me specialization /
  // availability nahi hai, isliye filhal empty hain.
  // =========================================================

  const specializations = [];

  const availableDays = [];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        backgroundColor: "white",

        p: {
          xs: 2,
          sm: 2,
          md: 4,
        },

        mt: 8.6,
      }}
    >
      {/* ===========================
          FILTERS
      ============================ */}

     <DoctorsFilters
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onSearch={handleSearch}

  selectedSpec={selectedSpec}
  onSpecChange={setSelectedSpec}

  selectedDay={selectedDay}
  onDayChange={setSelectedDay}

  specializations={specializations}
  availableDays={availableDays}
/>

      {/* ===========================
          TABLE
      ============================ */}
<DoctorsTable
  doctors={doctors}
  page={page}
  totalPages={totalPages}
  total={totalDoctors}
  limit={limit}
  onPageChange={handlePageChange}
  onView={handleViewProfile}
  onEdit={handleEditDoctor}
  onAssignQR={handleAssignQROpen}
  onStatusChange={handleStatusChange}
/>
      {/* ===========================
          PROFILE DIALOG
      ============================ */}

      <DoctorProfileDialog
        open={profileOpen}
        onClose={() =>
          setProfileOpen(false)
        }
        doctor={selectedDoctor}
      />

      {/* ===========================
          ADD DOCTOR
      ============================ */}
<AssignQrDialog
  open={qrOpen}
  doctor={qrDoctor}
  loading={qrLoading}
  onClose={handleAssignQRClose}
  onAssign={handleAssignQR}
/>
      <AddDoctorDialog
        open={openAddDoctor}
        onClose={() =>
          setOpenAddDoctor(false)
        }
        onAddDoctor={(newDoctor) => {
          console.log(
            "Add doctor:",
            newDoctor
          );
        }}
      />
    </Box>
  );
}