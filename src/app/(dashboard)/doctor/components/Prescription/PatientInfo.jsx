import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

export function PatientInfo({ patient, dateNow, isDownloading }) {
  return (
    <Table
      size="small"
      sx={{
        width: "100%",
        tableLayout: "fixed",

        "& .MuiTableCell-root": {
          padding: {
            xs: isDownloading ? "8px 12px" : "6px 4px",
            sm: "8px 12px",
          },
          fontSize: {
            xs: isDownloading ? "14px" : "12px",
            sm: "14px",
          },
          verticalAlign: "middle",
          borderBottom: "none",
        },
      }}
    >
      <TableBody>

        <TableRow>

          <TableCell>
            <b>Patient Name:</b> {patient?.name}
          </TableCell>

          <TableCell>
            <b>Age:</b> {patient?.age}
          </TableCell>

          <TableCell
            sx={{
              display: {
                xs: isDownloading ? "table-cell" : "none",
                sm: "table-cell",
              },
            }}
          >
            <b>Date/Time:</b> {dateNow}
          </TableCell>

        </TableRow>


        <TableRow>

          <TableCell>
            <b>Gender:</b> {patient?.gender}
          </TableCell>

          <TableCell>
            <b>Weight:</b> {patient?.weight}
          </TableCell>

          <TableCell>
            <b>Height:</b> {patient?.height}
          </TableCell>

        </TableRow>


        {/* Mobile Date/Time */}

        <TableRow
          sx={{
            display: {
              xs: isDownloading ? "none" : "table-row",
              sm: "none",
            },
          }}
        >
          <TableCell colSpan={2}>
            <b>Date/Time:</b> {dateNow}
          </TableCell>
        </TableRow>

      </TableBody>
    </Table>
  );
}

export function DiagnosisSection({
  diagnosis,
  editable,
  setDiagnosis,
  isDownloading,
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "8px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Diagnosis Label */}
        <div
          style={{
            flexShrink: 0,
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "24px",
            whiteSpace: "nowrap",
            paddingTop: "2px",
          }}
        >
          Diagnosis:
        </div>

        {/* Diagnosis Input Area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
        {editable && !isDownloading ? (
  <textarea
    value={diagnosis || ""}
    maxLength={250}
    onChange={(e) => {
      if (e.target.value.length <= 250) {
        setDiagnosis(e.target.value);
      }
    }}
    rows={1}
    style={{
      width: "100%",
      minHeight: "50px",
      resize: "vertical",
      boxSizing: "border-box",
      border: "none",
      borderBottom: "1px solid #777",
      outline: "none",
      padding: "4px 0",
      margin: 0,
      fontSize: "13px",
      lineHeight: "20px",
      fontFamily: "inherit",
      color: "#222",
      backgroundColor: "#fff",
    }}
  />
) : (
  <div
    style={{
      width: "100%",
      boxSizing: "border-box",
      borderBottom: "1px solid #777",
      padding: "4px 0",
      fontSize: "13px",
      lineHeight: "20px",
      color: "#222",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    }}
  >
    {diagnosis || ""}
  </div>
)}

          {/* Character Count */}
         {editable && !isDownloading && (
  <div
    style={{
      marginTop: "2px",
      fontSize: "10px",
      lineHeight: "14px",
      color: "#000",
      textAlign: "left",
    }}
  >
    {(diagnosis || "").length}/250 characters
  </div>
)}
        </div>
      </div>
    </div>
  );
}