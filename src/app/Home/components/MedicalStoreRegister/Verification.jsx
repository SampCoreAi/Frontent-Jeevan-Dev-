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
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
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
const OTP_EXPIRY_SECONDS = 5 * 60;
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
  {
    key: "terms",
    text: "I agree to the applicable terms and conditions.",
  },
];

const normalizeMobile = (value = "") => String(value).replace(/\D/g, "");

const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidMobile = (value = "") => /^[6-9]\d{9}$/.test(value);

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

function useResendTimer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const start = React.useCallback((duration = RESEND_SECONDS) => {
    setSeconds(duration);
  }, []);

  const reset = React.useCallback(() => {
    setSeconds(0);
  }, []);

  return { seconds, start, reset };
}

const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 1)}${"*".repeat(Math.max(3, name.length - 1))}@${domain}`;
};

const maskMobile = (mobile) => `******${mobile.slice(-4)}`;

const serverConfirmed = (result) =>
  result?.success === true || result?.data?.success === true;

function OtpBoxes({ otp, setOtp, disabled, prefix }) {
  const inputRefs = React.useRef([]);

  const focusInput = (index) => {
    const safeIndex = Math.max(0, Math.min(index, 5));
    inputRefs.current[safeIndex]?.focus();
  };

  const handleChange = (index, value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length > 1) {
      const pasted = digits.slice(0, 6);
      setOtp(pasted);
      focusInput(Math.min(pasted.length, 5));
      return;
    }

    const next = Array.from({ length: 6 }, (_, i) => otp[i] || "");
    next[index] = digits.slice(-1);
    setOtp(next.join(""));

    if (digits && index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      const next = Array.from({ length: 6 }, (_, i) => otp[i] || "");

      if (next[index]) {
        next[index] = "";
        setOtp(next.join(""));
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft") focusInput(index - 1);
    if (event.key === "ArrowRight") focusInput(index + 1);
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (digits) {
      setOtp(digits);
      focusInput(Math.min(digits.length, 5));
    }
  };

  return (
    <Box sx={{ display: "flex", gap: { xs: 0.6, sm: 0.8 } }}>
      {Array.from({ length: 6 }, (_, index) => (
        <Box
          key={`${prefix}-${index}`}
          sx={{ width: { xs: 35, sm: 42 }, flexShrink: 0 }}
        >
          <TextField
            inputRef={(element) => {
              inputRefs.current[index] = element;
            }}
            value={otp[index] || ""}
            disabled={disabled}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            slotProps={{
              htmlInput: {
                maxLength: 6,
                inputMode: "numeric",
                autoComplete: index === 0 ? "one-time-code" : "off",
                "aria-label": `${prefix} OTP digit ${index + 1}`,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: 42,
                borderRadius: "7px",
                bgcolor: disabled ? "#F5F7F6" : C.white,
                "& fieldset": { borderColor: C.border },
                "&.Mui-focused fieldset": {
                  borderColor: C.primary,
                  borderWidth: "1.5px",
                },
              },
              "& .MuiInputBase-input": {
                p: 0,
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: C.text,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function VerificationSection({
  title,
  subtitle,
  Icon,
  destination,
  sent,
  verified,
  otp,
  setOtp,
  timer,
  sending,
  verifying,
  busy,
  onSend,
  onVerify,
  destinationValid,
  serviceAvailable,
  expiryTimer,
  attempts,
  maxAttempts,
  prefix,
}) {
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
        <Icon sx={{ color: C.primary, fontSize: 22, flexShrink: 0 }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: C.text }}>
            {title}
          </Typography>

          <Typography sx={{ mt: 0.3, fontSize: "11px", color: C.muted }}>
            {subtitle}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: "11px",
              color: C.muted,
              overflowWrap: "anywhere",
            }}
          >
            {destination || "No details found from the previous step"}
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 1.3,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: C.text }}>
              Enter 6-digit OTP
            </Typography>

            <Typography sx={{ fontSize: "10px", color: C.muted, mt: 0.3 }}>
              {verified
                ? "Verification completed"
                : sent
                ? "Enter the code sent to you"
                : "Send OTP to enable the boxes"}
            </Typography>
          </Box>

          {sent && !verified && (
            <Typography
              sx={{
                fontSize: "10px",
                color: timer.seconds > 0 ? C.muted : C.primary,
                fontWeight: 600,
              }}
            >
              {timer.seconds > 0
                ? `Resend in ${formatTime(timer.seconds)}`
                : "You can resend OTP"}
            </Typography>
          )}
        </Box>

        {!verified && destinationValid && (
          <>
            {sent && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <OtpBoxes
                  otp={otp}
                  setOtp={setOtp}
                  disabled={
                    busy ||
                    expiryTimer.seconds <= 0 ||
                    attempts >= maxAttempts
                  }
                  prefix={prefix}
                />

                <Button
                  variant="contained"
                  onClick={onVerify}
                  disabled={
                    busy ||
                    !sent ||
                    expiryTimer.seconds <= 0 ||
                    attempts >= maxAttempts ||
                    otp.length !== 6
                  }
                  sx={{
                    height: 42,
                    minWidth: 100,
                    bgcolor: C.primary,
                    borderRadius: "8px",
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: "11px",
                    fontWeight: 700,
                    "&:hover": { bgcolor: C.hover, boxShadow: "none" },
                  }}
                >
                  {verifying ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </Box>
            )}

            <Button
              variant="text"
              onClick={onSend}
              disabled={
                busy ||
                timer.seconds > 0 ||
                !destinationValid ||
                !serviceAvailable
              }
              sx={{
                mt: 1,
                p: 0,
                minWidth: 0,
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "none",
                color: C.primary,
              }}
            >
              {sending ? (
                <CircularProgress size={15} color="inherit" />
              ) : sent && timer.seconds > 0 ? (
                `Resend OTP in ${formatTime(timer.seconds)}`
              ) : sent ? (
                "Resend OTP"
              ) : (
                "Send OTP"
              )}
            </Button>

            {!serviceAvailable && (
              <Typography sx={{ mt: 0.6, fontSize: "10px", color: C.muted }}>
                Verification service is not configured for this registration.
              </Typography>
            )}
            {sent && expiryTimer.seconds <= 0 && (
              <Typography sx={{ mt: 0.6, fontSize: "10px", color: "#A16207" }}>
                OTP expired. Request a new code.
              </Typography>
            )}
            {sent && attempts > 0 && attempts < maxAttempts && (
              <Typography sx={{ mt: 0.6, fontSize: "10px", color: C.muted }}>
                {maxAttempts - attempts} verification attempts remaining.
              </Typography>
            )}
            {attempts >= maxAttempts && (
              <Typography sx={{ mt: 0.6, fontSize: "10px", color: C.error }}>
                Attempt limit reached. Request a new code after the resend timer.
              </Typography>
            )}
          </>
        )}

        {verified && (
          <Alert
            severity="success"
            icon={<VerifiedOutlinedIcon fontSize="small" />}
            sx={{
              py: 0,
              borderRadius: "8px",
              bgcolor: C.light,
              color: C.primary,
              "& .MuiAlert-message": { fontSize: "11px" },
            }}
          >
            {title} verified successfully.
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default function Verification({
  data = {},
  onSendOtp,
  onVerifyOtp,
  onSendMobileOtp,
  onVerifyMobileOtp,
  onSendPharmacistOtp,
  onVerifyPharmacistOtp,
  onBack,
  onSubmit,
  loading = false,
}) {
  const email = String(data.storeEmail || data.email || "")
    .trim()
    .toLowerCase();

  const mobile = normalizeMobile(
    data.storePhone ||
      data.mobileNumber ||
      data.phoneNumber ||
      data.mobile ||
      data.phone ||
      ""
  );
  const pharmacistMobile = normalizeMobile(data.pharmacistPhone || "");

  const [emailOtp, setEmailOtp] = React.useState("");
  const [mobileOtp, setMobileOtp] = React.useState("");
  const [pharmacistOtp, setPharmacistOtp] = React.useState("");

  const [emailSent, setEmailSent] = React.useState(false);
  const [mobileSent, setMobileSent] = React.useState(false);
  const [pharmacistOtpSent, setPharmacistOtpSent] = React.useState(false);

  const [emailVerified, setEmailVerified] = React.useState(false);
  const [mobileVerified, setMobileVerified] = React.useState(false);
  const [pharmacistPhoneVerified, setPharmacistPhoneVerified] =
    React.useState(false);
  const [emailAttempts, setEmailAttempts] = React.useState(0);
  const [mobileAttempts, setMobileAttempts] = React.useState(0);
  const [pharmacistAttempts, setPharmacistAttempts] = React.useState(0);

  const [declarations, setDeclarations] = React.useState(
    Object.fromEntries(DECLARATIONS.map(({ key }) => [key, false]))
  );

  const [sendingEmail, setSendingEmail] = React.useState(false);
  const [sendingMobile, setSendingMobile] = React.useState(false);
  const [verifyingEmail, setVerifyingEmail] = React.useState(false);
  const [verifyingMobile, setVerifyingMobile] = React.useState(false);
  const [sendingPharmacistOtp, setSendingPharmacistOtp] = React.useState(false);
  const [verifyingPharmacistOtp, setVerifyingPharmacistOtp] =
    React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [error, setError] = React.useState("");

  const emailTimer = useResendTimer();
  const mobileTimer = useResendTimer();
  const emailExpiryTimer = useResendTimer();
  const mobileExpiryTimer = useResendTimer();
  const pharmacistTimer = useResendTimer();
  const pharmacistExpiryTimer = useResendTimer();
  const resetEmailTimer = emailTimer.reset;
  const resetMobileTimer = mobileTimer.reset;
  const resetEmailExpiry = emailExpiryTimer.reset;
  const resetMobileExpiry = mobileExpiryTimer.reset;
  const resetPharmacistTimer = pharmacistTimer.reset;
  const resetPharmacistExpiry = pharmacistExpiryTimer.reset;
  const previousDestinations = React.useRef({
    email,
    mobile,
    pharmacistMobile,
  });

  React.useEffect(() => {
    if (previousDestinations.current.email !== email) {
      previousDestinations.current.email = email;
      setEmailOtp("");
      setEmailSent(false);
      setEmailVerified(false);
      setEmailAttempts(0);
      resetEmailTimer();
      resetEmailExpiry();
    }

    if (previousDestinations.current.mobile !== mobile) {
      previousDestinations.current.mobile = mobile;
      setMobileOtp("");
      setMobileSent(false);
      setMobileVerified(false);
      setMobileAttempts(0);
      resetMobileTimer();
      resetMobileExpiry();
    }

    if (previousDestinations.current.pharmacistMobile !== pharmacistMobile) {
      previousDestinations.current.pharmacistMobile = pharmacistMobile;
      setPharmacistOtp("");
      setPharmacistOtpSent(false);
      setPharmacistPhoneVerified(false);
      setPharmacistAttempts(0);
      resetPharmacistTimer();
      resetPharmacistExpiry();
    }
  }, [
    email,
    mobile,
    resetEmailTimer,
    resetMobileTimer,
    resetEmailExpiry,
    resetMobileExpiry,
    pharmacistMobile,
    resetPharmacistTimer,
    resetPharmacistExpiry,
  ]);

  const busy =
    loading ||
    submitting ||
    sendingEmail ||
    sendingMobile ||
    sendingPharmacistOtp ||
    verifyingEmail ||
    verifyingMobile ||
    verifyingPharmacistOtp;

  const allDeclarationsAccepted = Object.values(declarations).every(Boolean);
  const clearError = () => setError("");
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

  const missingDocuments = PHARMACY_DOCUMENTS.filter(
    ({ field }) => isPharmacyDocumentRequired(field, data) && !data[field],
  ).map(({ label }) => label);
  const unverifiedContacts = [
    ...(isValidEmail(email) && !emailVerified ? ["Store email"] : []),
    ...(isValidMobile(mobile) && !mobileVerified ? ["Store mobile"] : []),
    ...(isValidMobile(pharmacistMobile) && !pharmacistPhoneVerified
      ? ["Pharmacist phone"]
      : []),
  ];
  const submissionIssues = [
    ...missingFields.map((label) => `Missing information: ${label}`),
    ...missingDocuments.map((label) => `Missing document: ${label}`),
    ...unverifiedContacts.map((label) => `Unverified contact: ${label}`),
    ...(!allDeclarationsAccepted ? ["Required declarations are incomplete"] : []),
  ];
  if (email && !isValidEmail(email)) {
    submissionIssues.push("Invalid store email address");
  }
  if (mobile && !isValidMobile(mobile)) {
    submissionIssues.push("Invalid store mobile number");
  }
  if (pharmacistMobile && !isValidMobile(pharmacistMobile)) {
    submissionIssues.push("Invalid pharmacist phone number");
  }

  const updateDeclaration = (key, checked) => {
    setDeclarations((previous) => ({
      ...previous,
      [key]: checked,
    }));
    clearError();
  };

  const handleSendEmailOtp = async () => {
    if (busy || emailTimer.seconds > 0) return;

    if (!isValidEmail(email)) {
      setError("Email address was not found. Please return to the previous step.");
      return;
    }

    if (typeof onSendOtp !== "function") {
      setError("Email OTP service is not connected.");
      return;
    }

    try {
      clearError();
      setSendingEmail(true);
      const result = await onSendOtp({ email });
      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm that the email OTP was sent.");
      }

      setEmailOtp("");
      setEmailSent(true);
      setEmailVerified(false);
      emailTimer.start();
      emailExpiryTimer.start(OTP_EXPIRY_SECONDS);
      setEmailAttempts(0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send the email OTP."));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (busy) return;

    if (!emailSent || emailExpiryTimer.seconds <= 0 || emailOtp.length !== 6) {
      setError("Please enter the complete 6-digit email OTP.");
      return;
    }
    if (emailAttempts >= MAX_OTP_ATTEMPTS) {
      setError("The email OTP attempt limit has been reached. Request a new code.");
      return;
    }

    if (typeof onVerifyOtp !== "function") {
      setError("Email OTP verification service is not connected.");
      return;
    }

    try {
      clearError();
      setVerifyingEmail(true);
      const result = await onVerifyOtp({ email, otp: emailOtp });
      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm email verification.");
      }

      setEmailVerified(true);
      setEmailOtp("");
      emailTimer.reset();
      emailExpiryTimer.reset();
    } catch (err) {
      setEmailAttempts((previous) => previous + 1);
      setError(getErrorMessage(err, "Invalid or expired email OTP."));
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSendMobileOtp = async () => {
    if (busy || mobileTimer.seconds > 0) return;

    if (!isValidMobile(mobile)) {
      setError("Mobile number was not found. Please return to the previous step.");
      return;
    }

    if (typeof onSendMobileOtp !== "function") {
      setError("Mobile OTP service is not connected.");
      return;
    }

    try {
      clearError();
      setSendingMobile(true);
      const result = await onSendMobileOtp({
        mobileNumber: mobile,
        countryCode: "+91",
      });
      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm that the mobile OTP was sent.");
      }

      setMobileOtp("");
      setMobileSent(true);
      setMobileVerified(false);
      mobileTimer.start();
      mobileExpiryTimer.start(OTP_EXPIRY_SECONDS);
      setMobileAttempts(0);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send the mobile OTP."));
    } finally {
      setSendingMobile(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (busy) return;

    if (!mobileSent || mobileExpiryTimer.seconds <= 0 || mobileOtp.length !== 6) {
      setError("Please enter the complete 6-digit mobile OTP.");
      return;
    }
    if (mobileAttempts >= MAX_OTP_ATTEMPTS) {
      setError("The mobile OTP attempt limit has been reached. Request a new code.");
      return;
    }

    if (typeof onVerifyMobileOtp !== "function") {
      setError("Mobile OTP verification service is not connected.");
      return;
    }

    try {
      clearError();
      setVerifyingMobile(true);
      const result = await onVerifyMobileOtp({
        mobileNumber: mobile,
        countryCode: "+91",
        otp: mobileOtp,
      });
      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm mobile verification.");
      }

      setMobileVerified(true);
      setMobileOtp("");
      mobileTimer.reset();
      mobileExpiryTimer.reset();
    } catch (err) {
      setMobileAttempts((previous) => previous + 1);
      setError(getErrorMessage(err, "Invalid or expired mobile OTP."));
    } finally {
      setVerifyingMobile(false);
    }
  };

  const handleSendPharmacistOtp = async () => {
    if (busy || pharmacistTimer.seconds > 0) return;

    if (!isValidMobile(pharmacistMobile)) {
      setError("Enter a valid pharmacist mobile number before requesting OTP.");
      return;
    }

    if (typeof onSendPharmacistOtp !== "function") {
      setError("Pharmacist phone OTP service is not connected.");
      return;
    }

    try {
      clearError();
      setSendingPharmacistOtp(true);
      const result = await onSendPharmacistOtp({
        mobileNumber: pharmacistMobile,
        countryCode: "+91",
      });
      if (!serverConfirmed(result)) {
        throw new Error(
          "The server did not confirm that the pharmacist OTP was sent.",
        );
      }

      setPharmacistOtp("");
      setPharmacistOtpSent(true);
      setPharmacistPhoneVerified(false);
      setPharmacistAttempts(0);
      pharmacistTimer.start();
      pharmacistExpiryTimer.start(OTP_EXPIRY_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send pharmacist OTP."));
    } finally {
      setSendingPharmacistOtp(false);
    }
  };

  const handleVerifyPharmacistOtp = async () => {
    if (busy) return;

    if (
      !pharmacistOtpSent ||
      pharmacistExpiryTimer.seconds <= 0 ||
      pharmacistOtp.length !== 6
    ) {
      setError("Please enter the complete, unexpired pharmacist OTP.");
      return;
    }
    if (pharmacistAttempts >= MAX_OTP_ATTEMPTS) {
      setError(
        "The pharmacist OTP attempt limit has been reached. Request a new code.",
      );
      return;
    }
    if (typeof onVerifyPharmacistOtp !== "function") {
      setError("Pharmacist phone OTP verification service is not connected.");
      return;
    }

    try {
      clearError();
      setVerifyingPharmacistOtp(true);
      const result = await onVerifyPharmacistOtp({
        mobileNumber: pharmacistMobile,
        countryCode: "+91",
        otp: pharmacistOtp,
      });
      if (!serverConfirmed(result)) {
        throw new Error("The server did not confirm pharmacist verification.");
      }

      setPharmacistPhoneVerified(true);
      setPharmacistOtp("");
      pharmacistTimer.reset();
      pharmacistExpiryTimer.reset();
    } catch (err) {
      setPharmacistAttempts((previous) => previous + 1);
      setError(getErrorMessage(err, "Invalid or expired pharmacist OTP."));
    } finally {
      setVerifyingPharmacistOtp(false);
    }
  };

  const handleSubmit = async () => {
    if (busy) return;

    if (!isValidEmail(email) || !isValidMobile(mobile)) {
      setError("Email or mobile details are missing from the previous step.");
      return;
    }

    if (submissionIssues.length) {
      setError("Complete the items listed below before submitting.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setError("Registration submit action is not connected.");
      return;
    }

    try {
      clearError();
      setSubmitting(true);

      await onSubmit({
        email,
        mobileNumber: mobile,
        countryCode: "+91",
        emailVerified: true,
        mobileVerified: true,
        pharmacistPhoneVerified: true,
        declarationAccepted: true,
        declarations,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to submit registration."));
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
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.2,
          mb: 2,
        }}
      >
        <GppGoodOutlinedIcon sx={{ color: C.primary, fontSize: 27 }} />

        <Box>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "18px" },
              fontWeight: 750,
              color: C.text,
            }}
          >
            Verification & Declaration
          </Typography>

          <Typography sx={{ mt: 0.3, fontSize: "11px", color: C.muted }}>
            Verify the details entered in the previous step.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{
            mb: 2,
            borderRadius: "8px",
            "& .MuiAlert-message": { fontSize: "11px" },
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 2,
          width: "100%",
        }}
      >
        <VerificationSection
          title="Email Verification"
          subtitle="A verification code will be sent to your registered email."
          Icon={MarkEmailReadOutlinedIcon}
          destination={
            emailSent || emailVerified
              ? maskEmail(email)
              : email || "Email not available"
          }
          destinationValid={isValidEmail(email)}
          serviceAvailable={
            typeof onSendOtp === "function" &&
            typeof onVerifyOtp === "function"
          }
          sent={emailSent}
          verified={emailVerified}
          otp={emailOtp}
          setOtp={setEmailOtp}
          timer={emailTimer}
          expiryTimer={emailExpiryTimer}
          attempts={emailAttempts}
          maxAttempts={MAX_OTP_ATTEMPTS}
          sending={sendingEmail}
          verifying={verifyingEmail}
          busy={busy}
          onSend={handleSendEmailOtp}
          onVerify={handleVerifyEmailOtp}
          prefix="email"
        />

        <VerificationSection
          title="Mobile Verification"
          subtitle="A verification code will be sent to your registered mobile."
          Icon={PhoneIphoneOutlinedIcon}
          destination={
            mobileSent || mobileVerified
              ? `+91 ${maskMobile(mobile)}`
              : mobile
              ? `+91 ${mobile}`
              : "Mobile number not available"
          }
          destinationValid={isValidMobile(mobile)}
          serviceAvailable={
            typeof onSendMobileOtp === "function" &&
            typeof onVerifyMobileOtp === "function"
          }
          sent={mobileSent}
          verified={mobileVerified}
          otp={mobileOtp}
          setOtp={setMobileOtp}
          timer={mobileTimer}
          expiryTimer={mobileExpiryTimer}
          attempts={mobileAttempts}
          maxAttempts={MAX_OTP_ATTEMPTS}
          sending={sendingMobile}
          verifying={verifyingMobile}
          busy={busy}
          onSend={handleSendMobileOtp}
          onVerify={handleVerifyMobileOtp}
          prefix="mobile"
        />

        <VerificationSection
          title="Pharmacist Consent Verification"
          subtitle="Verify the pharmacist's phone for consent and presence."
          Icon={PhoneIphoneOutlinedIcon}
          destination={
            pharmacistOtpSent || pharmacistPhoneVerified
              ? `+91 ${maskMobile(pharmacistMobile)}`
              : pharmacistMobile
              ? `+91 ${pharmacistMobile}`
              : "Pharmacist phone not available"
          }
          destinationValid={isValidMobile(pharmacistMobile)}
          serviceAvailable={
            typeof onSendPharmacistOtp === "function" &&
            typeof onVerifyPharmacistOtp === "function"
          }
          sent={pharmacistOtpSent}
          verified={pharmacistPhoneVerified}
          otp={pharmacistOtp}
          setOtp={setPharmacistOtp}
          timer={pharmacistTimer}
          expiryTimer={pharmacistExpiryTimer}
          attempts={pharmacistAttempts}
          maxAttempts={MAX_OTP_ATTEMPTS}
          sending={sendingPharmacistOtp}
          verifying={verifyingPharmacistOtp}
          busy={busy}
          onSend={handleSendPharmacistOtp}
          onVerify={handleVerifyPharmacistOtp}
          prefix="pharmacist"
        />
      </Box>

      {submissionIssues.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "9px" }}>
          <Typography sx={{ mb: 0.5, fontSize: "12px", fontWeight: 700 }}>
            Complete these items before submitting:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: "11px" }}>
            {submissionIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </Box>
        </Alert>
      )}

    
<Box
  sx={{
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    p: { xs: 1.5, sm: 2 },
    border: `1px solid ${C.border || "#b1b1b1"}`,
    borderRadius: "10px",
    mb: 2,
    bgcolor: "background.paper",
  }}
>
  <Typography
    sx={{
      fontSize: "13px",
      fontWeight: 700,
      color: C.text,
      mb: 1,
    }}
  >
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
        width: "100%",
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
    "&.Mui-checked": {
      color: C.primary,
    },
    "& .MuiSvgIcon-root": {
      fontSize: 18,
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },
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
          fontSize: "11px",
          lineHeight: 1.7,
          color: C.muted,
          cursor: busy ? "default" : "pointer",
          overflowWrap: "anywhere",
        }}
      >
        {item.text}
      </Typography>
    </Box>
  ))}
</Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
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
            fontSize: "12px",
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
            fontSize: "12px",
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