"use client";

import { useEffect, useState } from "react";
import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../../../utils/axiosInstance";
import LabReportPage, {
  CreateTableDialog,
  DEFAULT_RESULT_COLUMNS,
  LabReportEditActions,
  createReportColumn as newColumn,
  createReportField as newField,
  createReportPage as newReportPage,
  createReportTable as newTableBlock,
  createReportTextBlock as newTextBlock,
  paginateReportPage,
} from "./LabReportPage";

const ACTIVE_TEMPLATE_PREFIX = "lab-active-report-template-v1";
const DEFAULT_COMMON_LAYOUT = {
  labName: "YOUR LAB NAME",
  brandMark: "LAB",
  tagline: "ACCURATE & AFFORDABLE ALWAYS",
  reportTitle: "TEST REPORT",
  approvedBy: "Lab Pathologist",
  qualification: "Qualification / Registration No.",
  authenticationText: "This is an electronically authenticated report.",
  registrationNumber: "",
  phoneNumber: "",
  address: "",
};

const normalizeTemplate = (template) => ({
  id: template.id,
  templateKey: template.templateKey || template.id,
  name: template.name,
  isPublic: template.isPublic ?? true,
  isOwner: template.isOwner ?? true,
  commonLayout: template.commonLayout || null,
  outOfRangeColor: template.outOfRangeColor || "#c62828",
  pages: (template.pages?.length ? template.pages : [{
    id: `${template.id}-page-1`,
    panelTitle: template.panelTitle,
    sampleType: template.sampleType,
    instructions: template.instructions,
    textBlocks: template.textBlocks,
    columnLabels: template.columnLabels,
    fields: template.fields,
  }]).map((page, index) => ({
    ...page,
    id: page.id || `${template.id}-page-${index + 1}`,
    textBlocks: (page.textBlocks || []).map((block) => ({ ...block, type: block.type || "text" })),
    tableBlocks: (page.tableBlocks || []).map((table) => ({ ...table, title: table.title || "New table", rows: table.rows || [] })),
    columns: page.columns || (page.columnLabels || DEFAULT_RESULT_COLUMNS.map((column) => column.label)).map((label, columnIndex) => ({
      ...(DEFAULT_RESULT_COLUMNS[columnIndex] || { id: `custom-${columnIndex}`, key: "custom" }),
      label: typeof label === "string" ? label : label.label,
    })),
    fields: (page.fields || []).map((field) => ({
      ...field,
      result: field.result ?? field.referenceInterval ?? "",
      highlightOutsideRange: field.highlightOutsideRange ?? true,
      boldOutsideRange: field.boldOutsideRange ?? true,
      cells: field.cells || {},
    })),
  })),
});

function InlineInput({ value, onChange, ariaLabel, sx = {}, multiline = false }) {
  return (
    <TextField
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      variant="standard"
      size="small"
      fullWidth
      multiline={multiline}
      aria-label={ariaLabel}
      sx={{ "& .MuiInputBase-input": { fontFamily: "inherit", fontSize: "inherit", textAlign: "inherit", color: "inherit", py: 0 }, ...sx }}
    />
  );
}

export default function LabReportTemplateEditor() {
  const [labId, setLabId] = useState("");
  const [labDetails, setLabDetails] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [commonLayout, setCommonLayout] = useState(DEFAULT_COMMON_LAYOUT);
  const [activeId, setActiveId] = useState("cbc");
  const [storageReady, setStorageReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState(null);
  const [draftCommon, setDraftCommon] = useState(DEFAULT_COMMON_LAYOUT);
  const [editing, setEditing] = useState(false);
  const [draftIsNew, setDraftIsNew] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tablePageIndex, setTablePageIndex] = useState(0);
  const [removeTemplateDialogOpen, setRemoveTemplateDialogOpen] = useState(false);
  const [selectingTemplateId, setSelectingTemplateId] = useState("");

  const templatePayload = (template, layout) => ({
    templateKey: template.templateKey || template.id,
    name: template.name,
    layout: {
      commonLayout: layout,
      outOfRangeColor: template.outOfRangeColor || "#c62828",
      pages: template.pages,
    },
  });

  useEffect(() => {
    let mounted = true;
    api.get("/api/labs/getLabProfile")
      .then((response) => {
        if (!mounted) return;
        const profileId = response.data?.data?.id;
        if (!profileId) {
          setError("Lab profile was not found. Complete lab setup before editing templates.");
          setLoading(false);
          return;
        }
        setLabDetails(response.data.data);
        setCommonLayout((current) => ({
          ...current,
          labName: response.data.data.lab_name || current.labName,
          registrationNumber: response.data.data.registration_number || current.registrationNumber,
          phoneNumber: response.data.data.phone_number || current.phoneNumber,
          address: response.data.data.address || current.address,
        }));
        setLabId(String(profileId));
      })
      .catch((requestError) => {
        if (mounted) {
          setError(requestError.response?.data?.message || "Unable to load the lab profile.");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!labId) return;
    let mounted = true;
    const loadTemplates = async () => {
      try {
        const response = await api.get("/api/labs/templates");
        const summaries = (response.data?.data || []).map(normalizeTemplate);
        const savedActiveId = localStorage.getItem(`${ACTIVE_TEMPLATE_PREFIX}:${labId}`);
        const savedActiveTemplate = summaries.find((template) => String(template.id) === savedActiveId)
          || summaries.find((template) => template.isOwner && template.templateKey === savedActiveId)
          || summaries.find((template) => template.templateKey === savedActiveId);
        const selectedKey = savedActiveTemplate?.id || summaries[0]?.id || "";
        if (!mounted) return;
        setTemplates(summaries);
        setActiveId(selectedKey);
        if (!selectedKey) return;
        const detailResponse = await api.get(`/api/labs/templates/by-id/${encodeURIComponent(selectedKey)}`);
        const selected = normalizeTemplate(detailResponse.data.data);
        const loaded = summaries.map((template) => template.id === selected.id ? selected : template);
        const sharedLayout = selected.commonLayout;
        setCommonLayout({
          ...DEFAULT_COMMON_LAYOUT,
          ...(sharedLayout || {}),
          labName: labDetails?.lab_name || sharedLayout?.labName || DEFAULT_COMMON_LAYOUT.labName,
          registrationNumber: labDetails?.registration_number || sharedLayout?.registrationNumber || "",
          phoneNumber: labDetails?.phone_number || sharedLayout?.phoneNumber || "",
          address: labDetails?.address || sharedLayout?.address || "",
        });
        setTemplates(loaded);
        setActiveId(selected.id);
      } catch (requestError) {
        if (!mounted) return;
        setError(requestError.response?.data?.message || "Unable to load report templates from the server.");
      } finally {
        if (mounted) {
          setStorageReady(true);
          setLoading(false);
        }
      }
    };
    loadTemplates();
    return () => { mounted = false; };
  }, [labId]);

  useEffect(() => {
    if (!storageReady || !labId || !activeId) return;
    try {
      localStorage.setItem(`${ACTIVE_TEMPLATE_PREFIX}:${labId}`, activeId);
    } catch {
      setError("Unable to save templates in this browser. Check available storage.");
    }
  }, [activeId, commonLayout, labId, storageReady, templates]);

  const activeTemplate = templates.find((template) => template.id === activeId) || templates[0];

  const selectTemplate = async (templateKey) => {
    if (editing || templateKey === activeId) return;
    setSelectingTemplateId(templateKey);
    try {
      const response = await api.get(`/api/labs/templates/by-id/${encodeURIComponent(templateKey)}`);
      const selected = normalizeTemplate(response.data.data);
      setTemplates((current) => current.map((template) => template.id === selected.id ? selected : template));
      setActiveId(selected.id);
      if (selected.commonLayout) setCommonLayout((current) => ({ ...current, ...selected.commonLayout }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load the selected template.");
    } finally {
      setSelectingTemplateId("");
    }
  };

  const confirmRemoveTemplate = async () => {
    if (!activeTemplate) return;
    try {
      await api.delete(`/api/labs/templates/by-id/${encodeURIComponent(activeTemplate.id)}`);
      const remaining = templates.filter((template) => template.id !== activeTemplate.id);
      setTemplates(remaining);
      setActiveId(remaining[0]?.id || "");
      setNotice(`${activeTemplate.name} template removed.`);
      setRemoveTemplateDialogOpen(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to remove template from the server.");
    }
  };

  const startEditing = () => {
    if (!activeTemplate) return;
    setDraft({
      ...activeTemplate,
      pages: activeTemplate.pages.map((page) => ({
        ...page,
        columns: page.columns.map((column) => ({ ...column })),
        fields: page.fields.map((field) => ({ ...field, cells: { ...(field.cells || {}) } })),
        textBlocks: page.textBlocks.map((block) => ({ ...block })),
        tableBlocks: page.tableBlocks.map((table) => ({ ...table, rows: table.rows.map((row) => [...row]) })),
      })),
    });
    setDraftCommon({ ...commonLayout });
    setDraftIsNew(false);
    setSaveError("");
    setEditing(true);
  };

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateDraftPage = (pageIndex, key, value) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index === pageIndex ? { ...page, [key]: value } : page),
  }));
  const updateDraftField = (pageIndex, fieldId, key, value) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
      ...page,
      fields: page.fields.map((field) => {
        if (field.id !== fieldId) return field;
        if (key.startsWith("column:")) {
          const columnId = key.slice("column:".length);
          return { ...field, cells: { ...(field.cells || {}), [columnId]: value } };
        }
        if (key === "referenceInterval") {
          const resultWasReference = !field.result || field.result === field.referenceInterval;
          return { ...field, referenceInterval: value, result: resultWasReference ? value : field.result };
        }
        return { ...field, [key]: value };
      }),
    })),
  }));

  const updateDraftColumnLabel = (pageIndex, columnId, label) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
      ...page,
      columns: page.columns.map((column) => column.id === columnId ? { ...column, label } : column),
    })),
  }));

  const addDraftColumn = (pageIndex) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
      ...page,
      columns: [...page.columns, newColumn()],
    })),
  }));

  const updateDraftCommon = (key, value) => setDraftCommon((current) => ({ ...current, [key]: value }));
  const updateDraftTextBlock = (pageIndex, blockId, key, value, chunkIndex = null) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
      ...page,
      textBlocks: page.textBlocks.map((block) => {
        if (block.id !== blockId) return block;
        if (key !== "content" || chunkIndex === null) return { ...block, [key]: value };
        const chunks = [];
        for (let offset = 0; offset < block.content.length; offset += 700) chunks.push(block.content.slice(offset, offset + 700));
        if (!chunks.length) chunks.push("");
        chunks[chunkIndex] = value;
        return { ...block, content: chunks.join("") };
      }),
    })),
  }));

  const saveTemplate = async () => {
    if (!draft.name.trim()) {
      setSaveError("Template name is required.");
      return;
    }
    const pages = draft.pages.map((page) => ({
      ...page,
      panelTitle: page.panelTitle.trim(),
      fields: page.fields.filter((field) => field.parameter.trim()).map((field) => ({
        ...field,
        parameter: field.parameter.trim(),
        section: field.section.trim(),
        referenceInterval: field.referenceInterval.trim(),
        result: String(field.result ?? "").trim(),
        unit: field.unit.trim(),
        method: field.method.trim(),
      })),
      textBlocks: page.textBlocks.map((block) => ({ ...block, title: block.title.trim() })),
      tableBlocks: page.tableBlocks.map((table) => ({ ...table, title: table.title.trim() })),
    }));
    if (pages.some((page) => !page.panelTitle)) {
      setSaveError("Each page needs a section heading.");
      return;
    }
    const saved = { ...draft, name: draft.name.trim(), pages };
    try {
      const response = draftIsNew
        ? await api.post("/api/labs/templates", templatePayload(saved, draftCommon))
        : await api.patch(`/api/labs/templates/by-id/${encodeURIComponent(saved.id)}`, templatePayload(saved, draftCommon));
      const responseTemplate = response.data?.data;
      const persisted = normalizeTemplate(responseTemplate);
      setTemplates((current) => draftIsNew
        ? [persisted, ...current]
        : current.map((template) => template.id === persisted.id ? persisted : template));
      setActiveId(persisted.id);
      setCommonLayout({ ...draftCommon });
      setEditing(false);
      setDraftIsNew(false);
      setDraft(null);
      setNotice(`${persisted.name} template saved.`);
    } catch (requestError) {
      setSaveError(requestError.response?.data?.message || "Unable to save template on the server.");
    }
  };

  const cancelEditing = () => {
    if (draftIsNew) setActiveId(templates[0]?.id || "cbc");
    setEditing(false);
    setDraftIsNew(false);
    setDraft(null);
    setSaveError("");
  };

  const createTemplate = () => {
    const id = `custom-${Date.now()}`;
    setActiveId(id);
    setDraft({
      id,
      name: "New test template",
      outOfRangeColor: "#c62828",
      pages: [newReportPage(1)],
    });
    setDraftCommon({ ...commonLayout });
    setDraftIsNew(true);
    setSaveError("");
    setEditing(true);
  };

  const removeLastDraftField = (pageIndex) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index === pageIndex && page.fields.length > 1 ? { ...page, fields: page.fields.slice(0, -1) } : page),
  }));

  const removeLastDraftColumn = (pageIndex) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index === pageIndex && page.columns.length > 1 ? { ...page, columns: page.columns.slice(0, -1) } : page),
  }));

  const removeDraftTextBlock = (pageIndex, blockId) => {
    setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, index) => index === pageIndex ? { ...page, textBlocks: page.textBlocks.filter((block) => block.id !== blockId) } : page),
    }));
  };

  const updateDraftTable = (pageIndex, tableId, updateTable) => setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
        ...page,
      tableBlocks: page.tableBlocks.map((table) => table.id === tableId ? updateTable(table) : table),
      })),
    }));

  const updateDraftTableCell = (pageIndex, tableId, rowIndex, columnIndex, value) => updateDraftTable(pageIndex, tableId, (table) => {
    const rows = table.rows.map((row) => [...row]);
    rows[rowIndex][columnIndex] = value;
    return { ...table, rows };
  });

  const updateDraftTableTitle = (pageIndex, tableId, title) => updateDraftTable(pageIndex, tableId, (table) => ({ ...table, title }));

  const removeDraftTable = (pageIndex, tableId) => setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, index) => index === pageIndex ? { ...page, tableBlocks: page.tableBlocks.filter((table) => table.id !== tableId) } : page),
    }));

  const addDraftTableRow = (pageIndex, tableId) => updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: [...table.rows, Array.from({ length: table.rows[0]?.length || 1 }, () => "")],
    }));

  const removeDraftTableRow = (pageIndex, tableId) => updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: table.rows.length > 1 ? table.rows.slice(0, -1) : table.rows,
    }));

  const addDraftTableColumn = (pageIndex, tableId) => updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: table.rows.map((row) => [...row, ""]),
    }));

  const removeDraftTableColumn = (pageIndex, tableId) => updateDraftTable(pageIndex, tableId, (table) => ({
      ...table,
      rows: table.rows[0]?.length > 1 ? table.rows.map((row) => row.slice(0, -1)) : table.rows,
    }));

  const openTableDialog = (pageIndex) => {
    setTablePageIndex(pageIndex);
    setTableDialogOpen(true);
  };

  const addTableBlock = (rows, columns) => {
    setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, index) => index === tablePageIndex ? { ...page, tableBlocks: [...page.tableBlocks, newTableBlock(rows, columns)] } : page),
    }));
    setTableDialogOpen(false);
  };

  const addReportPage = () => {
    const nextPage = newReportPage((draft?.pages.length || 0) + 1);
    setDraft((current) => ({ ...current, pages: [...current.pages, nextPage] }));
  };

  const removeReportPage = (pageIndex) => {
    if (draft.pages.length <= 1) return;
    const nextPages = draft.pages.filter((_, index) => index !== pageIndex);
    setDraft((current) => ({ ...current, pages: nextPages }));
  };

  const renderablePages = (editing ? draft?.pages : activeTemplate?.pages || []).flatMap((page, sourcePageIndex) => (
    paginateReportPage(page, editing ? 10 : 14).map((contentPage, continuationIndex) => ({ page: contentPage, sourcePageIndex, continuationIndex }))
  ));

  const useTemplate = () => {
    if (!activeTemplate || !labId) return;
    localStorage.setItem(`${ACTIVE_TEMPLATE_PREFIX}:${labId}`, activeTemplate.id);
    setNotice(`${activeTemplate.name} selected for use on a test request.`);
  };

return (
  <Box
    sx={{
      display: "grid",
      gap: 1.5,
      width: "100%",
    }}
  >
    {/* =========================
        PAGE HEADER
    ========================== */}
  

    {/* =========================
        ALERTS
    ========================== */}

    {error ? (
      <Alert
        severity="error"
        sx={{
          py: 0.3,
          borderRadius: "8px",
          fontSize: "11px",

          "& .MuiAlert-icon": {
            fontSize: 18,
          },
        }}
      >
        {error}
      </Alert>
    ) : null}

    {notice ? (
      <Alert
        severity="success"
        onClose={() => setNotice("")}
        sx={{
          py: 0.3,
          borderRadius: "8px",
          fontSize: "11px",

          "& .MuiAlert-icon": {
            fontSize: 18,
          },
        }}
      >
        {notice}
      </Alert>
    ) : null}

    {loading ? (
      <Typography
        sx={{
          fontSize: "11.5px",
          color: "#64748B",
        }}
      >
        Loading lab profile…
      </Typography>
    ) : null}

    {!loading && !error && activeTemplate ? (
      <>
        {/* =========================
            TEMPLATE TOOLBAR
        ========================== */}

    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: { xs: "wrap", md: "nowrap" },
    gap: 1.2,

    width: "100%",
    p: 1.1,

    bgcolor: "#F7FAF9",
    border: "1px solid #E3EBE7",
    borderRadius: "9px",
  }}
>
  {/* =====================================
      LEFT - SEARCHABLE TEMPLATE
  ====================================== */}
 <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexShrink: 0,
    width: { xs: "100%", sm: "auto" },
  }}
>
  <Typography
    sx={{
      fontSize: "11px",
      fontWeight: 700,
      color: "#475569",
      whiteSpace: "nowrap",
    }}
  >
    Template
  </Typography>

  <Autocomplete
    size="small"
    disableClearable
    disabled={editing || Boolean(selectingTemplateId)}
    options={templates}
    value={
      templates.find(
        (template) => template.id === activeId
      ) || null
    }
    getOptionLabel={(option) => option?.name || ""}
    isOptionEqualToValue={(option, value) =>
      option.id === value.id
    }
    onChange={(_, template) => {
      if (template) {
        selectTemplate(template.id);
      }
    }}
    noOptionsText="No template found"
    sx={{
      width: {
        xs: "100%",
        sm: 280,
        md: 300,
      },

      flexShrink: 0,

      "& .MuiOutlinedInput-root": {
        height: 38,
        py: "0 !important",
        pl: "6px !important",
        pr: "34px !important",

        bgcolor: "#FFFFFF",
        borderRadius: "7px",

        "& fieldset": {
          borderColor: "#CFDDD7",
        },

        "&:hover fieldset": {
          borderColor: "#AFC7BE",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#07876A",
          borderWidth: "1px",
        },
      },

      "& .MuiAutocomplete-input": {
        fontSize: "11.5px",
        fontWeight: 650,
        color: "#172033",
      },

      "& .MuiAutocomplete-popupIndicator": {
        color: "#07876A",
      },

      "& .MuiAutocomplete-endAdornment": {
        right: "5px !important",
      },
    }}
    slotProps={{
      paper: {
        sx: {
          mt: 0.5,
          border: "1px solid #E1E9E5",
          borderRadius: "8px",
          boxShadow:
            "0 10px 28px rgba(15, 23, 42, 0.10)",
          overflow: "hidden",

          "& .MuiAutocomplete-listbox": {
            p: 0.6,
            maxHeight: 260,

            "& .MuiAutocomplete-option": {
              minHeight: 35,
              px: 1.1,
              py: 0.6,
              borderRadius: "6px",

              fontSize: "11px",
              fontWeight: 600,
              color: "#475569",

              "&[aria-selected='true']": {
                bgcolor: "#EDF7F2",
                color: "#07876A",
                fontWeight: 700,
              },

              "&.Mui-focused": {
                bgcolor: "#F4F8F6",
              },

              "&.Mui-focused[aria-selected='true']": {
                bgcolor: "#E7F4EE",
              },
            },
          },
        },
      },
    }}
    renderOption={(props, option) => {
      const selected = option.id === activeId;

      return (
        <Box
          component="li"
          {...props}
          key={option.id}
          sx={{
            display: "flex !important",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              minWidth: 0,
              fontSize: "11px",
              fontWeight: selected ? 700 : 600,
              color: selected ? "#07876A" : "#475569",

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {option.name}
          </Typography>

          {selected ? (
            <Box
              sx={{
                px: 0.7,
                py: 0.2,
                flexShrink: 0,

                bgcolor: "#DDF2E9",
                borderRadius: "4px",

                color: "#07876A",
                fontSize: "8px",
                fontWeight: 750,
                textTransform: "uppercase",
              }}
            >
              Selected
            </Box>
          ) : null}
        </Box>
      );
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Search templates..."
        inputProps={{
          ...params.inputProps,
          autoComplete: "off",
        }}
      />
    )}
  />
</Box>

  {/* =====================================
      RIGHT - ALL ACTION BUTTONS
  ====================================== */}
  <Stack
    direction="row"
    spacing={0.8}
    useFlexGap
    flexWrap="wrap"
    sx={{
      ml: { xs: 0, md: "auto" },
      width: { xs: "100%", md: "auto" },
      justifyContent: {
        xs: "flex-start",
        md: "flex-end",
      },
      alignItems: "center",
    }}
  >
    {editing ? (
      <>
        {/* ADD PAGE */}
        <Button
          startIcon={
            <AddOutlined
              sx={{
                fontSize: "15px !important",
              }}
            />
          }
          onClick={addReportPage}
          variant="outlined"
          size="small"
          sx={{
            height: 38,
            px: 1.4,

            borderRadius: "7px",
            borderColor: "#D4DFDA",

            bgcolor: "#FFFFFF",
            color: "#475569",

            fontSize: "10.5px",
            fontWeight: 650,
            textTransform: "none",

            boxShadow: "none",

            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: "#B8C8C1",
              boxShadow: "none",
            },
          }}
        >
          Add page
        </Button>

        {/* CANCEL */}
        <Button
          startIcon={
            <CloseOutlined
              sx={{
                fontSize: "15px !important",
              }}
            />
          }
          onClick={cancelEditing}
          variant="outlined"
          size="small"
          sx={{
            height: 38,
            px: 1.4,

            borderRadius: "7px",
            borderColor: "#D4DFDA",

            bgcolor: "#FFFFFF",
            color: "#64748B",

            fontSize: "10.5px",
            fontWeight: 650,
            textTransform: "none",

            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: "#B8C8C1",
            },
          }}
        >
          Cancel
        </Button>

        {/* SAVE TEMPLATE */}
        <Button
          startIcon={
            <SaveOutlined
              sx={{
                fontSize: "15px !important",
              }}
            />
          }
          onClick={saveTemplate}
          variant="contained"
          size="small"
          sx={{
            height: 38,
            px: 1.5,

            borderRadius: "7px",

            bgcolor: "#07876A",
            color: "#FFFFFF",

            fontSize: "10.5px",
            fontWeight: 700,
            textTransform: "none",

            boxShadow: "none",

            "&:hover": {
              bgcolor: "#07876A",
              boxShadow: "none",
            },
          }}
        >
          Save template
        </Button>
      </>
    ) : (
      <>
        {/* NEW TEMPLATE */}
        <Button
          startIcon={
            <AddOutlined
              sx={{
                fontSize: "15px !important",
              }}
            />
          }
          onClick={createTemplate}
          disabled={loading || Boolean(error)}
          variant="outlined"
          size="small"
          sx={{
            height: 38,
            px: 1.4,

            borderRadius: "7px",
            borderColor: "#D4DFDA",

            bgcolor: "#FFFFFF",
            color: "#334155",

            fontSize: "10.5px",
            fontWeight: 650,
            textTransform: "none",

            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: "#B8C8C1",
            },
          }}
        >
          New template
        </Button>

        {/* EDIT TEMPLATE */}
        <Button
          startIcon={
            <EditOutlined
              sx={{
                fontSize: "14px !important",
              }}
            />
          }
          onClick={startEditing}
          disabled={
            !activeTemplate ||
            activeTemplate.isOwner === false ||
            loading ||
            Boolean(error)
          }
          variant="outlined"
          size="small"
          sx={{
            height: 38,
            px: 1.4,

            borderRadius: "7px",
            borderColor: "#B9D9D0",

            bgcolor: "#F6FBF9",
            color: "#07876A",

            fontSize: "10.5px",
            fontWeight: 650,
            textTransform: "none",

            "&:hover": {
              bgcolor: "#F6FBF9",
              borderColor: "#07876A",
            },
          }}
        >
          Edit template
        </Button>

        {/* REMOVE TEMPLATE */}
        <Button
          startIcon={
            <DeleteOutline
              sx={{
                fontSize: "14px !important",
              }}
            />
          }
          onClick={() =>
            setRemoveTemplateDialogOpen(true)
          }
          disabled={
            !activeTemplate ||
            activeTemplate.isOwner === false ||
            loading ||
            Boolean(error)
          }
          variant="outlined"
          size="small"
          sx={{
            height: 38,
            px: 1.4,

            borderRadius: "7px",
            borderColor: "#F0CECB",

            bgcolor: "#FFFDFC",
            color: "#B42318",

            fontSize: "10.5px",
            fontWeight: 650,
            textTransform: "none",

            "&:hover": {
              bgcolor: "#FFFDFC",
              borderColor: "#E8B8B4",
            },
          }}
        >
          Remove
        </Button>

        {/* USE TEMPLATE */}
        <Button
          startIcon={
            <SaveOutlined
              sx={{
                fontSize: "14px !important",
              }}
            />
          }
          onClick={useTemplate}
          disabled={
            !activeTemplate ||
            loading ||
            Boolean(error)
          }
          variant="contained"
          size="small"
          sx={{
            height: 38,
            px: 1.6,

            borderRadius: "7px",

            bgcolor: "#07876A",
            color: "#FFFFFF",

            fontSize: "10.5px",
            fontWeight: 700,
            textTransform: "none",

            boxShadow: "none",

            "&:hover": {
              bgcolor: "#07876A",
              boxShadow: "none",
            },
          }}
        >
          Use template
        </Button>
      </>
    )}
  </Stack>
</Box>

        {/* =========================
            EDIT SETTINGS
        ========================== */}

        {editing ? (
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "minmax(260px, 420px) auto",
              },

              alignItems: "center",

              justifyContent: "start",

              gap: 1.2,

              p: 1.2,

              bgcolor: "#FFFFFF",

              border: "1px solid #E4EAEF",

              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  mb: 0.5,

                  fontSize: "9.5px",

                  fontWeight: 700,

                  color: "#64748B",

                  textTransform: "uppercase",

                  letterSpacing: "0.05em",
                }}
              >
                Template name
              </Typography>

              <InlineInput
                ariaLabel="Template name"
                value={draft.name}
                onChange={(value) =>
                  updateDraft("name", value)
                }
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 0.5,

                  fontSize: "9.5px",

                  fontWeight: 700,

                  color: "#64748B",

                  textTransform: "uppercase",

                  letterSpacing: "0.05em",
                }}
              >
                Out-of-range color
              </Typography>

              <Box
                sx={{
                  height: 35,

                  display: "flex",

                  alignItems: "center",

                  gap: 0.8,

                  px: 1,

                  bgcolor: "#FAFBFB",

                  border:
                    "1px solid #E2E8F0",

                  borderRadius: "7px",
                }}
              >
                <input
                  aria-label="Template out-of-range color"
                  type="color"
                  value={
                    draft.outOfRangeColor ||
                    "#c62828"
                  }
                  onChange={(event) =>
                    updateDraft(
                      "outOfRangeColor",
                      event.target.value
                    )
                  }
                  style={{
                    width: 25,

                    height: 25,

                    border: 0,

                    padding: 0,

                    background:
                      "transparent",

                    cursor: "pointer",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "10.5px",

                    fontWeight: 600,

                    color: "#475569",

                    whiteSpace: "nowrap",
                  }}
                >
                  {draft.outOfRangeColor ||
                    "#c62828"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : null}

        {/* =========================
            REPORT PREVIEW AREA
        ========================== */}

        <Box
          sx={{
            width: "100%",

            mt: 0.3,

            p: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },

            bgcolor: "#F4F7F6",

            border: "1px solid #E5EBE8",

            borderRadius: "10px",

            overflowX: "auto",
          }}
        >
          {renderablePages.map(
            (
              {
                page,
                sourcePageIndex,
                continuationIndex,
              },
              renderIndex
            ) => {
              const sourceTemplatePage = (
                editing
                  ? draft.pages
                  : activeTemplate.pages
              )[sourcePageIndex];

              const canEditCommon =
                editing && renderIndex === 0;

              return (
                <Box
                  key={`${sourceTemplatePage.id}-continuation-${continuationIndex}`}
                  className="lab-report-page-wrap"
                  sx={{
                    mb:
                      renderIndex ===
                      renderablePages.length -
                        1
                        ? 0
                        : 2,
                  }}
                >
                  {editing &&
                  continuationIndex === 0 &&
                  draft.pages.length > 1 ? (
                    <Button
                      color="error"
                      size="small"
                      startIcon={
                        <DeleteOutline
                          sx={{
                            fontSize:
                              "15px !important",
                          }}
                        />
                      }
                      onClick={() =>
                        removeReportPage(
                          sourcePageIndex
                        )
                      }
                      sx={{
                        mb: 0.8,

                        height: 31,

                        px: 1.2,

                        borderRadius: "6px",

                        bgcolor: "#FFFFFF",

                        border:
                          "1px solid #F0D0CD",

                        color: "#B42318",

                        fontSize: "10px",

                        fontWeight: 650,

                        textTransform: "none",

                        "&:hover": {
                          bgcolor: "#FFFFFF",
                        },
                      }}
                    >
                      Remove page{" "}
                      {sourcePageIndex + 1}
                    </Button>
                  ) : null}

                  <LabReportPage
                    page={page}
                    commonLayout={
                      editing
                        ? draftCommon
                        : commonLayout
                    }
                    patientFields={[
                      {
                        label: "Name",
                        value: "Patient Name",
                      },
                      {
                        label: "Reg. No.",
                        value: "LAB-ORDER-ID",
                      },
                      {
                        label: "Age & Sex",
                        value: "Age / Gender",
                      },
                      {
                        label: "Reg. Date",
                        value:
                          "DD/MM/YYYY  HH:MM AM",
                      },
                      {
                        label: "Referred By",
                        value:
                          "Doctor / Self",
                      },
                      {
                        label: "Collected On",
                        value:
                          "DD/MM/YYYY  HH:MM AM",
                      },
                      {
                        label: "Client",
                        value:
                          "Client / Walk-in",
                      },
                    ]}
                    pageNumber={
                      renderIndex + 1
                    }
                    pageCount={
                      renderablePages.length
                    }
                    continuationIndex={
                      continuationIndex
                    }
                    lastPage={
                      renderIndex ===
                      renderablePages.length -
                        1
                    }
                    templateEditing={editing}
                    editCommon={canEditCommon}
                    editPageDetails={
                      editing &&
                      continuationIndex === 0
                    }
                    outOfRangeColor={
                      editing
                        ? draft.outOfRangeColor
                        : activeTemplate.outOfRangeColor
                    }
                    onCommonChange={
                      updateDraftCommon
                    }
                    onPageChange={(
                      key,
                      value
                    ) =>
                      updateDraftPage(
                        sourcePageIndex,
                        key,
                        value
                      )
                    }
                    onFieldChange={(
                      fieldId,
                      key,
                      value
                    ) =>
                      updateDraftField(
                        sourcePageIndex,
                        fieldId,
                        key,
                        value
                      )
                    }
                    onColumnLabelChange={(
                      columnId,
                      label
                    ) =>
                      updateDraftColumnLabel(
                        sourcePageIndex,
                        columnId,
                        label
                      )
                    }
                    onTableTitleChange={(
                      tableId,
                      title
                    ) =>
                      updateDraftTableTitle(
                        sourcePageIndex,
                        tableId,
                        title
                      )
                    }
                    onTableCellChange={(
                      tableId,
                      rowIndex,
                      columnIndex,
                      value
                    ) =>
                      updateDraftTableCell(
                        sourcePageIndex,
                        tableId,
                        rowIndex,
                        columnIndex,
                        value
                      )
                    }
                    onAddTableRow={(tableId) =>
                      addDraftTableRow(
                        sourcePageIndex,
                        tableId
                      )
                    }
                    onRemoveTableRow={(
                      tableId
                    ) =>
                      removeDraftTableRow(
                        sourcePageIndex,
                        tableId
                      )
                    }
                    onAddTableColumn={(
                      tableId
                    ) =>
                      addDraftTableColumn(
                        sourcePageIndex,
                        tableId
                      )
                    }
                    onRemoveTableColumn={(
                      tableId
                    ) =>
                      removeDraftTableColumn(
                        sourcePageIndex,
                        tableId
                      )
                    }
                    onRemoveTable={(tableId) =>
                      removeDraftTable(
                        sourcePageIndex,
                        tableId
                      )
                    }
                    onTextBlockChange={(
                      blockId,
                      key,
                      value,
                      chunkIndex
                    ) =>
                      updateDraftTextBlock(
                        sourcePageIndex,
                        blockId,
                        key,
                        value,
                        chunkIndex
                      )
                    }
                    onRemoveTextBlock={(
                      blockId
                    ) =>
                      removeDraftTextBlock(
                        sourcePageIndex,
                        blockId
                      )
                    }
                    actions={
                      editing &&
                      renderIndex ===
                        renderablePages.length -
                          1 ? (
                        <LabReportEditActions
                          onAddRow={() =>
                            updateDraftPage(
                              sourcePageIndex,
                              "fields",
                              [
                                ...draft.pages[
                                  sourcePageIndex
                                ].fields,
                                newField(),
                              ]
                            )
                          }
                          onRemoveRow={() =>
                            removeLastDraftField(
                              sourcePageIndex
                            )
                          }
                          canRemoveRow={
                            draft.pages[
                              sourcePageIndex
                            ].fields.length > 1
                          }
                          onAddColumn={() =>
                            addDraftColumn(
                              sourcePageIndex
                            )
                          }
                          onRemoveColumn={() =>
                            removeLastDraftColumn(
                              sourcePageIndex
                            )
                          }
                          canRemoveColumn={
                            draft.pages[
                              sourcePageIndex
                            ].columns.length >
                            1
                          }
                          onCreateTable={() =>
                            openTableDialog(
                              sourcePageIndex
                            )
                          }
                          onAddTextArea={() =>
                            updateDraftPage(
                              sourcePageIndex,
                              "textBlocks",
                              [
                                ...draft.pages[
                                  sourcePageIndex
                                ].textBlocks,
                                newTextBlock(),
                              ]
                            )
                          }
                        />
                      ) : null
                    }
                  />
                </Box>
              );
            }
          )}
        </Box>
      </>
    ) : null}

    {/* =========================
        NO REPORT LAYOUT
    ========================== */}

    {!loading &&
    !error &&
    !renderablePages.length ? (
      <Alert
        severity="warning"
        sx={{
          borderRadius: "8px",
          fontSize: "11px",
        }}
      >
        No report layout is available for this
        template yet.
      </Alert>
    ) : null}

    {/* =========================
        SAVE ERROR
    ========================== */}

    {saveError ? (
      <Alert
        severity="error"
        onClose={() => setSaveError("")}
        sx={{
          borderRadius: "8px",
          fontSize: "11px",
        }}
      >
        {saveError}
      </Alert>
    ) : null}

    {/* =========================
        CREATE TABLE DIALOG
    ========================== */}

    <CreateTableDialog
      open={tableDialogOpen}
      onClose={() =>
        setTableDialogOpen(false)
      }
      onInsert={addTableBlock}
    />

    {/* =========================
        REMOVE TEMPLATE DIALOG
    ========================== */}

    <Dialog
      open={removeTemplateDialogOpen}
      onClose={() =>
        setRemoveTemplateDialogOpen(false)
      }
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",

          alignItems: "center",

          gap: 1,

          fontSize: "15px",

          fontWeight: 700,

          color: "#172033",
        }}
      >
        <DeleteOutline
          sx={{
            color: "#B42318",
            fontSize: 20,
          }}
        />

        Remove template?
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            fontSize: "12px",

            lineHeight: 1.6,

            color: "#64748B",
          }}
        >
          Are you sure you want to remove{" "}
          <Box
            component="strong"
            sx={{
              color: "#172033",
            }}
          >
            {activeTemplate?.name}
          </Box>{" "}
          template? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={() =>
            setRemoveTemplateDialogOpen(false)
          }
          sx={{
            height: 34,

            px: 1.6,

            borderRadius: "7px",

            color: "#64748B",

            fontSize: "11px",

            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={confirmRemoveTemplate}
          color="error"
          variant="contained"
          startIcon={
            <DeleteOutline
              sx={{
                fontSize:
                  "15px !important",
              }}
            />
          }
          sx={{
            height: 34,

            px: 1.6,

            borderRadius: "7px",

            fontSize: "11px",

            fontWeight: 700,

            textTransform: "none",

            boxShadow: "none",
          }}
        >
          Remove template
        </Button>
      </DialogActions>
    </Dialog>

    {/* =========================
        SUCCESS SNACKBAR
    ========================== */}

    <Snackbar
      open={Boolean(notice)}
      autoHideDuration={3000}
      onClose={() => setNotice("")}
    >
      <Alert
        severity="success"
        onClose={() => setNotice("")}
        sx={{
          fontSize: "11px",
          borderRadius: "8px",
        }}
      >
        {notice}
      </Alert>
    </Snackbar>
  </Box>
);
}