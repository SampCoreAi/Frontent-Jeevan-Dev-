"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const textFieldSx = {
  "& .MuiInputBase-root": {
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px",
    mx: 0,
  },
};

/* ================================
   BASIC LAB FIELDS
================================ */

const BASIC_FIELDS = [
  {
    name: "fullName",
    label: "Lab owner name",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Owner email",
    required: true,
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phoneNumber",
    label: "Phone number",
    required: true,
    inputProps: {
      maxLength: 10,
      inputMode: "numeric",
    },
  },
  {
    name: "labName",
    label: "Lab name",
    required: true,
  },
  {
    name: "labCode",
    label: "Lab code",
  },
  {
    name: "registrationNumber",
    label: "Registration number",
  },
];

/* ================================
   ADDRESS FIELDS
================================ */

const ADDRESS_FIELDS = [
  {
    name: "buildingPlot",
    label: "Building / Plot No.",
    required: true,
  },
  {
    name: "streetName",
    label: "Street / Road",
  },
  {
    name: "areaLocality",
    label: "Area / Locality",
    required: true,
  },
  {
    name: "landmark",
    label: "Landmark",
  },
  {
    name: "city",
    label: "City",
    required: true,
  },
  {
    name: "district",
    label: "District",
    required: true,
  },
  {
    name: "state",
    label: "State",
    required: true,
  },
  {
    name: "pinCode",
    label: "PIN Code",
    required: true,
    inputProps: {
      maxLength: 6,
      inputMode: "numeric",
    },
  },
];

const CreateLabDialog = ({
  open,
  onClose,
  form,
  formErrors,
  onChange,
  onSubmit,
  saving,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  /* ================================
     COMMON FIELD
  ================================ */

  const renderField = (field) => (
    <TextField
      key={field.name}
      name={field.name}
      label={field.label}
      value={form?.[field.name] || ""}
      onChange={onChange}
      required={field.required}
      type={field.type || "text"}
      error={Boolean(formErrors?.[field.name])}
      helperText={formErrors?.[field.name] || " "}
      autoComplete={field.autoComplete || "off"}
      inputProps={field.inputProps}
      fullWidth
      size="small"
      disabled={saving}
      sx={{
        ...textFieldSx,

        "& .MuiOutlinedInput-root": {
          fontSize: "13px",
          borderRadius: 1.5,
          bgcolor: theme.palette.background.paper,

          "& fieldset": {
            borderColor: theme.palette.divider,
          },

          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },

          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: "1px",
          },
        },

        "& .MuiInputLabel-root": {
          fontSize: "13px",
          color: theme.palette.text.secondary,
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: theme.palette.primary.main,
        },

        "& .MuiFormHelperText-root": {
          minHeight: 18,
          mt: 0.4,
          mx: 0.25,
          fontSize: "11px",
          lineHeight: 1.2,
        },
      }}
    />
  );

  return (
   <Dialog
  open={open}
  onClose={saving ? undefined : onClose}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      width: {
        xs: "calc(100% - 24px)",
        sm: "calc(100% - 64px)",
      },
      maxWidth: {
        xs: "100%",
        sm: 750,
      },

      height: {
        xs: "88vh",
        sm: "auto",
      },

      maxHeight: {
        xs: "88vh",
        sm: "85vh",
      },

      m: {
        xs: 1.5,
        sm: 3,
      },

      borderRadius: {
        xs: 2,
        sm: 2.5,
      },

      bgcolor: theme.palette.background.paper,
      boxShadow: "0 12px 35px rgba(0,0,0,0.10)",

      overflow: "hidden",

      display: "flex",
      flexDirection: "column",
    },
  }}
>
  <Box
    component="form"
    onSubmit={onSubmit}
    noValidate
    sx={{
      display: "flex",
      flexDirection: "column",

      height: "100%",
      minHeight: 0,
      overflow: "hidden",
    }}
  >
        {/* ================================
            HEADER
        ================================ */}

        <DialogTitle
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
            },

            py: 1.75,

            borderBottom: `1px solid ${theme.palette.divider}`,

            bgcolor: theme.palette.background.default,
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Create Lab
          </Typography>

          <Typography
            component="div"
            sx={{
              fontSize: "12px",
              color: theme.palette.text.secondary,
              mt: 0.35,
            }}
          >
            Add lab, owner and complete address
            information.
          </Typography>
        </DialogTitle>

        {/* ================================
            CONTENT
        ================================ */}

        <DialogContent
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
            },

            py: "20px !important",

            maxHeight: {
              xs: "none",
              sm: "70vh",
            },

            overflowY: "auto",

            "&::-webkit-scrollbar": {
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: theme.palette.divider,
              borderRadius: 10,
            },
          }}
        >
          {/* ================================
              LAB INFORMATION
          ================================ */}

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.4,
              }}
            >
              Lab Information
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
                mb: 1.5,
              }}
            >
              Enter lab and owner details.
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },

                columnGap: 1.5,
                rowGap: 0.5,
              }}
            >
              {BASIC_FIELDS.map(renderField)}
            </Box>
          </Box>

          <Divider
            sx={{
              my: 1.5,
            }}
          />

          {/* ================================
              LAB ADDRESS
          ================================ */}

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.4,
              }}
            >
              Lab Address
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
                mb: 1.5,
              }}
            >
              Enter the complete physical address of
              the lab.
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },

                columnGap: 1.5,
                rowGap: 0.5,
              }}
            >
              {ADDRESS_FIELDS.map(renderField)}
            </Box>
          </Box>
        </DialogContent>

        {/* ================================
            ACTIONS
        ================================ */}

        <DialogActions
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
            },

            py: 1.5,

            gap: 0.75,

            borderTop: `1px solid ${theme.palette.divider}`,

            bgcolor: theme.palette.background.default,
          }}
        >
          <Button
            onClick={onClose}
            disabled={saving}
            variant="outlined"
            sx={{
              minWidth: 85,
              height: 34,
              fontSize: "13px",
              borderRadius: 1.5,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{
              minWidth: 105,
              height: 34,
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: 1.5,
              textTransform: "none",
              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {saving ? (
              <Stack
                direction="row"
                alignItems="center"
                gap={0.75}
              >
                <CircularProgress
                  size={14}
                  color="inherit"
                />

                <span>Creating...</span>
              </Stack>
            ) : (
              "Create Lab"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateLabDialog;