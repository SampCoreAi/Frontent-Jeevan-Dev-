"use client";

import React, { useMemo } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import dayjs from "dayjs";

export default function PastDetailsDialog({
  open,
  onClose,
  loading,
  error,
  data = [],
  patient,
  selectedDate,
  onDateChange,
}) {
  const theme = useTheme();

  const groupedDates = useMemo(() => {
    const groups = {};

    data.forEach((item) => {
      const date = item?.appointment?.date;

      if (!date) return;

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);
    });

    return Object.keys(groups).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [data]);

  const selectedPrescriptions = useMemo(() => {
    if (!selectedDate) return [];

    return data.filter(
      (item) =>
        item?.appointment?.date === selectedDate
    );
  }, [data, selectedDate]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 900,
          height: {
            xs: "92vh",
            md: "80vh",
          },
          m: {
            xs: 1,
            sm: 2,
          },
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <Box
        sx={{
          minHeight: 68,
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Past Prescriptions
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "11.5px",
              color: theme.palette.text.secondary,
            }}
          >
            {patient?.name || "Patient"}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              height: "100%",
              minHeight: 450,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} />

            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
              }}
            >
              Loading past prescriptions...
            </Typography>
          </Box>
        ) : error || !data.length ? (
          <Box
            sx={{
              height: "100%",
              minHeight: 450,
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                mb: 1.5,
                borderRadius: "50%",
                bgcolor: "#EDF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionOutlinedIcon
                sx={{
                  fontSize: 25,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              No Past Prescriptions
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: theme.palette.text.secondary,
              }}
            >
              {error ||
                "No prescription history is available for this patient."}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: {
                xs: "block",
                md: "grid",
              },
              gridTemplateColumns: "220px 1fr",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                bgcolor: theme.palette.background.default,
                borderRight: {
                  md: `1px solid ${theme.palette.divider}`,
                },
                borderBottom: {
                  xs: `1px solid ${theme.palette.divider}`,
                  md: 0,
                },
                overflowY: "auto",
              }}
            >
              <Typography
                sx={{
                  px: 0.5,
                  mb: 1.25,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Prescription Dates
              </Typography>

              {groupedDates.map((date) => {
                const active =
                  date === selectedDate;

                const count = data.filter(
                  (item) =>
                    item?.appointment?.date === date
                ).length;

                return (
                  <Box
                    key={date}
                    onClick={() =>
                      onDateChange(date)
                    }
                    sx={{
                      mb: 0.75,
                      p: 1.2,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      border: `1px solid ${
                        active
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      bgcolor: active
                        ? "#EDF7F2"
                        : theme.palette.background.paper,
                      "&:hover": {
                        borderColor:
                          theme.palette.primary.main,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                      }}
                    >
                      <CalendarMonthOutlinedIcon
                        sx={{
                          fontSize: 16,
                          color: active
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: active
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                        }}
                      >
                        {dayjs(date).format(
                          "DD MMM YYYY"
                        )}
                      </Typography>
                    </Box>

                    {count > 1 && (
                      <Typography
                        sx={{
                          mt: 0.4,
                          ml: 3,
                          fontSize: "10.5px",
                          color:
                            theme.palette.text.secondary,
                        }}
                      >
                        {count} prescriptions
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                p: 2,
                overflowY: "auto",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography
                sx={{
                  mb: 1.5,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {selectedDate
                  ? dayjs(selectedDate).format(
                      "DD MMMM YYYY"
                    )
                  : "Prescription"}
              </Typography>

              {selectedPrescriptions.map(
                (item, index) => (
                  <PrescriptionCard
                    key={
                      item?.appointment?.id ||
                      index
                    }
                    item={item}
                  />
                )
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PrescriptionCard({ item }) {
  const theme = useTheme();

  const doctor = item?.doctor || {};
  const appointment = item?.appointment || {};
  const prescription = item?.prescription || {};
  const medicines = Array.isArray(
    prescription?.medicines
  )
    ? prescription.medicines
    : [];

  return (
    <Box
      sx={{
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          bgcolor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Dr. {doctor?.name || "Doctor"}
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: "11px",
              color: theme.palette.text.secondary,
            }}
          >
            {doctor?.specialization ||
              "Not provided"}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: "11px",
            color: theme.palette.text.secondary,
          }}
        >
          {appointment?.start_time
            ? dayjs(
                `2000-01-01T${appointment.start_time}`
              ).format("hh:mm A")
            : ""}
        </Typography>
      </Box>

      <Box sx={{ p: 1.75 }}>
        <InfoRow
          label="Diagnosis"
          value={
            prescription?.diagnosis ||
            "Not provided"
          }
        />

        <InfoRow
          label="Hospital"
          value={
            appointment?.hospital_name ||
            "Not provided"
          }
        />

        <Typography
          sx={{
            mt: 2,
            mb: 0.8,
            fontSize: "12px",
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Medicines
        </Typography>

        {medicines.length ? (
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              overflow: "hidden",
            }}
          >
            {medicines.map(
              (medicine, index) => (
                <Box
                  key={
                    medicine?.id || index
                  }
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderBottom:
                      index <
                      medicines.length - 1
                        ? `1px solid ${theme.palette.divider}`
                        : 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color:
                        theme.palette.text.primary,
                    }}
                  >
                    {medicine?.medicine_name ||
                      "Medicine"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: "11px",
                      color:
                        theme.palette.text.secondary,
                    }}
                  >
                    {[
                      medicine?.dose &&
                        `Dose: ${medicine.dose}`,
                      medicine?.frequency,
                      medicine?.duration,
                      medicine?.instructions,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "11.5px",
              color: theme.palette.text.secondary,
            }}
          >
            No medicines added.
          </Typography>
        )}

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 1,
          }}
        >
          <InfoBox
            label="Remark"
            value={
              prescription?.remark ||
              "Not provided"
            }
          />

          <InfoBox
            label="Follow-up"
            value={
              prescription?.follow_up_date
                ? dayjs(
                    prescription.follow_up_date
                  ).format("DD MMM YYYY")
                : "Not provided"
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 0.8,
        display: "flex",
        gap: 1,
      }}
    >
      <Typography
        sx={{
          minWidth: 75,
          fontSize: "11px",
          color: theme.palette.text.secondary,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "11.5px",
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function InfoBox({ label, value }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.2,
        borderRadius: 1.5,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        sx={{
          mb: 0.3,
          fontSize: "10px",
          color: theme.palette.text.secondary,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "11.5px",
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}