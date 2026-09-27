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
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../../../utils/axiosInstance";

const ACTIVE_TEMPLATE_PREFIX = "lab-active-report-template-v1";
const DEFAULT_RESULT_COLUMNS = [
  { id: "parameter", label: "Parameter", key: "parameter" },
  { id: "result", label: "Result", key: "result" },
  { id: "referenceInterval", label: "Bio. Ref. Interval", key: "referenceInterval" },
  { id: "unit", label: "Units", key: "unit" },
  { id: "method", label: "Method", key: "method" },
];
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

const newField = () => ({ id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, section: "", parameter: "", referenceInterval: "", result: "", highlightOutsideRange: true, boldOutsideRange: true, cells: {}, unit: "", method: "" });
const newTextBlock = (type = "text") => ({ id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, title: type === "label" ? "Label" : "Notes", content: type === "label" ? "New label" : "" });
const newColumn = () => ({ id: `column-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: "New column", key: "custom" });
const newTableBlock = (rows, columns) => ({
  id: `table-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "New table",
  rows: Array.from({ length: rows }, (_, rowIndex) => Array.from({ length: columns }, (_, columnIndex) => rowIndex === 0 ? `Header ${columnIndex + 1}` : "")),
});
const newReportPage = (pageNumber) => ({
  id: `page-${Date.now()}-${pageNumber}`,
  panelTitle: pageNumber > 1 ? "CONTINUED" : "NEW TEST SECTION",
  sampleType: "",
  instructions: "",
  textBlocks: [],
  tableBlocks: [],
  columns: DEFAULT_RESULT_COLUMNS.map((column) => ({ ...column })),
  fields: [newField()],
});
const normalizeTemplate = (template) => ({
  id: template.id,
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

const paginateReportPage = (page, maxBodyUnits = 20) => {
  const instructionUnits = page.instructions?.length > 350
    ? Math.ceil(page.instructions.length / 350)
    : 0;
  const pageCapacity = Math.max(6, maxBodyUnits - instructionUnits);
  const segments = [];
  let current = { fields: [], textBlocks: [], tableBlocks: [], units: 0 };

  const flush = () => {
    if (!current.fields.length && !current.textBlocks.length && !current.tableBlocks.length && segments.length) return;
    segments.push({ ...page, fields: current.fields, textBlocks: current.textBlocks, tableBlocks: current.tableBlocks });
    current = { fields: [], textBlocks: [], tableBlocks: [], units: 0 };
  };

  const groups = [];
  (page.fields || []).forEach((field) => {
    const section = field.section || "";
    let group = groups[groups.length - 1];
    if (!group || group.section !== section) {
      group = { section, fields: [] };
      groups.push(group);
    }
    group.fields.push(field);
  });

  groups.forEach((group) => {
    let offset = 0;
    while (offset < group.fields.length) {
      const sectionCost = group.section && offset === 0 ? 1 : 0;
      const capacity = Math.max(1, pageCapacity - sectionCost);
      const take = Math.min(capacity, group.fields.length - offset);
      const cost = take + sectionCost;
      if (current.units && current.units + cost > pageCapacity) flush();
      current.fields.push(...group.fields.slice(offset, offset + take));
      current.units += cost;
      offset += take;
      if (offset < group.fields.length) flush();
    }
  });

  (page.textBlocks || []).forEach((block) => {
    const content = String(block.content || "");
    const chunks = [];
    for (let offset = 0; offset < content.length; offset += 700) {
      chunks.push(content.slice(offset, offset + 700));
    }
    if (!chunks.length) chunks.push("");
    chunks.forEach((text, index) => {
      const cost = Math.max(2, Math.ceil(text.length / 350) + 1);
      if (current.units && current.units + cost > pageCapacity) flush();
      current.textBlocks.push({
        ...block,
        sourceId: block.sourceId || block.id,
        chunkIndex: index,
        id: `${block.id}-part-${index + 1}`,
        title: index ? `${block.title} (continued)` : block.title,
        content: text,
      });
      current.units += cost;
      if (cost > pageCapacity) flush();
    });
  });

  (page.tableBlocks || []).forEach((table) => {
    const cost = Math.max(2, (table.rows || []).length + 1);
    if (current.units && current.units + cost > pageCapacity) flush();
    current.tableBlocks.push(table);
    current.units += cost;
  });

  if (current.fields.length || current.textBlocks.length || current.tableBlocks.length || !segments.length) flush();
  return segments;
}

function PatientField({ label, value }) {
  return <Typography className="lab-template-patient-line"><span>{label}</span><b>{value}</b></Typography>;
}

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

const isOutsideReferenceInterval = (result, referenceInterval) => {
  const match = String(referenceInterval || "").match(/^\s*(-?\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d+(?:\.\d+)?)\s*$/i);
  const numericResult = Number(result);
  if (!match || !Number.isFinite(numericResult)) return false;
  return numericResult < Number(match[1]) || numericResult > Number(match[2]);
};

const getColumnsGrid = (columns, editing) => {
  const widths = {
    parameter: "minmax(0, 2.3fr)",
    result: "minmax(132px, 1.2fr)",
    referenceInterval: "minmax(100px, 1.25fr)",
    unit: "minmax(58px, .8fr)",
    method: "minmax(90px, 1fr)",
  };
  return [...columns.map((column) => widths[column.key] || "minmax(0, 1fr)"), ...(editing ? ["30px"] : [])].join(" ");
};

const getFieldCell = (field, column) => column.key === "custom"
  ? field.cells?.[column.id] || ""
  : field[column.key] || "";

function ResultTable({ template, editing, onFieldChange, onRemoveField, onColumnLabelChange, onRemoveColumn }) {
  let currentSection = "";
  const columns = template.columns || DEFAULT_RESULT_COLUMNS;
  return (
    <>
      <Box className="lab-template-columns" sx={{ gridTemplateColumns: getColumnsGrid(columns, editing) }}>
        {columns.map((column, index) => (
          <Box className="lab-template-column-heading" key={column.id}>
            {editing
              ? <InlineInput ariaLabel={`Column ${index + 1} label`} value={column.label} onChange={(value) => onColumnLabelChange(column.id, value)} sx={{ fontWeight: 700, color: "#111", whiteSpace: "nowrap" }} />
              : <Typography>{column.label}</Typography>}
          </Box>
        ))}
      </Box>
      {template.fields.map((field) => {
        const showSection = field.section && field.section !== currentSection;
        currentSection = field.section || currentSection;
        return (
          <Box key={field.id}>
            {showSection ? (
              editing ? <InlineInput ariaLabel="Report section" value={field.section} onChange={(value) => onFieldChange(field.id, "section", value)} sx={{ maxWidth: 320, ml: 1, my: 0.5, fontWeight: 700 }} /> : <Typography className="lab-template-subsection">{field.section}</Typography>
            ) : null}
            <Box className={`lab-template-result-row${editing ? " lab-template-editing-row" : ""}`} sx={{ gridTemplateColumns: getColumnsGrid(columns, editing) }}>
              {columns.map((column) => {
                const value = getFieldCell(field, column);
                const outsideReference = column.key === "result" && isOutsideReferenceInterval(value, field.referenceInterval);
                const resultSx = column.key === "result" ? {
                  color: outsideReference ? template.outOfRangeColor : "inherit",
                  fontWeight: outsideReference ? 700 : 400,
                } : {};
                const valueKey = column.key === "custom" ? `column:${column.id}` : column.key;
                return (
                  <Box component="span" key={column.id} className={column.key === "result" ? "lab-template-result-cell" : undefined} sx={resultSx}>
                    {editing
                      ? <InlineInput ariaLabel={`${column.label} value`} value={value} onChange={(nextValue) => onFieldChange(field.id, valueKey, nextValue)} sx={resultSx} />
                      : column.key === "result" ? <b style={resultSx}>{value}</b> : value}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function CustomTableBlock({ table, editing, onTitleChange, onCellChange, onAddRow, onRemoveRow, onAddColumn, onRemoveColumn, onRemove }) {
  return (
    <Box className="lab-template-custom-table-wrap">
      {editing
        ? <InlineInput ariaLabel="Table name" value={table.title} onChange={onTitleChange} sx={{ maxWidth: 360, mb: 0.75, fontWeight: 700 }} />
        : table.title ? <Typography className="lab-template-custom-table-title">{table.title}</Typography> : null}
      <Box className="lab-template-custom-table">
        {(table.rows || []).map((row, rowIndex) => (
          <Box
            key={`${table.id}-row-${rowIndex}`}
            className={`lab-template-custom-table-row${rowIndex === 0 ? " lab-template-custom-table-header" : ""}`}
            sx={{ gridTemplateColumns: `repeat(${Math.max(1, row.length)}, minmax(0, 1fr))` }}
          >
            {row.map((value, columnIndex) => (
              <Box key={`${table.id}-cell-${rowIndex}-${columnIndex}`} className="lab-template-custom-table-cell">
                {editing
                  ? <InlineInput ariaLabel={`Table row ${rowIndex + 1} column ${columnIndex + 1}`} value={value} onChange={(nextValue) => onCellChange(rowIndex, columnIndex, nextValue)} sx={rowIndex === 0 ? { fontWeight: 700 } : {}} />
                  : value}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      {editing ? (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 0.75 }}>
          <Button startIcon={<AddOutlined />} size="small" onClick={onAddRow} sx={{ textTransform: "none" }}>Add row</Button>
          <Button startIcon={<DeleteOutline />} size="small" disabled={table.rows.length <= 1} onClick={onRemoveRow} sx={{ textTransform: "none" }}>Remove row</Button>
          <Button startIcon={<AddOutlined />} size="small" onClick={onAddColumn} sx={{ textTransform: "none" }}>Add column</Button>
          <Button startIcon={<DeleteOutline />} size="small" disabled={!table.rows[0] || table.rows[0].length <= 1} onClick={onRemoveColumn} sx={{ textTransform: "none" }}>Remove column</Button>
          <Button color="error" startIcon={<DeleteOutline />} size="small" onClick={onRemove} sx={{ textTransform: "none" }}>Remove table</Button>
        </Stack>
      ) : null}
    </Box>
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
  const [tableRows, setTableRows] = useState(2);
  const [tableColumns, setTableColumns] = useState(2);
  const [removeTemplateDialogOpen, setRemoveTemplateDialogOpen] = useState(false);
  const [selectingTemplateId, setSelectingTemplateId] = useState("");

  const templatePayload = (template, layout) => ({
    templateKey: template.id,
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
        const summaries = (response.data?.data || []).map((template) => normalizeTemplate({ ...template, id: template.templateKey || template.id }));
        const savedActiveId = localStorage.getItem(`${ACTIVE_TEMPLATE_PREFIX}:${labId}`);
        const selectedKey = summaries.some((template) => template.id === savedActiveId) ? savedActiveId : summaries[0]?.id || "";
        if (!mounted) return;
        setTemplates(summaries);
        setActiveId(selectedKey);
        if (!selectedKey) return;
        const detailResponse = await api.get(`/api/labs/templates/${encodeURIComponent(selectedKey)}`);
        const selected = normalizeTemplate({ ...detailResponse.data.data, id: detailResponse.data.data.templateKey || detailResponse.data.data.id });
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
      const response = await api.get(`/api/labs/templates/${encodeURIComponent(templateKey)}`);
      const selected = normalizeTemplate({ ...response.data.data, id: response.data.data.templateKey || response.data.data.id });
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
      await api.delete(`/api/labs/templates/${encodeURIComponent(activeTemplate.id)}`);
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

  const removeDraftColumn = (pageIndex, columnId) => setDraft((current) => ({
    ...current,
    pages: current.pages.map((page, index) => index !== pageIndex ? page : ({
      ...page,
      columns: page.columns.filter((column) => column.id !== columnId),
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
        : await api.patch(`/api/labs/templates/${encodeURIComponent(saved.id)}`, templatePayload(saved, draftCommon));
      const responseTemplate = response.data?.data;
      const persisted = normalizeTemplate({ ...responseTemplate, id: responseTemplate.templateKey || responseTemplate.id });
      setTemplates((current) => draftIsNew
        ? [persisted, ...current]
        : current.map((template) => template.id === persisted.id ? persisted : template));
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

  const removeDraftField = (pageIndex, fieldId) => {
    setDraft((current) => ({
      ...current,
      pages: current.pages.map((page, index) => index === pageIndex ? { ...page, fields: page.fields.filter((field) => field.id !== fieldId) } : page),
    }));
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
      setTableRows(2);
      setTableColumns(2);
      setTableDialogOpen(true);
    };

  const addTableBlock = () => {
      const rows = Math.min(30, Math.max(1, Number(tableRows) || 1));
      const columns = Math.min(15, Math.max(1, Number(tableColumns) || 1));
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
    paginateReportPage(page).map((contentPage, continuationIndex) => ({ page: contentPage, sourcePageIndex, continuationIndex }))
  ));

  const useTemplate = () => {
    if (!activeTemplate || !labId) return;
    localStorage.setItem(`${ACTIVE_TEMPLATE_PREFIX}:${labId}`, activeTemplate.id);
    setNotice(`${activeTemplate.name} selected for use on a test request.`);
  };

  return (
    <Box sx={{ display: "grid", gap: 2, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#172033" }}>Lab Report Templates</Typography>
          <Typography sx={{ mt: 0.4, fontSize: 12.5, color: "#64748B" }}>Each test template can have multiple pages. Shared header and footer repeat on every page.</Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
          {editing ? (
            <>
              <Button startIcon={<AddOutlined />} onClick={addReportPage} variant="outlined" sx={{ textTransform: "none" }}>Add page</Button>
              <Button startIcon={<CloseOutlined />} onClick={cancelEditing} variant="outlined" sx={{ textTransform: "none" }}>Cancel</Button>
              <Button startIcon={<SaveOutlined />} onClick={saveTemplate} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>Save template</Button>
            </>
          ) : (
            <>
              <Button startIcon={<AddOutlined />} onClick={createTemplate} disabled={loading || Boolean(error)} variant="outlined" sx={{ textTransform: "none" }}>New template</Button>
              <Button startIcon={<EditOutlined />} onClick={startEditing} disabled={!activeTemplate || activeTemplate.isOwner === false || loading || Boolean(error)} variant="outlined" sx={{ textTransform: "none" }}>Edit on page</Button>
              <Button color="error" startIcon={<DeleteOutline />} onClick={() => setRemoveTemplateDialogOpen(true)} disabled={!activeTemplate || activeTemplate.isOwner === false || loading || Boolean(error)} variant="outlined" sx={{ textTransform: "none" }}>Remove template</Button>
              <Button startIcon={<SaveOutlined />} onClick={useTemplate} disabled={!activeTemplate || loading || Boolean(error)} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>Use template</Button>
            </>
          )}
        </Stack>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert> : null}
      {loading ? <Typography color="text.secondary">Loading lab profile…</Typography> : null}

      {!loading && !error && activeTemplate ? (
        <>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
            {templates.map((template) => (
              <Button key={template.id} size="small" variant={activeId === template.id ? "contained" : "outlined"} onClick={() => selectTemplate(template.id)} disabled={editing || Boolean(selectingTemplateId)} sx={{ minWidth: "max-content", textTransform: "none" }}>
                {template.name}
              </Button>
            ))}
          </Stack>

          {editing ? (
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={1.5}>
              <Box sx={{ maxWidth: 420, flex: 1 }}><InlineInput ariaLabel="Template name" value={draft.name} onChange={(value) => updateDraft("name", value)} /></Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, py: 0.5, border: "1px solid #E2E8F0", borderRadius: 1 }}>
                <Typography sx={{ fontSize: 11.5, color: "#475467", whiteSpace: "nowrap" }}>Out-of-range color</Typography>
                <input aria-label="Template out-of-range color" type="color" value={draft.outOfRangeColor || "#c62828"} onChange={(event) => updateDraft("outOfRangeColor", event.target.value)} style={{ width: 34, height: 28, border: 0, padding: 0, background: "transparent", cursor: "pointer" }} />
              </Stack>
            </Stack>
          ) : null}
          <Box sx={{ width: "100%", overflowX: "auto", pb: 2 }}>
            {renderablePages.map(({ page, sourcePageIndex, continuationIndex }, renderIndex) => {
              const sourceTemplatePage = (editing ? draft.pages : activeTemplate.pages)[sourcePageIndex];
              const lastSegmentForSource = renderablePages[renderIndex + 1]?.sourcePageIndex !== sourcePageIndex;
              const canEditCommon = editing && renderIndex === 0;
              return (
                <Box key={`${sourceTemplatePage.id}-continuation-${continuationIndex}`} sx={{ mb: 3 }}>
                  {editing && continuationIndex === 0 && draft.pages.length > 1 ? (
                    <Button color="error" size="small" startIcon={<DeleteOutline />} onClick={() => removeReportPage(sourcePageIndex)} sx={{ mb: 0.75, textTransform: "none" }}>
                      Remove manual page {sourcePageIndex + 1}
                    </Button>
                  ) : null}
            <Paper className={`lab-template-page${editing ? " lab-template-editing-page" : ""}`} elevation={2}>
              <Box className="lab-template-top-rule" />
              <Box className="lab-template-brand">
                {canEditCommon ? <InlineInput ariaLabel="Common lab mark" value={draftCommon.brandMark} onChange={(value) => updateDraftCommon("brandMark", value)} sx={{ width: 44, height: 44, textAlign: "center", fontWeight: 800, color: "#12658a" }} /> : <Box className="lab-template-mark">{commonLayout.brandMark || "LAB"}</Box>}
                <Box sx={{ minWidth: 0 }}>
                  {canEditCommon ? <InlineInput ariaLabel="Common lab name" value={draftCommon.labName} onChange={(value) => updateDraftCommon("labName", value)} sx={{ fontSize: 23, fontWeight: 700, color: "#12658a", textAlign: "right" }} /> : <Typography className="lab-template-brand-name">{commonLayout.labName}</Typography>}
                  {canEditCommon ? <InlineInput ariaLabel="Common lab tagline" value={draftCommon.tagline} onChange={(value) => updateDraftCommon("tagline", value)} sx={{ fontSize: 9, fontWeight: 700, color: "#264958", textAlign: "right" }} /> : <Typography className="lab-template-brand-caption">{commonLayout.tagline}</Typography>}
                </Box>
              </Box>
              {(commonLayout.registrationNumber || commonLayout.phoneNumber || commonLayout.address) ? (
                <Box className="lab-template-contact">
                  {commonLayout.registrationNumber ? <span>Reg. No.: {commonLayout.registrationNumber}</span> : null}
                  {commonLayout.phoneNumber ? <span>Phone: {commonLayout.phoneNumber}</span> : null}
                  {commonLayout.address ? <span>{commonLayout.address}</span> : null}
                </Box>
              ) : null}
              <Box className="lab-template-title">{canEditCommon ? <InlineInput ariaLabel="Common report title" value={draftCommon.reportTitle} onChange={(value) => updateDraftCommon("reportTitle", value)} sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }} /> : commonLayout.reportTitle}</Box>
              <Box className="lab-template-patient-grid">
                <PatientField label="Name" value="Patient Name" />
                <PatientField label="Reg. No." value="LAB-ORDER-ID" />
                <PatientField label="Age & Sex" value="Age / Gender" />
                <PatientField label="Reg. Date" value="DD/MM/YYYY  HH:MM AM" />
                <PatientField label="Referred By" value="Doctor / Self" />
                <PatientField label="Collected On" value="DD/MM/YYYY  HH:MM AM" />
                <PatientField label="Client" value="Client / Walk-in" />
              </Box>
              <Box className="lab-template-panel-title">{editing && continuationIndex === 0 ? <InlineInput ariaLabel="Page section title" value={draft.pages[sourcePageIndex].panelTitle} onChange={(value) => updateDraftPage(sourcePageIndex, "panelTitle", value)} sx={{ fontWeight: 700, textAlign: "center" }} /> : `${page.panelTitle}${continuationIndex > 0 ? " (CONTINUED)" : ""}`}</Box>
              {editing && continuationIndex === 0 ? <InlineInput ariaLabel="Page sample type" value={draft.pages[sourcePageIndex].sampleType} onChange={(value) => updateDraftPage(sourcePageIndex, "sampleType", value)} sx={{ maxWidth: 260, mb: 1 }} /> : page.sampleType ? <Typography className="lab-template-sample-type"><b>Sample Type:</b> {page.sampleType}</Typography> : null}
              {editing && continuationIndex === 0 ? <InlineInput ariaLabel="Page instructions" value={draft.pages[sourcePageIndex].instructions} onChange={(value) => updateDraftPage(sourcePageIndex, "instructions", value)} multiline sx={{ mb: 1.5 }} /> : page.instructions ? <Typography className="lab-template-method-note">{page.instructions}</Typography> : null}
              {page.fields.length ? (
                <ResultTable
                  template={{ ...page, outOfRangeColor: editing ? draft.outOfRangeColor : activeTemplate.outOfRangeColor }}
                  editing={editing}
                  onFieldChange={(fieldId, key, value) => updateDraftField(sourcePageIndex, fieldId, key, value)}
                  onRemoveField={(fieldId) => removeDraftField(sourcePageIndex, fieldId)}
                  onColumnLabelChange={(columnId, label) => updateDraftColumnLabel(sourcePageIndex, columnId, label)}
                  onRemoveColumn={(columnId) => removeDraftColumn(sourcePageIndex, columnId)}
                />
              ) : null}
              {page.tableBlocks?.map((table) => (
                <CustomTableBlock
                  key={table.id}
                  table={table}
                  editing={editing}
                  onTitleChange={(title) => updateDraftTableTitle(sourcePageIndex, table.id, title)}
                  onCellChange={(rowIndex, columnIndex, value) => updateDraftTableCell(sourcePageIndex, table.id, rowIndex, columnIndex, value)}
                  onAddRow={() => addDraftTableRow(sourcePageIndex, table.id)}
                  onRemoveRow={() => removeDraftTableRow(sourcePageIndex, table.id)}
                  onAddColumn={() => addDraftTableColumn(sourcePageIndex, table.id)}
                  onRemoveColumn={() => removeDraftTableColumn(sourcePageIndex, table.id)}
                  onRemove={() => removeDraftTable(sourcePageIndex, table.id)}
                />
              ))}
              {page.textBlocks?.map((block) => (
                <Box key={block.id} className="lab-template-text-block">
                  {editing ? (
                    <>
                      <InlineInput ariaLabel="Text block heading" value={block.title} onChange={(value) => updateDraftTextBlock(sourcePageIndex, block.sourceId || block.id, "title", value)} sx={{ fontWeight: 700, mb: 0.5 }} />
                      <InlineInput ariaLabel="Text area content" value={block.content} onChange={(value) => updateDraftTextBlock(sourcePageIndex, block.sourceId || block.id, "content", value, block.chunkIndex ?? null)} multiline sx={{ minHeight: 70 }} />
                      <IconButton aria-label="Remove text area" size="small" onClick={() => removeDraftTextBlock(sourcePageIndex, block.sourceId || block.id)}><DeleteOutline fontSize="small" /></IconButton>
                    </>
                  ) : (
                    <><b>{block.title}</b><div>{block.content}</div></>
                  )}
                </Box>
              ))}
              {editing && lastSegmentForSource ? (
                <Stack direction="row" spacing={1} sx={{ alignSelf: "flex-start", mt: 1 }}>
                  <Button startIcon={<AddOutlined />} size="small" onClick={() => updateDraftPage(sourcePageIndex, "fields", [...draft.pages[sourcePageIndex].fields, newField()])} sx={{ textTransform: "none" }}>Add table row</Button>
                  <Button startIcon={<DeleteOutline />} size="small" disabled={draft.pages[sourcePageIndex].fields.length <= 1} onClick={() => removeLastDraftField(sourcePageIndex)} sx={{ textTransform: "none" }}>Remove table row</Button>
                  <Button startIcon={<AddOutlined />} size="small" onClick={() => addDraftColumn(sourcePageIndex)} sx={{ textTransform: "none" }}>Add column</Button>
                  <Button startIcon={<DeleteOutline />} size="small" disabled={draft.pages[sourcePageIndex].columns.length <= 1} onClick={() => removeLastDraftColumn(sourcePageIndex)} sx={{ textTransform: "none" }}>Remove column</Button>
                  <Button startIcon={<AddOutlined />} size="small" onClick={() => openTableDialog(sourcePageIndex)} sx={{ textTransform: "none" }}>Create table</Button>
                  <Button startIcon={<AddOutlined />} size="small" onClick={() => updateDraftPage(sourcePageIndex, "textBlocks", [...draft.pages[sourcePageIndex].textBlocks, newTextBlock()])} sx={{ textTransform: "none" }}>Add text area</Button>
                </Stack>
              ) : null}
              <Box className="lab-template-footer">
                {canEditCommon ? <InlineInput ariaLabel="Common report authentication footer" value={draftCommon.authenticationText} onChange={(value) => updateDraftCommon("authenticationText", value)} sx={{ fontSize: 10, textAlign: "center" }} /> : <Typography className="lab-template-auth-note">{commonLayout.authenticationText || "This is an electronically authenticated report."}</Typography>}
                <Box className="lab-template-approval">
                  <Typography><b>Approved On:</b> DD/MM/YYYY  HH:MM</Typography>
                  <Box className="lab-template-signature">Authorized Signatory</Box>
                  {canEditCommon ? <InlineInput ariaLabel="Common approver name" value={draftCommon.approvedBy} onChange={(value) => updateDraftCommon("approvedBy", value)} sx={{ fontSize: 10 }} /> : <Typography><b>Approved By:</b> {commonLayout.approvedBy}</Typography>}
                  {canEditCommon ? <InlineInput ariaLabel="Common approver qualification" value={draftCommon.qualification} onChange={(value) => updateDraftCommon("qualification", value)} sx={{ fontSize: 10 }} /> : <Typography>{commonLayout.qualification}</Typography>}
                </Box>
                <Typography className="lab-template-page-number">Page {renderIndex + 1} of {renderablePages.length}</Typography>
              </Box>
            </Paper>
                </Box>
              );
            })}
          </Box>
        </>
      ) : null}

      {!loading && !error && !renderablePages.length ? <Alert severity="warning">No report layout is available for this template yet.</Alert> : null}

      {saveError ? <Alert severity="error" onClose={() => setSaveError("")}>{saveError}</Alert> : null}

      <Dialog open={tableDialogOpen} onClose={() => setTableDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create table</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5, color: "#475467", fontSize: 13 }}>Enter the number of rows and columns for your table.</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1 }}>
            <TextField label="Rows" type="number" size="small" value={tableRows} onChange={(event) => setTableRows(event.target.value)} inputProps={{ min: 1, max: 30 }} fullWidth />
            <TextField label="Columns" type="number" size="small" value={tableColumns} onChange={(event) => setTableColumns(event.target.value)} inputProps={{ min: 1, max: 15 }} fullWidth />
          </Stack>
          <Typography sx={{ mt: 1, fontSize: 12, color: "#667085" }}>{tableRows} rows x {tableColumns} columns. You can resize the table after inserting it.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button onClick={addTableBlock} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>Insert table</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={removeTemplateDialogOpen} onClose={() => setRemoveTemplateDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DeleteOutline sx={{ color: "#B42318" }} />
          Remove template?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#475467" }}>
            Are you sure you want to remove <b>{activeTemplate?.name}</b> template? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveTemplateDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button onClick={confirmRemoveTemplate} color="error" variant="contained" startIcon={<DeleteOutline />} sx={{ textTransform: "none" }}>Remove template</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")}><Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>

      <style jsx global>{`
        .lab-template-page{position:relative;display:flex;flex-direction:column;width:100%;max-width:900px;min-width:680px;min-height:1120px;margin:0 auto;padding:20px 42px 74px;overflow:visible;color:#171717;background:#fff;font-family:Georgia,'Times New Roman',serif;box-sizing:border-box}
        .lab-template-top-rule{height:7px;margin:-20px -42px 20px;background:linear-gradient(90deg,#087c70 0 18%,#20a898 18% 100%)}
        .lab-template-brand{display:flex;justify-content:flex-end;align-items:center;gap:10px;min-height:74px;color:#12658a}
        .lab-template-mark{display:grid;place-items:center;width:44px;height:44px;border:2px solid #12658a;border-radius:50%;font-family:Arial,sans-serif;font-size:14px;font-weight:800}
        .lab-template-brand-name{color:#12658a;font:700 23px/1 Arial,sans-serif;letter-spacing:.2px;white-space:nowrap}
        .lab-template-brand-caption{margin-top:4px;color:#264958;font:700 9px/1.2 Arial,sans-serif;text-align:right;letter-spacing:.6px}
        .lab-template-contact{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:4px 14px;margin-top:4px;color:#264958;font:10px/1.35 Arial,sans-serif;text-align:right}
        .lab-template-title{margin-top:20px;padding:8px 0;border-top:2px solid #303030;border-bottom:2px solid #303030;text-align:center;font-size:20px;font-weight:700}
        .lab-template-patient-grid{display:grid;grid-template-columns:1.3fr 1fr;column-gap:30px;row-gap:9px;padding:16px 0 22px}
        .lab-template-patient-line{display:grid;grid-template-columns:105px 12px minmax(0,1fr);gap:5px;color:#202020;font:14px/1.35 Georgia,'Times New Roman',serif}
        .lab-template-patient-line:before{content:':';grid-column:2;grid-row:1}.lab-template-patient-line span{grid-column:1}.lab-template-patient-line b{grid-column:3;font-weight:600}
        .lab-template-panel-title{display:grid;place-items:center;min-height:35px;margin:0 -10px 7px;border-radius:20px;background:#c7c7c7;color:#111;font-size:15px;font-weight:700;text-align:center}
        .lab-template-columns,.lab-template-result-row{display:grid;column-gap:12px;align-items:center}
        .lab-template-columns{margin:0 0 5px}.lab-template-columns>*{display:flex;align-items:center;min-width:0;min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;color:#111;font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden}.lab-template-columns .MuiTextField-root{min-width:0;flex:1}.lab-template-columns .MuiIconButton-root{flex-shrink:0}
        .lab-template-result-row{min-height:27px;padding:0 9px;font-size:12.7px;line-height:1.25}.lab-template-result-row>*{min-width:0;overflow-wrap:anywhere}.lab-template-result-blank{display:block;min-height:14px;border-bottom:1px dotted #a9a9a9}.lab-template-result-cell{display:grid;gap:2px}.lab-template-result-controls{min-width:124px;white-space:nowrap}.lab-template-result-controls .MuiFormControlLabel-root{margin:0 1px 0 0;gap:0}.lab-template-result-controls .MuiCheckbox-root{padding:0 1px}.lab-template-result-controls .MuiFormControlLabel-label{font:8px Arial,sans-serif}.lab-template-result-controls input[type=color]{width:24px;height:20px;padding:0;border:0;background:transparent}.lab-template-editing-row{position:relative;min-height:36px}.lab-template-editing-row .MuiInput-underline:before{border-bottom-color:#AAB7C4}.lab-template-text-block{margin:14px 9px;padding:8px 0;border-top:1px solid #777;font-size:12px;line-height:1.45}.lab-template-text-block>div{min-height:22px;white-space:pre-wrap}
        .lab-template-custom-table-wrap{margin:16px 9px;overflow-x:auto}.lab-template-custom-table{display:grid;gap:0;font-size:12px;min-width:520px}.lab-template-custom-table-row{display:grid;column-gap:12px;align-items:center;min-height:27px;padding:0 9px;line-height:1.25}.lab-template-custom-table-header{margin-bottom:5px}.lab-template-custom-table-header .lab-template-custom-table-cell{min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;color:#111;font-weight:700;white-space:nowrap;overflow:hidden}.lab-template-custom-table-cell{min-width:0;overflow-wrap:anywhere}.lab-template-custom-table-cell .MuiInputBase-root{font:inherit}
        .lab-template-sample-type{margin:0 0 9px;font-size:13px}.lab-template-method-note{margin:0 0 18px;font:700 13px/1.55 Georgia,'Times New Roman',serif}.lab-template-subsection{margin:10px 9px 4px;font-size:12px;font-weight:700}
        .lab-template-footer{position:static;display:grid;grid-template-columns:1fr 1.25fr;gap:8px 18px;align-items:end;margin-top:auto;padding-top:9px;border-top:2px solid #303030;font-family:Georgia,'Times New Roman',serif;flex-shrink:0}
        .lab-template-auth-note{font-size:10px;text-align:center}.lab-template-approval{display:grid;gap:5px;font-size:10px}.lab-template-signature{height:24px;color:#737373;font-style:italic;text-align:right}.lab-template-page-number{grid-column:2;margin-top:15px;font-size:10px;text-align:right}
        @media(max-width:700px){.lab-template-page{padding-right:24px;padding-left:24px}.lab-template-top-rule{margin-right:-24px;margin-left:-24px}.lab-template-patient-grid{column-gap:14px}.lab-template-patient-line{grid-template-columns:82px 8px minmax(0,1fr);font-size:11px}}
        @media print{body *{visibility:hidden!important}.lab-template-page,.lab-template-page *{visibility:visible!important}.lab-template-page{position:relative!important;top:auto!important;left:auto!important;width:210mm;height:297mm;min-height:297mm;max-width:none;min-width:0;margin:0;overflow:hidden;box-shadow:none;break-after:page;page-break-after:always}.lab-template-page:last-child{break-after:auto;page-break-after:auto}}
      `}</style>
    </Box>
  );
}