"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

const humanize = (value) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

function DataSection({ title, data }) {
  if (!data || typeof data !== "object") return null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          mb: 0.8,
          fontSize: 13,
          lineHeight: 1.2,
          fontWeight: 700,
          color: "#172033",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          columnGap: 1.5,
          rowGap: 1,
        }}
      >
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                mb: 0.2,
                fontSize: 10,
                lineHeight: 1.2,
                color: "#74807B",
              }}
            >
              {humanize(key)}
            </Typography>

            <Typography
              sx={{
                fontSize: 11.5,
                lineHeight: 1.3,
                fontWeight: 600,
                color: "#172033",
                overflowWrap: "anywhere",
              }}
            >
              {displayValue(value)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function LabRegistrationPreview({
  open,
  registration,
  onClose,
}) {
  const registrationData = registration?.registrationData || {};
  const documents = registration?.documents || {};

  const statusData = registration
    ? {
        labEmailVerified: registration.labEmailVerified,
        onboardingStatus: registration.onboardingStatus,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
      }
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: "60%",
          maxWidth: 1440,
          maxHeight: "calc(100vh - 32px)",
          m: 2,
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 1.2,
          pr: 7,
          borderBottom: "1px solid #E5ECE9",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#172033" }}>
          Registration preview
        </Typography>

        {registration && (
          <Box sx={{ mt: 0.4, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 11, color: "#74807B" }}>
              Registration #{registration.id}
            </Typography>
            <Chip
              size="small"
              label={registration.onboardingStatus || "—"}
              sx={{
                height: 20,
                fontSize: 9,
                fontWeight: 700,
                bgcolor: "#E8F5F1",
                color: "#07876A",
              }}
            />
          </Box>
        )}

        <IconButton
          onClick={onClose}
          aria-label="Close preview"
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 1.5, md: 2.5 },
          overflowY: { xs: "auto", lg: "hidden" },
        }}
      >
        {!registration ? (
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Registration data available nahi hai.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1.8 }}>
            {Object.entries(registrationData).map(([section, data]) => (
              <DataSection
                key={section}
                title={humanize(section)}
                data={data}
              />
            ))}

            <DataSection title="Registration status" data={statusData} />

            <Box>
              <Typography
                sx={{
                  mb: 0.8,
                  fontSize: 13,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#172033",

                }}
              >
                Documents
              </Typography>

              {Object.keys(documents).length === 0 ? (
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  Documents available nahi hain.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1,
                  }}
                >
                  {Object.entries(documents).flatMap(([key, value]) => {
                    const files = Array.isArray(value) ? value : [value];

                    return files.map((file, index) => (
                      <Box
                        key={`${key}-${index}`}
                        sx={{
                          minWidth: 0,
                          px: 1,
                          py: 0.5,
                          minHeight: 36,
                          border: "1px solid #DDE9E5",
                          borderRadius: 1.2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            minWidth: 0,
                            fontSize: 10.5,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={humanize(key)}
                        >
                          {humanize(key)}
                          {files.length > 1 ? ` ${index + 1}` : ""}
                        </Typography>

                        {file?.url ? (
                          <Button
                            component="a"
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            endIcon={<OpenInNewRoundedIcon />}
                            sx={{
                              minWidth: "auto",
                              px: 0.5,
                              fontSize: 10,
                              textTransform: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Typography sx={{ fontSize: 9, color: "#74807B" }}>
                            No URL
                          </Typography>
                        )}
                      </Box>
                    ));
                  })}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}