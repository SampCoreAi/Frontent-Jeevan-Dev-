"use client";

import { Button, Pagination, TableCell, TableRow } from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

export default function LabReports({ reports, loading, filters, page, pageSize, onPageChange }) {
  const visible = reports.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <SectionTitle title="Reports" description="View reports uploaded for your lab's test requests." />
      <TableFilters {...filters} />
      <DataTable columns={["REPORT", "REQUEST", "PATIENT", "TEST", "UPLOADED", "DOWNLOAD"]} loading={loading} emptyMessage="No reports found." footer={<Pagination count={Math.max(1, Math.ceil(reports.length / pageSize))} page={page} onChange={(_, value) => onPageChange(value)} size="small" color="primary" />}>
        {visible.length ? visible.map((report) => <TableRow key={report.id} hover>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{report.originalFileName || report.original_file_name || `Report #${report.id}`}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>#{report.testRequestId || report.test_request_id || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{report.patientName || report.patient_name || report.patientId || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{report.testName || report.test_name || "-"}</TableCell>
          <TableCell sx={{ color: "#64748b !important" }}>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-"}</TableCell>
          <TableCell>{report.downloadUrl ? <Button size="small" href={report.downloadUrl} target="_blank" rel="noreferrer">Open PDF</Button> : "-"}</TableCell>
        </TableRow>) : null}
      </DataTable>
    </>
  );
}
