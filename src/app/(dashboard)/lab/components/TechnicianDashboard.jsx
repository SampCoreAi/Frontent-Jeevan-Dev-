"use client";

import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, MenuItem, Pagination, Select, Stack, TableCell, TableRow, Typography } from "@mui/material";
import api from "../../../../utils/axiosInstance";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

const statuses = ["PENDING", "REQUESTED", "APPROVED", "ACCEPTED", "REJECTED", "SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "RECOLLECTION_REQUIRED", "PROCESSING", "REPORT_READY", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"];
const technicianTransitions = {
  SAMPLE_SCHEDULED: ["SAMPLE_COLLECTED"],
};

const getAllowedStatuses = (currentStatus) => [
  currentStatus,
  ...(technicianTransitions[currentStatus] || []),
];

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/lab-technicians/tasks", {
        params: {
          search: filters.search || undefined,
          status: filters.status || undefined,
          date: filters.date || undefined,
          page,
          pageSize,
        },
      });
      setTasks(response.data?.data || []);
      setPagination(response.data?.pagination || null);
      setError("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load assigned lab work.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, [filters.search, filters.status, filters.date, page]);

  const updateFilter = (field) => (value) => {
    setFilters((current) => ({ ...current, [field]: value || "" }));
    setPage(1);
  };

  const updateStatus = async (requestId, status) => {
    try {
      setActionId(requestId);
      await api.patch(`/api/lab-technicians/${requestId}/status`, { status });
      await loadTasks();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update task status.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <Box sx={{ pt: 12, px: 3, pb: 4 }}>
      <SectionTitle title="Technician Dashboard" description="Review assigned lab work and keep each task status current." />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <TableFilters
        search={filters.search}
        status={filters.status}
        date={filters.date}
        onSearch={updateFilter("search")}
        onStatus={updateFilter("status")}
        onDate={updateFilter("date")}
        statusOptions={statuses}
        onReset={() => { setFilters({ search: "", status: "", date: "" }); setPage(1); }}
      />
      <DataTable
        columns={["ORDER ID", "REQUEST DATE", "REPORT BY", "COLLECTION SLOT", "TOKEN", "PATIENT DETAILS", "LAB", "SAMPLE", "TESTS", "INSTRUCTIONS", "STATUS"]}
        loading={loading}
        emptyMessage="No assigned lab work found."
        footer={pagination?.totalPages > 1 ? <Pagination count={pagination.totalPages} page={page} onChange={(_, value) => setPage(value)} size="small" color="primary" /> : null}
      >
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell sx={{ fontWeight: 700, color: "#0B5C8E" }}>{task.order_id || `#${task.id}`}</TableCell>
            <TableCell>{task.created_at ? new Date(task.created_at).toLocaleString() : "-"}</TableCell>
            <TableCell>{task.expected_report_at ? new Date(task.expected_report_at).toLocaleString() : "-"}</TableCell>
            <TableCell>{task.collection_slot || task.collectionSlot ? new Date(task.collection_slot || task.collectionSlot).toLocaleString() : "Not scheduled"}</TableCell>
            <TableCell>{task.collection_token || task.collectionToken || "Not assigned"}</TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: 700 }}>{task.patient_name || "-"}</Typography>
              <Typography variant="caption" color="text.secondary">{task.patient_age || "Age -"} · {task.patient_gender || "Gender -"}</Typography>
              <Typography variant="caption" display="block" color="text.secondary">{task.patient_phone || task.patient_email || "Contact unavailable"}</Typography>
              <Typography variant="caption" display="block" color="text.secondary">{task.patient_address || "Address unavailable"}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: 600 }}>{task.lab_name || "-"}</Typography>
              <Typography variant="caption" color="text.secondary">{task.lab_address || task.lab_phone || "-"}</Typography>
            </TableCell>
            <TableCell>{task.sample_type || "-"}</TableCell>
            <TableCell>{Array.isArray(task.requested_tests) ? task.requested_tests.join(", ") : task.requested_tests || "-"}</TableCell>
            <TableCell sx={{ minWidth: 210, maxWidth: 280, whiteSpace: "normal" }}>
              {task.collection_instructions || task.collectionInstructions || "No special instructions"}
            </TableCell>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Select size="small" value={task.status || "PENDING"} disabled={actionId === task.id || task.status === "CANCELLED"} onChange={(event) => updateStatus(task.id, event.target.value)} sx={{ minWidth: 165, fontSize: 12, bgcolor: "transparent", border: 0, color: task.status === "COMPLETED" ? "#15803D" : task.status === "CANCELLED" ? "#DC2626" : "#B45309", fontWeight: 700 }}>
                  {statuses.map((status) => <MenuItem key={status} value={status} disabled={!getAllowedStatuses(task.status).includes(status)} sx={{ fontSize: 12 }}>{status.replaceAll("_", " ")}</MenuItem>)}
                </Select>
                {actionId === task.id ? <CircularProgress size={17} /> : null}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </Box>
  );
}
