"use client";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Qr/Card";
import QRTable from "../../components/Qr/QRTable";

const Page = () => {
  const [numberOfQR, setNumberOfQR] = useState("");

const [qrData, setQrData] = useState([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [total, setTotal] = useState(0);
  const getQRDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL}/api/QR/details?page=${page + 1}&limit=${rowsPerPage}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
setQrData(response.data.data);
setTotal(response.data.pagination.total);
    } catch (error) {
      console.log(error);
    }
  };

 useEffect(() => {
  getQRDetails();
}, [page, rowsPerPage]);

 const handleGenerateQR = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/QR/generate`,
      {
        count: Number(numberOfQR), // 👈 change this
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNumberOfQR("");
    getQRDetails(); // Refresh table
  } catch (error) {
    console.log(error);
  }
};

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px #0f7468",
        mt: 8.5,
        mx: 1,
        borderRadius: 1,
      }}
    >
      <Card
        numberOfQR={numberOfQR}
        setNumberOfQR={setNumberOfQR}
        handleGenerateQR={handleGenerateQR}
      />

      <QRTable
  qrData={qrData}
  page={page}
  setPage={setPage}
  rowsPerPage={rowsPerPage}
  setRowsPerPage={setRowsPerPage}
  total={total}
/>
    </Box>
  );
};

export default Page;