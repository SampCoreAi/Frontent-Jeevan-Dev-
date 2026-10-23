"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import {
  PHARMACY_DOCUMENTS,
  isPharmacyDocumentRequired,
} from "./registrationRequirements";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  light: "#EAF7F3",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
  white: "#FFFFFF",
};

const RESEND_SECONDS = 60;
const OTP_EXPIRY_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;

const DECLARATIONS = [
  {
    key: "accurate",
    text: "I confirm that the information and documents I provided are accurate and complete.",
  },
  {
    key: "pharmacist",
    text: "I confirm that a registered pharmacist will be available at the medical store during its working hours.",
  },
  {
    key: "dispensing",
    text: "I will dispense medicines according to applicable prescriptions and requirements, without unauthorized substitutions.",
  },
  {
    key: "storeReady",
    text: "I confirm that my medical store is ready to begin operations and process orders after registration approval.",
  },
  {
    key: "updates",
    text: "I will update the platform if the store licence, pharmacist, ownership, or contact details change.",
  },
  { key: "terms", text: "I agree to the applicable terms and conditions." },
];

const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const isValidMobile = (value = "") => /^[6-9]\d{9}$/.test(String(value));

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const serverConfirmed = (result) =>
  result?.success === true || result?.data?.success === true;

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 1)}${"*".repeat(
    Math.max(3, name.length - 1),
  )}@${domain}`;
};

function useTimer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (seconds <= 0) return undefined;

    const timeout = setTimeout(
      () => setSeconds((previous) => Math.max(0, previous - 1)),
      1000,
    );

    return () => clearTimeout(timeout);
  }, [seconds]);

  const start = React.useCallback((duration) => {
    setSeconds(duration);
  }, []);

  const reset = React.useCallback(() => {
    setSeconds(0);
  }, []);

  return { seconds, start, reset };
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function EmailOtpSection({
  title,
  email,
  initialVerified,
  onVerifiedChange,
  onSendOtp,
  onVerifyOtp,
  prefix,
}) {
  const [otp, setOtp] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [verified, setVerified] = React.useState(initialVerified === true);
  const [attempts, setAttempts] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState("");

  const resendTimer = useTimer();
  const expiryTimer = useTimer();
  const previousEmail = React.useRef(email);

  React.useEffect(() => {
    if (previousEmail.current === email) return;

    previousEmail.current = email;
    setOtp("");
    setSent(false);
    setVerified(false);
    setAttempts(0);
    setError("");
    resendTimer.reset();
    expiryTimer.reset();
    onVerifiedChange(false);
  }, [email, onVerifiedChange, resendTimer.reset, expiryTimer.reset]);

  React.useEffect(() => {
    if (initialVerified !== true) return;

    setVerified(true);
    setSent(false);
    setOtp("");
    resendTimer.reset();
    expiryTimer.reset();
  }, [initialVerified, resendTimer.reset, expiryTimer.reset]);

  const send = async () => {
    if (sending || verifying || resendTimer.seconds > 0) return;

    if (!isValidEmail(email)) {
      setError("Enter a valid email address first.");
      return;
    }

    if (typeof onSendOtp !== "function") {
      setError("Email OTP service is not connected.");
      return;
    }

    try {
      setError("");
      setSending(true);

      const result = await onSendOtp({ email });

      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm that the OTP was sent.");
      }

      setOtp("");
      setSent(true);
      setVerified(false);
      setAttempts(0);
      onVerifiedChange(false);
      resendTimer.start(RESEND_SECONDS);
      expiryTimer.start(OTP_EXPIRY_SECONDS);
    } catch (error) {
      setError(getErrorMessage(error, "Unable to send the OTP."));
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    if (sending || verifying) return;

    if (!sent || expiryTimer.seconds <= 0 || otp.length !== 6) {
      setError("Enter the complete, unexpired 6-digit OTP.");
      return;
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      setError("Attempt limit reached. Request a new OTP.");
      return;
    }

    if (typeof onVerifyOtp !== "function") {
      setError("Email OTP verification service is not connected.");
      return;
    }

    try {
      setError("");
      setVerifying(true);

      const result = await onVerifyOtp({ email, otp });

      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm email verification.");
      }

      setVerified(true);
      setSent(false);
      setOtp("");
      onVerifiedChange(true);
      resendTimer.reset();
      expiryTimer.reset();
    } catch (error) {
      setAttempts((previous) => previous + 1);
      setError(getErrorMessage(error, "Invalid or expired OTP."));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
        bgcolor: C.white,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <MarkEmailReadOutlinedIcon
          sx={{ color: C.primary, fontSize: 22, flexShrink: 0 }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {title}
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11, color: C.muted }}>
            A verification code will be sent to this email.
          </Typography>
          <Typography
            sx={{
              mt: 0.3,
              fontSize: 11,
              color: C.muted,
              overflowWrap: "anywhere",
            }}
          >
            {sent || verified ? maskEmail(email) : email || "Email not available"}
          </Typography>
        </Box>

        {verified && (
          <VerifiedOutlinedIcon sx={{ color: C.primary, fontSize: 20 }} />
        )}
      </Box>

      <Box
        sx={{
          p: 1.3,
          borderRadius: "8px",
          bgcolor: "#F8FBFA",
          border: `1px solid ${C.border}`,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.text }}>
          {verified
            ? "Email verified"
            : sent
              ? "Enter the 6-digit OTP"
              : "Send OTP to verify this email"}
        </Typography>

        {!verified && isValidEmail(email) && (
          <>
            {sent && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6-digit OTP"
                  disabled={
                    verifying ||
                    expiryTimer.seconds <= 0 ||
                    attempts >= MAX_OTP_ATTEMPTS
                  }
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 6,
                    "aria-label": `${prefix} email OTP`,
                  }}
                  sx={{
                    width: 150,
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "7px",
                      bgcolor: C.white,
                      fontSize: 13,
                      "&.Mui-focused fieldset": {
                        borderColor: C.primary,
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={verify}
                  disabled={
                    verifying ||
                    expiryTimer.seconds <= 0 ||
                    attempts >= MAX_OTP_ATTEMPTS ||
                    otp.length !== 6
                  }
                  sx={{
                    minHeight: 40,
                    bgcolor: C.primary,
                    borderRadius: "8px",
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: 11,
                    "&:hover": { bgcolor: C.hover, boxShadow: "none" },
                  }}
                >
                  {verifying ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <Typography sx={{ fontSize: 10, color: C.muted }}>
                  {expiryTimer.seconds > 0
                    ? `Expires in ${formatTime(expiryTimer.seconds)}`
                    : "OTP expired"}
                </Typography>
              </Box>
            )}

            <Button
              variant="text"
              onClick={send}
              disabled={sending || verifying || resendTimer.seconds > 0}
              sx={{
                mt: 1,
                p: 0,
                minWidth: 0,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "none",
                color: C.primary,
              }}
            >
              {sending ? (
                <CircularProgress size={15} color="inherit" />
              ) : resendTimer.seconds > 0 ? (
                `Resend OTP in ${formatTime(resendTimer.seconds)}`
              ) : sent ? (
                "Resend OTP"
              ) : (
                "Send OTP"
              )}
            </Button>
          </>
        )}

        {verified && (
          <Alert
            severity="success"
            icon={<VerifiedOutlinedIcon fontSize="small" />}
            sx={{
              mt: 1,
              py: 0,
              borderRadius: "8px",
              bgcolor: C.light,
              color: C.primary,
              "& .MuiAlert-message": { fontSize: 11 },
            }}
          >
            {title} verified successfully.
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 1,
              py: 0,
              borderRadius: "8px",
              "& .MuiAlert-message": { fontSize: 11 },
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default function Verification({
  data = {},
  uploadedDocuments = {},
  onSendOtp,
  onVerifyOtp,
  onSendSignatoryEmailOtp,
  onVerifySignatoryEmailOtp,
  onBack,
  onSubmit,
  loading = false,
}) {
  const storeEmail = String(data.storeEmail || data.email || "")
    .trim()
    .toLowerCase();

  const signatoryEmail = String(data.signatoryEmail || "")
    .trim()
    .toLowerCase();

  const [storeEmailVerified, setStoreEmailVerified] = React.useState(
    data.storeEmailVerified === true,
  );
  const [signatoryEmailVerified, setSignatoryEmailVerified] =
    React.useState(data.signatoryEmailVerified === true);
  const [declarations, setDeclarations] = React.useState(
    Object.fromEntries(DECLARATIONS.map(({ key }) => [key, false])),
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (data.storeEmailVerified === true) setStoreEmailVerified(true);
  }, [data.storeEmailVerified]);

  React.useEffect(() => {
    if (data.signatoryEmailVerified === true) setSignatoryEmailVerified(true);
  }, [data.signatoryEmailVerified]);

  const busy = loading || submitting;
  const allDeclarationsAccepted = Object.values(declarations).every(Boolean);

  const missingFields = [
    ["licensedTradeName", "Licensed trade name"],
    ["legalEntityName", "Legal entity name"],
    ["entityType", "Entity type"],
    ["storeEmail", "Store email"],
    ["storePhone", "Store phone"],
    ["signatoryFullName", "Authorized signatory name"],
    ["signatoryDesignation", "Authorized signatory designation"],
    ["signatoryEmail", "Authorized signatory email"],
    ["signatoryPhone", "Authorized signatory phone"],
    ["shopUnit", "Shop/unit"],
    ["street", "Street"],
    ["cityDistrict", "City/district"],
    ["state", "State"],
    ["pinCode", "PIN code"],
    ["drugLicenseNumber", "Drug license number"],
    ["licenseExpiryDate", "Drug license expiry date"],
    ["issuingAuthority", "Drug license issuing authority"],
    ["form20Number", "Form 20 number"],
    ["form20GrantDate", "Form 20 grant date"],
    ["retentionDueDate", "Retention due date"],
    ["pharmacistFullName", "Pharmacist name"],
    ["registrationNumber", "Pharmacist registration number"],
    ["statePharmacyCouncil", "State Pharmacy Council"],
    ["registrationValidityDate", "Pharmacist registration validity date"],
    ["employmentType", "Pharmacist employment type"],
    ["pharmacistPhone", "Pharmacist phone"],
  ]
    .filter(([field]) => !String(data[field] || "").trim())
    .map(([, label]) => label);

  if (data.collectPayments && !String(data.gstin || "").trim()) {
    missingFields.push("GSTIN (required for platform payment collection)");
  }

  if (
    data.shopEstablishmentApplicable &&
    !String(data.shopEstablishmentNumber || "").trim()
  ) {
    missingFields.push("Shop & Establishment number");
  }

  const documentData = {
    ...data,
    ...uploadedDocuments,
    ...(data.uploadedDocuments || {}),
  };

  const missingDocuments = PHARMACY_DOCUMENTS.filter(
    ({ field }) =>
      isPharmacyDocumentRequired(field, documentData) && !documentData[field],
  ).map(({ label }) => label);

  const submissionIssues = [
    ...missingFields.map((label) => `Missing information: ${label}`),
    ...missingDocuments.map((label) => `Missing document: ${label}`),
    ...(!isValidEmail(storeEmail) ? ["Invalid store email address"] : []),
    ...(!isValidEmail(signatoryEmail)
      ? ["Invalid signatory email address"]
      : []),
    ...(!storeEmailVerified ? ["Unverified contact: Store email"] : []),
    ...(!signatoryEmailVerified
      ? ["Unverified contact: Signatory email"]
      : []),
    ...(!allDeclarationsAccepted
      ? ["Required declarations are incomplete"]
      : []),
  ];

  const updateDeclaration = (key, checked) => {
    setDeclarations((previous) => ({ ...previous, [key]: checked }));
    setError("");
  };

  const handleSubmit = async () => {
    if (busy) return;

    if (submissionIssues.length > 0) {
      setError("Complete the items listed below before submitting.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setError("Registration submit action is not connected.");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await onSubmit({
        email: storeEmail,
        signatoryEmail,
        storeEmailVerified,
        signatoryEmailVerified,
        declarationAccepted: true,
        declarations,
      });
    } catch (submitError) {
      setError(
        getErrorMessage(submitError, "Unable to submit registration."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        bgcolor: C.white,
        py: 2,
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          mb: 2,
        }}
      >
        <GppGoodOutlinedIcon sx={{ color: C.primary, fontSize: 27 }} />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 18 },
              fontWeight: 750,
              color: C.text,
            }}
          >
            Verification & Declaration
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11, color: C.muted }}>
            Verify both email addresses before submitting.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2, borderRadius: "8px" }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
        <EmailOtpSection
          title="Store Email Verification"
          email={storeEmail}
          initialVerified={data.storeEmailVerified}
          onVerifiedChange={setStoreEmailVerified}
          onSendOtp={onSendOtp}
          onVerifyOtp={onVerifyOtp}
          prefix="store"
        />

        <EmailOtpSection
          title="Signatory Email Verification"
          email={signatoryEmail}
          initialVerified={data.signatoryEmailVerified}
          onVerifiedChange={setSignatoryEmailVerified}
          onSendOtp={onSendSignatoryEmailOtp}
          onVerifyOtp={onVerifySignatoryEmailOtp}
          prefix="signatory"
        />
      </Box>

      {submissionIssues.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "9px" }}>
          <Typography sx={{ mb: 0.5, fontSize: 12, fontWeight: 700 }}>
            Complete these items before submitting:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 11 }}>
            {submissionIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </Box>
        </Alert>
      )}

      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          border: `1px solid ${C.border}`,
          borderRadius: "10px",
          mb: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text, mb: 1 }}>
          Declaration
        </Typography>

        {DECLARATIONS.map((item) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.7,
              mb: 0.5,
            }}
          >
            <Checkbox
              checked={Boolean(declarations[item.key])}
              onChange={(event) =>
                updateDeclaration(item.key, event.target.checked)
              }
              disabled={busy}
              size="small"
              sx={{
                p: 0.4,
                mt: 0.1,
                flexShrink: 0,
                color: C.primary,
                "&.Mui-checked": { color: C.primary },
                "& .MuiSvgIcon-root": { fontSize: 18 },
              }}
            />
            <Typography
              onClick={() => {
                if (!busy) {
                  updateDeclaration(item.key, !declarations[item.key]);
                }
              }}
              sx={{
                pt: 0.4,
                flex: 1,
                minWidth: 0,
                fontSize: 11,
                lineHeight: 1.7,
                color: C.muted,
                cursor: busy ? "default" : "pointer",
              }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={busy}
          sx={{
            minHeight: 42,
            borderColor: C.border,
            color: C.text,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: 12,
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={busy || submissionIssues.length > 0}
          startIcon={
            submitting ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <VerifiedOutlinedIcon />
            )
          }
          sx={{
            minHeight: 42,
            px: 2.5,
            bgcolor: C.primary,
            borderRadius: "8px",
            boxShadow: "none",
            textTransform: "none",
            fontSize: 12,
            fontWeight: 700,
            "&:hover": { bgcolor: C.hover, boxShadow: "none" },
          }}
        >
          {submitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </Box>
    </Box>
  );
}