import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

/* =========================================================
   PATIENT INFORMATION
========================================================= */

export function PatientInfo({ patient, dateNow, isDownloading }) {
  const labelStyle = {
    fontWeight: 600,
    color: "text.secondary",
    fontSize: "inherit",
    mr: "4px",
  };

  const valueStyle = {
    fontWeight: 600,
    color: "text.primary",
    fontSize: "inherit",
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        overflow: "hidden",
        mb: 1.5,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: { xs: 1.2, sm: 1.5 },
          py: 0.65,
          bgcolor: "secondary.light",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "primary.main",
            lineHeight: 1.4,
          }}
        >
          Patient Information
        </Typography>
      </Box>

      {/* PATIENT DETAILS */}
      <Table
        size="small"
        sx={{
          width: "100%",
          tableLayout: "fixed",

          "& .MuiTableCell-root": {
            px: {
              xs: isDownloading ? 1.5 : 1,
              sm: 1.5,
            },

            py: {
              xs: 0.75,
              sm: 0.8,
            },

            fontSize: "14px",
            verticalAlign: "middle",

            borderBottom: "1px solid",
            borderColor: "divider",

            color: "text.primary",
            lineHeight: 1.4,
          },

          "& tr:last-child td": {
            borderBottom: "none",
          },
        }}
      >
        <TableBody>
          {/* ROW 1 */}
          <TableRow>
            {/* NAME */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Patient Name:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {patient?.name || "—"}
                </Box>
              </Box>
            </TableCell>

            {/* AGE */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Age:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {patient?.age || "—"}
                </Box>
              </Box>
            </TableCell>

            {/* DATE DESKTOP */}
            <TableCell
              sx={{
                display: {
                  xs: isDownloading ? "table-cell" : "none",
                  sm: "table-cell",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Date/Time:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {dateNow || "—"}
                </Box>
              </Box>
            </TableCell>
          </TableRow>

          {/* ROW 2 */}
          <TableRow>
            {/* GENDER */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Gender:
                </Box>

                <Box
                  component="span"
                  sx={{
                    ...valueStyle,
                    textTransform: "capitalize",
                  }}
                >
                  {patient?.gender
                    ? String(patient.gender).toLowerCase()
                    : "—"}
                </Box>
              </Box>
            </TableCell>

            {/* WEIGHT */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Weight:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {patient?.weight
                    ? `${patient.weight} kg`
                    : "—"}
                </Box>
              </Box>
            </TableCell>

            {/* HEIGHT */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Height:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {patient?.height || "—"}
                </Box>
              </Box>
            </TableCell>
          </TableRow>

          {/* MOBILE DATE */}
          <TableRow
            sx={{
              display: {
                xs: isDownloading ? "none" : "table-row",
                sm: "none",
              },
            }}
          >
            <TableCell colSpan={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box component="span" sx={labelStyle}>
                  Date/Time:
                </Box>

                <Box component="span" sx={valueStyle}>
                  {dateNow || "—"}
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

/* =========================================================
   DIAGNOSIS
========================================================= */

export function DiagnosisSection({
  diagnosis,
  editable,
  setDiagnosis,
  isDownloading,
}) {
  const currentLength = (diagnosis || "").length;

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        mb: 1.5,
      }}
    >
      {/* TITLE */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          mb: 0.5,
        }}
      >
        <Box
          sx={{
            width: "1px",
            height: "16px",
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          Diagnosis
        </Typography>
      </Box>

      {/* DIAGNOSIS BOX */}
      <Box
        sx={{
          width: "100%",
          minHeight: "16px",

          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.2,

          bgcolor: "background.paper",

          boxSizing: "border-box",

          px: {
            xs: 1,
            sm: 1.2,
          },

          py: 0.3,

          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        {editable && !isDownloading ? (
          <textarea
            value={diagnosis || ""}
            maxLength={250}
            placeholder="Enter diagnosis..."
            rows={1}
            onChange={(e) => {
              if (e.target.value.length <= 250) {
                setDiagnosis(e.target.value);
              }
            }}
            style={{
              width: "100%",
              minHeight: "24px",

              resize: "vertical",

              boxSizing: "border-box",

              border: "none",
              outline: "none",

              padding: "2px 0 0 0",
              margin: 0,

              fontSize: "14px",
              lineHeight: "19px",

              fontFamily: "inherit",

              color: "#172033",
              backgroundColor: "transparent",
            }}
          />
        ) : (
          <Typography
            sx={{
              width: "100%",
              minHeight: "24px",

              py: 0.2,

              fontSize: "14px",
              lineHeight: 1.4,

              color: diagnosis
                ? "text.primary"
                : "text.disabled",

              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
            }}
          >
            {diagnosis || "No diagnosis added."}
          </Typography>
        )}

        {/* CHARACTER COUNT */}
        {editable && !isDownloading && (
          <Typography
            sx={{
              textAlign: "right",
              fontSize: "9px",
              lineHeight: 1,

              color:
                currentLength >= 240
                  ? "error.main"
                  : "text.disabled",
            }}
          >
            {currentLength}/250
          </Typography>
        )}
      </Box>
    </Box>
  );
}