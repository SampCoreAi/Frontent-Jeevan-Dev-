"use client";

import { AddOutlined, DeleteOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

export const DEFAULT_RESULT_COLUMNS = [
  { id: "parameter", label: "Parameter", key: "parameter" },
  { id: "result", label: "Result", key: "result" },
  { id: "referenceInterval", label: "Bio. Ref. Interval", key: "referenceInterval" },
  { id: "unit", label: "Units", key: "unit" },
  { id: "method", label: "Method", key: "method" },
];

export const createReportField = () => ({ id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, section: "", parameter: "", referenceInterval: "", result: "", highlightOutsideRange: true, boldOutsideRange: true, cells: {}, unit: "", method: "" });
export const createReportTextBlock = (type = "text") => ({ id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, title: type === "label" ? "Label" : "Notes", content: type === "label" ? "New label" : "" });
export const createReportColumn = () => ({ id: `column-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: "New column", key: "custom" });
export const createReportTable = (rows, columns) => ({
  id: `table-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "New table",
  rows: Array.from({ length: rows }, (_, rowIndex) => Array.from({ length: columns }, (_, columnIndex) => rowIndex === 0 ? `Header ${columnIndex + 1}` : "")),
});
export const createReportPage = (pageNumber) => ({
  id: `page-${Date.now()}-${pageNumber}`,
  panelTitle: pageNumber > 1 ? "CONTINUED" : "NEW TEST SECTION",
  sampleType: "",
  instructions: "",
  textBlocks: [],
  tableBlocks: [],
  columns: DEFAULT_RESULT_COLUMNS.map((column) => ({ ...column })),
  fields: [createReportField()],
});

export const paginateReportPage = (page, maxBodyUnits = 20) => {
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
    for (let offset = 0; offset < content.length; offset += 700) chunks.push(content.slice(offset, offset + 700));
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
    const rows = table.rows || [];
    let rowOffset = 0;
    let partIndex = 0;
    do {
      if (current.units >= pageCapacity - 1) flush();
      const availableRows = Math.max(1, pageCapacity - current.units - 1);
      const rowCount = Math.min(rows.length - rowOffset, availableRows);
      const continuation = partIndex > 0;
      current.tableBlocks.push({
        ...table,
        sourceId: table.sourceId || table.id,
        id: `${table.id}-part-${partIndex + 1}`,
        rowOffset,
        totalRows: rows.length,
        continuationIndex: partIndex,
        title: continuation ? `${table.title} (continued)` : table.title,
        rows: rows.slice(rowOffset, rowOffset + rowCount),
      });
      current.units += rowCount + 1;
      rowOffset += rowCount;
      partIndex += 1;
      if (rowOffset < rows.length) flush();
    } while (rowOffset < rows.length);
  });

  if (current.fields.length || current.textBlocks.length || current.tableBlocks.length || !segments.length) flush();
  return segments;
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

const isOutsideReferenceInterval = (result, referenceInterval) => {
  const match = String(referenceInterval || "").match(/^\s*(-?\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d+(?:\.\d+)?)\s*$/i);
  const numericResult = Number(result);
  if (!match || !Number.isFinite(numericResult)) return false;
  return numericResult < Number(match[1]) || numericResult > Number(match[2]);
};

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

function PatientField({ label, value }) {
  return <Typography className="lab-template-patient-line"><span>{label}</span><b>{value}</b></Typography>;
}

export function LabReportEditActions({
  onAddRow,
  onRemoveRow,
  canRemoveRow,
  onAddColumn,
  onRemoveColumn,
  canRemoveColumn,
  onCreateTable,
  onAddTextArea,
}) {
  return (
    <Stack data-html2canvas-ignore="true" direction="row" spacing={1} flexWrap="wrap" sx={{ alignSelf: "flex-start", mt: 1, mb: 1 }}>
      <Button startIcon={<AddOutlined />} size="small" onClick={onAddRow} sx={{ textTransform: "none" }}>Add table row</Button>
      <Button startIcon={<DeleteOutline />} size="small" disabled={!canRemoveRow} onClick={onRemoveRow} sx={{ textTransform: "none" }}>Remove table row</Button>
      <Button startIcon={<AddOutlined />} size="small" onClick={onAddColumn} sx={{ textTransform: "none" }}>Add column</Button>
      <Button startIcon={<DeleteOutline />} size="small" disabled={!canRemoveColumn} onClick={onRemoveColumn} sx={{ textTransform: "none" }}>Remove column</Button>
      <Button startIcon={<AddOutlined />} size="small" onClick={onCreateTable} sx={{ textTransform: "none" }}>Create table</Button>
      <Button startIcon={<AddOutlined />} size="small" onClick={onAddTextArea} sx={{ textTransform: "none" }}>Add text area</Button>
    </Stack>
  );
}

export function CreateTableDialog({ open, onClose, onInsert }) {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    if (open) {
      setRows(2);
      setColumns(2);
    }
  }, [open]);

  const insertTable = () => onInsert(
    Math.min(30, Math.max(1, Number(rows) || 1)),
    Math.min(15, Math.max(1, Number(columns) || 1)),
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create table</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1.5, color: "#475467", fontSize: 13 }}>Enter the number of rows and columns for your table.</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1 }}>
          <TextField label="Rows" type="number" size="small" value={rows} onChange={(event) => setRows(event.target.value)} inputProps={{ min: 1, max: 30 }} fullWidth />
          <TextField label="Columns" type="number" size="small" value={columns} onChange={(event) => setColumns(event.target.value)} inputProps={{ min: 1, max: 15 }} fullWidth />
        </Stack>
        <Typography sx={{ mt: 1, fontSize: 12, color: "#667085" }}>{rows} rows x {columns} columns. You can resize the table after inserting it.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button onClick={insertTable} variant="contained" sx={{ textTransform: "none", bgcolor: "#07876A" }}>Insert table</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LabReportPage({
  page,
  commonLayout = {},
  brandLogo = "",
  showLabLogo = false,
  patientFields = [],
  pageNumber = 1,
  pageCount = 1,
  continuationIndex = 0,
  lastPage = false,
  approvedOn = "",
  templateEditing = false,
  editCommon = false,
  editPageDetails = false,
  pdfMode = false,
  entryMode = false,
  resultValues = {},
  outOfRangeColor = "#c62828",
  qrDataUrl = "",
  qrImageRef,
  onCommonChange = () => {},
  onPageChange = () => {},
  onFieldChange = () => {},
  onColumnLabelChange = () => {},
  onResultChange = () => {},
  onTableTitleChange = () => {},
  onTableCellChange = () => {},
  onAddTableRow = () => {},
  onRemoveTableRow = () => {},
  onAddTableColumn = () => {},
  onRemoveTableColumn = () => {},
  onRemoveTable = () => {},
  onTextBlockChange = () => {},
  onRemoveTextBlock = () => {},
  actions = null,
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  useEffect(() => setLogoFailed(false), [brandLogo]);
  const isTemplateEditing = templateEditing && !pdfMode;
  const isCommonEditing = editCommon && !pdfMode;
  const isPageDetailEditing = editPageDetails && !pdfMode;
  const approvedOnLabel = approvedOn
    ? new Date(approvedOn).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).replace(",", "")
    : "DD/MM/YYYY  HH:MM";
  let currentSection = "";
  const columns = page.columns || (page.columnLabels || DEFAULT_RESULT_COLUMNS.map((column) => column.label)).map((label, index) => ({
    ...(DEFAULT_RESULT_COLUMNS[index] || { id: `custom-${index}`, key: "custom" }),
    label: typeof label === "string" ? label : label.label,
  }));

  return (
    <Paper className={`lab-template-page${isTemplateEditing ? " lab-template-editing-page" : ""}${lastPage ? " lab-template-last-page" : ""}`} elevation={2}>
      <Box className="lab-template-top-rule" />
      <Box className="lab-template-brand">
        {isCommonEditing
          ? <InlineInput ariaLabel="Common lab mark" value={commonLayout.brandMark} onChange={(value) => onCommonChange("brandMark", value)} sx={{ width: 44, height: 44, textAlign: "center", fontWeight: 800, color: "#12658a" }} />
          : showLabLogo
            ? brandLogo && !logoFailed
              ? <Box component="img" className="lab-template-mark-image" src={brandLogo} alt={`${commonLayout.labName || "Lab"} logo`} onError={() => setLogoFailed(true)} />
              : <Box className="lab-template-mark"><ScienceOutlinedIcon sx={{ fontSize: 25 }} /></Box>
            : <Box className="lab-template-mark">{commonLayout.brandMark || "LAB"}</Box>}
        <Box sx={{ minWidth: 0 }}>
          {isCommonEditing
            ? <InlineInput ariaLabel="Common lab name" value={commonLayout.labName} onChange={(value) => onCommonChange("labName", value)} sx={{ fontSize: 23, fontWeight: 700, color: "#12658a", textAlign: "right" }} />
            : <Typography className="lab-template-brand-name">{commonLayout.labName || "YOUR LAB NAME"}</Typography>}
          {isCommonEditing
            ? <InlineInput ariaLabel="Common lab tagline" value={commonLayout.tagline} onChange={(value) => onCommonChange("tagline", value)} sx={{ fontSize: 9, fontWeight: 700, color: "#264958", textAlign: "right" }} />
            : <Typography className="lab-template-brand-caption">{commonLayout.tagline || "ACCURATE & AFFORDABLE ALWAYS"}</Typography>}
        </Box>
      </Box>
      {(commonLayout.registrationNumber || commonLayout.phoneNumber || commonLayout.address) ? (
        <Box className="lab-template-contact">
          {commonLayout.registrationNumber ? <span>Reg. No.: {commonLayout.registrationNumber}</span> : null}
          {commonLayout.phoneNumber ? <span>Phone: {commonLayout.phoneNumber}</span> : null}
          {commonLayout.address ? <span>{commonLayout.address}</span> : null}
        </Box>
      ) : null}
      <Box className="lab-template-title">
        {isCommonEditing
          ? <InlineInput ariaLabel="Common report title" value={commonLayout.reportTitle} onChange={(value) => onCommonChange("reportTitle", value)} sx={{ fontSize: 20, fontWeight: 700, textAlign: "center" }} />
          : commonLayout.reportTitle || "TEST REPORT"}
      </Box>
      <Box className="lab-template-patient-grid">
        {patientFields.map((field) => <PatientField key={field.label} label={field.label} value={field.value} />)}
      </Box>
      <Box className="lab-template-panel-title">
        {isPageDetailEditing
          ? <InlineInput ariaLabel="Page section title" value={page.panelTitle} onChange={(value) => onPageChange("panelTitle", value)} sx={{ fontWeight: 700, textAlign: "center" }} />
          : `${page.panelTitle || ""}${continuationIndex > 0 ? " (CONTINUED)" : ""}`}
      </Box>
      {isPageDetailEditing
        ? <InlineInput ariaLabel="Page sample type" value={page.sampleType} onChange={(value) => onPageChange("sampleType", value)} sx={{ maxWidth: 260, mb: 1 }} />
        : page.sampleType ? <Typography className="lab-template-sample-type"><b>Sample Type:</b> {page.sampleType}</Typography> : null}
      {isPageDetailEditing
        ? <InlineInput ariaLabel="Page instructions" value={page.instructions} onChange={(value) => onPageChange("instructions", value)} multiline sx={{ mb: 1.5 }} />
        : page.instructions ? <Typography className="lab-template-method-note">{page.instructions}</Typography> : null}

      {page.fields?.length ? (
        <>
          <Box className="lab-template-columns" sx={{ gridTemplateColumns: getColumnsGrid(columns, isTemplateEditing) }}>
                  {columns.map((column, index) => (
              <Box className="lab-template-column-heading" key={column.id}>
                {isTemplateEditing
                  ? <InlineInput ariaLabel={`Column ${index + 1} label`} value={column.label} onChange={(value) => onColumnLabelChange(column.id, value)} sx={{ fontWeight: 700, color: "#111", whiteSpace: "nowrap" }} />
                  : column.label}
              </Box>
            ))}
          </Box>
          {page.fields.map((field) => {
            const showSection = field.section && field.section !== currentSection;
            currentSection = field.section || currentSection;
            return (
              <Box key={field.id}>
                {showSection ? isTemplateEditing
                  ? <InlineInput ariaLabel="Report section" value={field.section} onChange={(value) => onFieldChange(field.id, "section", value)} sx={{ maxWidth: 320, ml: 1, my: 0.5, fontWeight: 700 }} />
                  : <Typography className="lab-template-subsection">{field.section}</Typography>
                  : null}
                <Box className={`lab-template-result-row${isTemplateEditing ? " lab-template-editing-row" : ""}`} sx={{ gridTemplateColumns: getColumnsGrid(columns, isTemplateEditing) }}>
                  {columns.map((column) => {
                    const value = getFieldCell(field, column);
                    const isResult = column.key === "result";
                    const result = entryMode ? resultValues[field.id] ?? value : value;
                    const outsideReference = isResult && isOutsideReferenceInterval(result, field.referenceInterval);
                    const resultSx = isResult ? {
                      color: outsideReference ? outOfRangeColor : "inherit",
                      fontWeight: outsideReference ? 700 : 400,
                    } : {};
                    const valueKey = column.key === "custom" ? `column:${column.id}` : column.key;
                    return (
                      <Box component="span" key={column.id} className={isResult ? "lab-template-result-cell" : undefined} sx={resultSx}>
                        {entryMode && isResult && !pdfMode
                          ? <TextField fullWidth size="small" variant="standard" value={result} onChange={(event) => onResultChange(field.id, event.target.value)} placeholder="Result" sx={resultSx} />
                          : isTemplateEditing
                            ? <InlineInput ariaLabel={`${column.label} value`} value={value} onChange={(nextValue) => onFieldChange(field.id, valueKey, nextValue)} sx={resultSx} />
                            : isResult ? <b style={resultSx}>{result}</b> : value}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </>
      ) : null}

      {page.tableBlocks?.map((table) => (
        <Box key={table.id} className="lab-template-custom-table-wrap">
          {isTemplateEditing && table.continuationIndex === 0
            ? <InlineInput ariaLabel="Table name" value={table.title} onChange={(title) => onTableTitleChange(table.sourceId || table.id, title)} sx={{ maxWidth: 360, mb: 0.75, fontWeight: 700 }} />
            : table.title ? <Typography className="lab-template-custom-table-title">{table.title}</Typography> : null}
          <Box className="lab-template-custom-table">
            {(table.rows || []).map((row, rowIndex) => (
              <Box key={`${table.id}-row-${rowIndex}`} className={`lab-template-custom-table-row${table.rowOffset === 0 && rowIndex === 0 ? " lab-template-custom-table-header" : ""}`} sx={{ gridTemplateColumns: `repeat(${Math.max(1, row.length)}, minmax(0, 1fr))` }}>
                {row.map((value, columnIndex) => (
                  <Box key={`${table.id}-cell-${rowIndex}-${columnIndex}`} className="lab-template-custom-table-cell">
                    {isTemplateEditing
                      ? <InlineInput ariaLabel={`Table row ${table.rowOffset + rowIndex + 1} column ${columnIndex + 1}`} value={value} onChange={(nextValue) => onTableCellChange(table.sourceId || table.id, table.rowOffset + rowIndex, columnIndex, nextValue)} sx={table.rowOffset === 0 && rowIndex === 0 ? { fontWeight: 700 } : {}} />
                      : value}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          {isTemplateEditing ? (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 0.75 }}>
              <Button startIcon={<AddOutlined />} size="small" onClick={() => onAddTableRow(table.sourceId || table.id)} sx={{ textTransform: "none" }}>Add row</Button>
              <Button startIcon={<DeleteOutline />} size="small" disabled={table.totalRows <= 1} onClick={() => onRemoveTableRow(table.sourceId || table.id)} sx={{ textTransform: "none" }}>Remove row</Button>
              <Button startIcon={<AddOutlined />} size="small" onClick={() => onAddTableColumn(table.sourceId || table.id)} sx={{ textTransform: "none" }}>Add column</Button>
              <Button startIcon={<DeleteOutline />} size="small" disabled={!table.rows[0] || table.rows[0].length <= 1} onClick={() => onRemoveTableColumn(table.sourceId || table.id)} sx={{ textTransform: "none" }}>Remove column</Button>
              <Button color="error" startIcon={<DeleteOutline />} size="small" onClick={() => onRemoveTable(table.sourceId || table.id)} sx={{ textTransform: "none" }}>Remove table</Button>
            </Stack>
          ) : null}
        </Box>
      ))}

      {page.textBlocks?.map((block) => (
        <Box key={block.id} className="lab-template-text-block">
          {isTemplateEditing ? (
            <>
              <InlineInput ariaLabel="Text block heading" value={block.title} onChange={(value) => onTextBlockChange(block.sourceId || block.id, "title", value)} sx={{ fontWeight: 700, mb: 0.5 }} />
              <InlineInput ariaLabel="Text area content" value={block.content} onChange={(value) => onTextBlockChange(block.sourceId || block.id, "content", value, block.chunkIndex ?? null)} multiline sx={{ minHeight: 70 }} />
              <IconButton aria-label="Remove text area" size="small" onClick={() => onRemoveTextBlock(block.sourceId || block.id)}><DeleteOutline fontSize="small" /></IconButton>
            </>
          ) : (
            <><b>{block.title}</b><div>{block.content}</div></>
          )}
        </Box>
      ))}

      {pdfMode ? null : actions}
      <Box className="lab-template-footer">
        <Box className="lab-template-authenticated">
          {isCommonEditing
            ? <InlineInput ariaLabel="Common report authentication footer" value={commonLayout.authenticationText} onChange={(value) => onCommonChange("authenticationText", value)} sx={{ fontSize: 10, textAlign: "center" }} />
            : <Typography className="lab-template-auth-note">{commonLayout.authenticationText || "This is an electronically authenticated report."}</Typography>}
          {qrDataUrl ? <img ref={qrImageRef} src={qrDataUrl} alt="Report verification QR code" width="104" height="104" /> : null}
        </Box>
        <Box className="lab-template-approval">
          <Typography><b>Approved On:</b> {approvedOnLabel}</Typography>
          <Box className="lab-template-signature">Authorized Signatory</Box>
          {isCommonEditing
            ? <InlineInput ariaLabel="Common approver name" value={commonLayout.approvedBy} onChange={(value) => onCommonChange("approvedBy", value)} sx={{ fontSize: 10 }} />
            : <Typography><b>Approved By:</b> {commonLayout.approvedBy || "Lab Pathologist"}</Typography>}
          {isCommonEditing
            ? <InlineInput ariaLabel="Common approver qualification" value={commonLayout.qualification} onChange={(value) => onCommonChange("qualification", value)} sx={{ fontSize: 10 }} />
            : <Typography>{commonLayout.qualification || "Qualification / Registration No."}</Typography>}
        </Box>
        <Typography className="lab-template-page-number">Page {pageNumber} of {pageCount}</Typography>
      </Box>
      <style jsx global>{`
        .lab-template-page{position:relative;display:flex;flex-direction:column;width:210mm;height:297mm;max-width:none;min-width:0;min-height:297mm;flex-shrink:0;margin:0 auto;padding:20px 42px 150px;overflow:hidden;color:#171717;background:#fff;font-family:Georgia,'Times New Roman',serif;box-sizing:border-box;break-after:auto;page-break-after:auto}
        .lab-report-page-wrap:not(:first-child){break-before:page;page-break-before:always}
        .lab-report-page-wrap{margin-bottom:16px}.lab-report-page-wrap:last-child{margin-bottom:0}
        .lab-template-top-rule{flex:0 0 7px;height:7px;margin:-20px -42px 20px;background:linear-gradient(90deg,#087c70 0 18%,#20a898 18% 100%)}
        .lab-template-brand{display:flex;justify-content:flex-end;align-items:center;gap:10px;min-height:74px;color:#12658a}
        .lab-template-mark{display:grid;place-items:center;width:44px;height:44px;border:2px solid #12658a;border-radius:50%;font-family:Arial,sans-serif;font-size:14px;font-weight:800}.lab-template-mark-image{width:44px;height:44px;object-fit:contain;border-radius:50%}
        .lab-template-brand-name{color:#12658a;font:700 23px/1 Arial,sans-serif;white-space:nowrap}
        .lab-template-brand-caption{margin-top:4px;color:#264958;font:700 9px/1.2 Arial,sans-serif;text-align:right}
        .lab-template-contact{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:4px 14px;margin-top:4px;color:#264958;font:10px/1.35 Arial,sans-serif;text-align:right}
        .lab-template-title{margin-top:20px;padding:8px 0;border-top:2px solid #303030;border-bottom:2px solid #303030;text-align:center;font-size:20px;font-weight:700}
        .lab-template-patient-grid{display:grid;grid-template-columns:1.3fr 1fr;column-gap:30px;row-gap:9px;padding:16px 0 22px}
        .lab-template-patient-line{display:grid;grid-template-columns:105px 12px minmax(0,1fr);gap:5px;color:#202020;font:14px/1.35 Georgia,'Times New Roman',serif}
        .lab-template-patient-line:before{content:':';grid-column:2;grid-row:1}.lab-template-patient-line span{grid-column:1}.lab-template-patient-line b{grid-column:3;font-weight:600}
        .lab-template-panel-title{display:grid;place-items:center;min-height:35px;margin:0 -10px 7px;border-radius:20px;background:#c7c7c7;color:#111;font-size:15px;font-weight:700;text-align:center}
        .lab-template-columns,.lab-template-result-row{display:grid;column-gap:12px;align-items:center}
        .lab-template-columns{margin:0 0 5px}.lab-template-columns>*{display:flex;align-items:center;min-width:0;min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;color:#111;font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden}.lab-template-columns .MuiTextField-root{min-width:0;flex:1}.lab-template-columns .MuiIconButton-root{flex-shrink:0}
        .lab-template-result-row{min-height:27px;padding:0 9px;font-size:12.7px;line-height:1.25}.lab-template-result-row>*{min-width:0;overflow-wrap:anywhere}.lab-template-result-cell{display:grid;gap:2px}.lab-template-result-controls{min-width:30px;text-align:right}.lab-template-editing-row{position:relative;min-height:36px}.lab-template-editing-row .MuiInput-underline:before{border-bottom-color:#AAB7C4}
        .lab-template-text-block{margin:14px 9px;padding:8px 0;border-top:1px solid #777;font-size:12px;line-height:1.45}.lab-template-text-block>div{min-height:22px;white-space:pre-wrap}
        .lab-template-custom-table-wrap{margin:16px 9px;overflow-x:auto}.lab-template-custom-table{display:grid;gap:0;font-size:12px;min-width:520px}.lab-template-custom-table-row{display:grid;column-gap:12px;align-items:center;min-height:27px;padding:0 9px;line-height:1.25}.lab-template-custom-table-header{margin-bottom:5px}.lab-template-custom-table-header .lab-template-custom-table-cell{min-height:29px;padding:4px 9px;border-radius:18px;background:#c7c7c7;color:#111;font-weight:700;white-space:nowrap;overflow:hidden}.lab-template-custom-table-cell{min-width:0;overflow-wrap:anywhere}.lab-template-custom-table-cell .MuiInputBase-root{font:inherit}
        .lab-template-sample-type{margin:0 0 9px;font-size:13px}.lab-template-method-note{margin:0 0 18px;font:700 13px/1.55 Georgia,'Times New Roman',serif}.lab-template-subsection{margin:10px 9px 4px;font-size:12px;font-weight:700}
        .lab-template-footer{position:absolute;left:42px;right:42px;bottom:20px;display:grid;grid-template-columns:1fr 1.25fr;gap:8px 18px;align-items:end;padding-top:9px;border-top:2px solid #303030;font-family:Georgia,'Times New Roman',serif}.lab-template-authenticated{display:grid;justify-items:center;gap:6px}
        .lab-template-auth-note{font-size:10px;text-align:center}.lab-template-approval{display:grid;gap:5px;font-size:10px}.lab-template-signature{height:24px;color:#737373;font-style:italic;text-align:right}.lab-template-page-number{grid-column:2;margin-top:15px;font-size:10px;text-align:right}
        @media(max-width:700px){.lab-template-page{padding-right:24px;padding-left:24px}.lab-template-top-rule{margin-right:-24px;margin-left:-24px}.lab-template-footer{right:24px;left:24px}.lab-template-patient-grid{column-gap:14px}.lab-template-patient-line{grid-template-columns:82px 8px minmax(0,1fr);font-size:11px}}
        @media print{body *{visibility:hidden!important}.lab-template-page,.lab-template-page *{visibility:visible!important}.lab-template-page{position:relative!important;top:auto!important;left:auto!important;width:210mm;height:297mm;min-height:297mm;max-width:none;min-width:0;margin:0;overflow:hidden;box-shadow:none;break-after:auto;page-break-after:auto}.lab-report-page-wrap:not(:first-child){break-before:page;page-break-before:always}.lab-report-page-wrap{margin-bottom:0}}
      `}</style>
    </Paper>
  );
}