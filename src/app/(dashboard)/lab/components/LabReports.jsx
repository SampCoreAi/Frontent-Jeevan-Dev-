"use client";

import { Button, Chip, Pagination, TableCell, TableRow } from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

export default function LabReports({ reports, loading, filters, page, pageSize, onPageChange }) {
  const visible = reports.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <SectionTitle title="Reports" description="View lab test requests and uploaded reports." />
      <TableFilters {...filters} />
      <DataTable columns={["SNO", "REPORT", "PATIENT", "LAB", "TEST", "STATUS", "UPLOADED", "DOWNLOAD"]} loading={loading} emptyMessage="No reports found." footer={<Pagination count={Math.max(1, Math.ceil(reports.length / pageSize))} page={page} onChange={(_, value) => onPageChange(value)} size="small" color="primary" />}>
        {visible.length ? visible.map((report, index) => <TableRow key={report.id} hover>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{report.originalFileName || report.original_file_name || `Report #${report.id}`}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{report.patientName || report.patient_name || report.patientId || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{report.labName || report.lab_name || report.labId || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{report.testName || report.test_name || report.requestedTests || report.requested_tests || "-"}</TableCell>
          <TableCell><Chip size="small" label={report.status || report.request_status || "REPORT_UPLOADED"} color={report.status === "COMPLETED" ? "success" : report.status === "REJECTED" ? "error" : "info"} /></TableCell>
          <TableCell sx={{ color: "#64748b !important" }}>{report.createdAt || report.created_at ? new Date(report.createdAt || report.created_at).toLocaleDateString() : "-"}</TableCell>
          <TableCell>{report.downloadUrl ? <Button size="small" href={report.downloadUrl} target="_blank" rel="noreferrer">Open PDF</Button> : "-"}</TableCell>
        </TableRow>) : null}
      </DataTable>
    </>
  );
}
