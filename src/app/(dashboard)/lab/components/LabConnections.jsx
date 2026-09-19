"use client";

import { Button, Chip, Pagination, Stack, TableCell, TableRow } from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

export default function LabConnections({ connections, loading, filters, page, pageSize, onPageChange, actionId, onStatusUpdate }) {
  const visible = connections.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <SectionTitle title="Doctor Connections" description="Approve or reject doctors requesting access to your lab." />
      <TableFilters {...filters} statusOptions={["PENDING", "APPROVED", "REJECTED"]} />
      <DataTable columns={["DOCTOR", "EMAIL", "PHONE", "REQUESTED", "STATUS", "ACTION"]} loading={loading} emptyMessage="No doctor connections found." footer={<Pagination count={Math.max(1, Math.ceil(connections.length / pageSize))} page={page} onChange={(_, value) => onPageChange(value)} size="small" color="primary" />}>
        {visible.length ? visible.map((connection) => <TableRow key={connection.connection_id} hover>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{connection.doctor_name || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{connection.doctor_email || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{connection.doctor_phone || "-"}</TableCell>
          <TableCell sx={{ color: "#64748b !important" }}>{connection.requested_at ? new Date(connection.requested_at).toLocaleDateString() : "-"}</TableCell>
          <TableCell><Chip size="small" label={connection.status || "-"} color={connection.status === "APPROVED" ? "success" : connection.status === "PENDING" ? "warning" : "default"} /></TableCell>
          <TableCell>{connection.status === "PENDING" ? <Stack direction="row" gap={1}><Button size="small" variant="contained" color="success" disabled={actionId === connection.connection_id} onClick={() => onStatusUpdate(connection.connection_id, "APPROVED")}>Approve</Button><Button size="small" variant="outlined" color="error" disabled={actionId === connection.connection_id} onClick={() => onStatusUpdate(connection.connection_id, "REJECTED")}>Reject</Button></Stack> : "-"}</TableCell>
        </TableRow>) : null}
      </DataTable>
    </>
  );
}
