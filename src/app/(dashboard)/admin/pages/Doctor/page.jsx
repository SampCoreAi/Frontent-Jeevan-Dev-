"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import DoctorsFilters from "../../components/doctors/DoctorsFilters";
import DoctorsTable from "../../components/doctors/DoctorsTable";
import DoctorProfileDialog from "../../components/doctors/DoctorProfileDialog";
import AddDoctorDialog from "../../components/doctors/AddDoctorDialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function DoctorsPage() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openAddDoctor, setOpenAddDoctor] = useState(false);
  useEffect(() => {
    getAllDoctors();
  }, []);

const getAllDoctors = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_URL}/api/doctors/getAlldoctor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDoctorsList(res.data.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setProfileOpen(true);
  };

  const handleStatusUpdate = (doctorId, newStatus) => {
    setDoctorsList(prev =>
      prev.map(doc =>
        doc.doctorId === doctorId ? { ...doc, status: newStatus } : doc
      )
    );
  };

  const specializations = [
    ...new Set(doctorsList.map((doctor) => doctor.specialization))
  ];

  const availableDays = [
    ...new Set(
      doctorsList.flatMap((doctor) =>
        doctor.availability?.map((a) => a.day) || []
      )
    ),
  ];

  const filteredDoctors = doctorsList.filter((doctor) => {
   const search = searchTerm.toLowerCase().trim();

const matchesSearch =
  search === "" ||
  doctor?.full_name?.toLowerCase().includes(search) ||
  doctor?.username?.toLowerCase().includes(search) ||
  doctor?.email?.toLowerCase().includes(search) ||
  doctor?.phoneNumber?.toString().includes(search) ||
  doctor?.specialization?.toLowerCase().includes(search);

    const matchesSpec =
      selectedSpec === "" || doctor.specialization === selectedSpec;

    const matchesDay =
      selectedDay === "" ||
      doctor.availability?.some((a) => a.day === selectedDay);

    return matchesSearch && matchesSpec && matchesDay;
  });

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "white",
        boxShadow: "0 4px 12px #0f7468",
        mt: 8.5,
        mx: 1,
        borderRadius: 1,

      }}
    >
    

      <DoctorsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSpec={selectedSpec}
        onSpecChange={setSelectedSpec}
        selectedDay={selectedDay}
        onDayChange={setSelectedDay}
        specializations={specializations}
        availableDays={availableDays}
        onAddDoctor={() => setOpenAddDoctor(true)}
      />

      <DoctorsTable
        doctors={filteredDoctors}
        totalDoctors={doctorsList.length}
        loading={loading}
        onViewProfile={handleViewProfile}
        onStatusUpdate={handleStatusUpdate}
      />

      <DoctorProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        doctor={selectedDoctor}
      />

      <AddDoctorDialog
        open={openAddDoctor}
        onClose={() => setOpenAddDoctor(false)}
        onAddDoctor={(newDoctor) => {
          // Handle API call and update list
          console.log("Add doctor:", newDoctor);
        }}
      />
    </Box>
  );
}