"use client";

import * as React from "react";
import {
  Alert, Box, Button, Checkbox, CircularProgress, TextField, Typography,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { PHARMACY_DOCUMENTS, isPharmacyDocumentRequired } from "./registrationRequirements";

const C = {
  primary: "#07876A", hover: "#066F58", light: "#EAF7F3",
  text: "#172033", muted: "#74807B", border: "#DDE9E5", white: "#FFFFFF",
};
const RESEND_SECONDS = 60;
const OTP_EXPIRY_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;

const DECLARATIONS = [
  { key: "accurate", text: "I confirm that the information and documents I provided are accurate and complete." },
  { key: "pharmacist", text: "I confirm that a registered pharmacist will be available at the medical store during its working hours." },
  { key: "dispensing", text: "I will dispense medicines according to applicable prescriptions and requirements, without unauthorized substitutions." },
  { key: "storeReady", text: "I confirm that my medical store is ready to begin operations and process orders after registration approval." },
  { key: "updates", text: "I will update the platform if the store licence, pharmacist, ownership, or contact details change." },
  { key: "terms", text: "I agree to the applicable terms and conditions." },
];

const normalizeMobile = (value = "") => String(value).replace(/\D/g, "");
const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isValidMobile = (value = "") => /^[6-9]\d{9}$/.test(value);
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const serverConfirmed = (result) => result?.success === true || result?.data?.success === true;
const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.slice(0, 1)}${"*".repeat(Math.max(3, name.length - 1))}@${domain}`;
};
const maskMobile = (mobile = "") => `******${mobile.slice(-4)}`;

function useResendTimer() {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (seconds <= 0) return undefined;
    const id = setTimeout(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [seconds]);
  const start = React.useCallback((duration = RESEND_SECONDS) => setSeconds(duration), []);
  const reset = React.useCallback(() => setSeconds(0), []);
  return { seconds, start, reset };
}

function OtpBoxes({ otp, setOtp, disabled, prefix }) {
  const refs = React.useRef([]);
  const focus = (index) => refs.current[Math.max(0, Math.min(index, 5))]?.focus();
  const change = (index, value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 1) {
      const pasted = digits.slice(0, 6);
      setOtp(pasted);
      focus(Math.min(pasted.length, 5));
      return;
    }
    const next = Array.from({ length: 6 }, (_, i) => otp[i] || "");
    next[index] = digits.slice(-1);
    setOtp(next.join(""));
    if (digits && index < 5) focus(index + 1);
  };
  const paste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits) {
      setOtp(digits);
      focus(Math.min(digits.length, 5));
    }
  };
  return (
    <Box sx={{ display: "flex", gap: { xs: 0.6, sm: 0.8 } }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={`${prefix}-${i}`} sx={{ width: { xs: 35, sm: 42 }, flexShrink: 0 }}>
          <TextField
            inputRef={(el) => { refs.current[i] = el; }}
            value={otp[i] || ""}
            disabled={disabled}
            onChange={(e) => change(i, e.target.value)}
            onPaste={paste}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                const next = Array.from({ length: 6 }, (_, j) => otp[j] || "");
                if (next[i]) { next[i] = ""; setOtp(next.join("")); }
                else if (i > 0) focus(i - 1);
              }
              if (e.key === "ArrowLeft") focus(i - 1);
              if (e.key === "ArrowRight") focus(i + 1);
            }}
            slotProps={{ htmlInput: {
              maxLength: 6, inputMode: "numeric",
              autoComplete: i === 0 ? "one-time-code" : "off",
              "aria-label": `${prefix} OTP digit ${i + 1}`,
            } }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: 42, borderRadius: "7px",
                bgcolor: disabled ? "#F5F7F6" : C.white,
                "& fieldset": { borderColor: C.border },
                "&.Mui-focused fieldset": { borderColor: C.primary, borderWidth: "1.5px" },
              },
              "& .MuiInputBase-input": { p: 0, textAlign: "center", fontSize: 14, fontWeight: 700, color: C.text },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function VerificationSection({
  title, subtitle, Icon, destination, sent, verified, otp, setOtp, timer,
  expiryTimer, attempts, maxAttempts, sending, verifying, busy, onSend, onVerify,
  destinationValid, serviceAvailable, prefix,
}) {
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, border: `1px solid ${C.border}`, borderRadius: "10px", bgcolor: C.white, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Icon sx={{ color: C.primary, fontSize: 22, flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11, color: C.muted }}>{subtitle}</Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11, color: C.muted, overflowWrap: "anywhere" }}>{destination || "Details not available"}</Typography>
        </Box>
        {verified && <VerifiedOutlinedIcon sx={{ color: C.primary, fontSize: 20 }} />}
      </Box>

      <Box sx={{ p: 1.3, borderRadius: "8px", bgcolor: "#F8FBFA", border: `1px solid ${C.border}` }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 1.3 }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.text }}>Enter 6-digit OTP</Typography>
            <Typography sx={{ fontSize: 10, color: C.muted, mt: 0.3 }}>
              {verified ? "Verification completed" : sent ? "Enter the code sent to you" : "Send OTP to enable the boxes"}
            </Typography>
          </Box>
          {sent && !verified && (
            <Typography sx={{ fontSize: 10, color: timer.seconds > 0 ? C.muted : C.primary, fontWeight: 600 }}>
              {timer.seconds > 0 ? `Resend in ${formatTime(timer.seconds)}` : "You can resend OTP"}
            </Typography>
          )}
        </Box>

        {!verified && destinationValid && (
          <>
            {sent && (
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                <OtpBoxes otp={otp} setOtp={setOtp} disabled={busy || expiryTimer.seconds <= 0 || attempts >= maxAttempts} prefix={prefix} />
                <Button
                  variant="contained" onClick={onVerify}
                  disabled={busy || expiryTimer.seconds <= 0 || attempts >= maxAttempts || otp.length !== 6}
                  sx={{ height: 42, minWidth: 100, bgcolor: C.primary, borderRadius: "8px", boxShadow: "none", textTransform: "none", fontSize: 11, fontWeight: 700, "&:hover": { bgcolor: C.hover, boxShadow: "none" } }}
                >
                  {verifying ? <CircularProgress size={16} color="inherit" /> : "Verify OTP"}
                </Button>
              </Box>
            )}
            <Button
              variant="text" onClick={onSend}
              disabled={busy || timer.seconds > 0 || !destinationValid || !serviceAvailable}
              sx={{ mt: 1, p: 0, minWidth: 0, fontSize: 11, fontWeight: 700, textTransform: "none", color: C.primary }}
            >
              {sending ? <CircularProgress size={15} color="inherit" /> : sent && timer.seconds > 0 ? `Resend OTP in ${formatTime(timer.seconds)}` : sent ? "Resend OTP" : "Send OTP"}
            </Button>
            {!serviceAvailable && <Typography sx={{ mt: 0.6, fontSize: 10, color: C.muted }}>Verification service is not configured.</Typography>}
            {sent && expiryTimer.seconds <= 0 && <Typography sx={{ mt: 0.6, fontSize: 10, color: "#A16207" }}>OTP expired. Request a new code.</Typography>}
            {sent && attempts > 0 && attempts < maxAttempts && <Typography sx={{ mt: 0.6, fontSize: 10, color: C.muted }}>{maxAttempts - attempts} verification attempts remaining.</Typography>}
            {attempts >= maxAttempts && <Typography sx={{ mt: 0.6, fontSize: 10, color: C.primary }}>Attempt limit reached. Request a new code after the resend timer.</Typography>}
          </>
        )}

        {verified && (
          <Alert severity="success" icon={<VerifiedOutlinedIcon fontSize="small" />} sx={{ py: 0, borderRadius: "8px", bgcolor: C.light, color: C.primary, "& .MuiAlert-message": { fontSize: 11 } }}>
            {title} verified successfully.
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default function Verification({
  data = {}, uploadedDocuments = {}, onSendOtp, onVerifyOtp, onSendMobileOtp, onVerifyMobileOtp,
  onSendPharmacistOtp, onVerifyPharmacistOtp, onBack, onSubmit, loading = false,
}) {
  const email = String(data.storeEmail || data.email || "").trim().toLowerCase();
  const mobile = normalizeMobile(data.storePhone || data.mobileNumber || data.phoneNumber || data.mobile || data.phone || "");
  const pharmacistMobile = normalizeMobile(data.pharmacistPhone || "");

  const [emailOtp, setEmailOtp] = React.useState("");
  const [mobileOtp, setMobileOtp] = React.useState("");
  const [pharmacistOtp, setPharmacistOtp] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);
  const [mobileSent, setMobileSent] = React.useState(false);
  const [pharmacistOtpSent, setPharmacistOtpSent] = React.useState(false);
  const [emailVerified, setEmailVerified] = React.useState(data.storeEmailVerified === true);
  const [mobileVerified, setMobileVerified] = React.useState(data.storePhoneVerified === true || data.mobileVerified === true);
  const [pharmacistPhoneVerified, setPharmacistPhoneVerified] = React.useState(data.pharmacistPhoneVerified === true);
  const [emailAttempts, setEmailAttempts] = React.useState(0);
  const [mobileAttempts, setMobileAttempts] = React.useState(0);
  const [pharmacistAttempts, setPharmacistAttempts] = React.useState(0);
  const [declarations, setDeclarations] = React.useState(Object.fromEntries(DECLARATIONS.map(({ key }) => [key, false])));
  const [sendingEmail, setSendingEmail] = React.useState(false);
  const [sendingMobile, setSendingMobile] = React.useState(false);
  const [verifyingEmail, setVerifyingEmail] = React.useState(false);
  const [verifyingMobile, setVerifyingMobile] = React.useState(false);
  const [sendingPharmacistOtp, setSendingPharmacistOtp] = React.useState(false);
  const [verifyingPharmacistOtp, setVerifyingPharmacistOtp] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Declare timers before effects that use them.
  const emailTimer = useResendTimer();
  const mobileTimer = useResendTimer();
  const emailExpiryTimer = useResendTimer();
  const mobileExpiryTimer = useResendTimer();
  const pharmacistTimer = useResendTimer();
  const pharmacistExpiryTimer = useResendTimer();

  React.useEffect(() => {
    if (data.storeEmailVerified === true) {
      setEmailVerified(true); setEmailSent(false); setEmailOtp("");
      emailTimer.reset(); emailExpiryTimer.reset();
    }
  }, [data.storeEmailVerified, emailTimer.reset, emailExpiryTimer.reset]);

  React.useEffect(() => {
    if (data.storePhoneVerified === true || data.mobileVerified === true) {
      setMobileVerified(true); setMobileSent(false); setMobileOtp("");
      mobileTimer.reset(); mobileExpiryTimer.reset();
    }
  }, [data.storePhoneVerified, data.mobileVerified, mobileTimer.reset, mobileExpiryTimer.reset]);

  React.useEffect(() => {
    if (data.pharmacistPhoneVerified === true) {
      setPharmacistPhoneVerified(true); setPharmacistOtpSent(false); setPharmacistOtp("");
      pharmacistTimer.reset(); pharmacistExpiryTimer.reset();
    }
  }, [data.pharmacistPhoneVerified, pharmacistTimer.reset, pharmacistExpiryTimer.reset]);

  const previous = React.useRef({ email, mobile, pharmacistMobile });
  React.useEffect(() => {
    if (previous.current.email !== email) {
      previous.current.email = email; setEmailOtp(""); setEmailSent(false);
      setEmailVerified(data.storeEmailVerified === true); setEmailAttempts(0);
      emailTimer.reset(); emailExpiryTimer.reset();
    }
    if (previous.current.mobile !== mobile) {
      previous.current.mobile = mobile; setMobileOtp(""); setMobileSent(false);
      setMobileVerified(data.storePhoneVerified === true || data.mobileVerified === true); setMobileAttempts(0);
      mobileTimer.reset(); mobileExpiryTimer.reset();
    }
    if (previous.current.pharmacistMobile !== pharmacistMobile) {
      previous.current.pharmacistMobile = pharmacistMobile; setPharmacistOtp(""); setPharmacistOtpSent(false);
      setPharmacistPhoneVerified(data.pharmacistPhoneVerified === true); setPharmacistAttempts(0);
      pharmacistTimer.reset(); pharmacistExpiryTimer.reset();
    }
  }, [email, mobile, pharmacistMobile, data.storeEmailVerified, data.storePhoneVerified, data.mobileVerified, data.pharmacistPhoneVerified, emailTimer.reset, mobileTimer.reset, emailExpiryTimer.reset, mobileExpiryTimer.reset, pharmacistTimer.reset, pharmacistExpiryTimer.reset]);

  const busy = loading || submitting || sendingEmail || sendingMobile || sendingPharmacistOtp || verifyingEmail || verifyingMobile || verifyingPharmacistOtp;
  const allDeclarationsAccepted = Object.values(declarations).every(Boolean);
  const clearError = () => setError("");

  const missingFields = [
    ["licensedTradeName", "Licensed trade name"], ["legalEntityName", "Legal entity name"],
    ["entityType", "Entity type"], ["storeEmail", "Store email"], ["storePhone", "Store phone"],
    ["signatoryFullName", "Authorized signatory name"], ["signatoryDesignation", "Authorized signatory designation"],
    ["signatoryEmail", "Authorized signatory email"], ["signatoryPhone", "Authorized signatory phone"],
    ["shopUnit", "Shop/unit"], ["street", "Street"], ["cityDistrict", "City/district"],
    ["state", "State"], ["pinCode", "PIN code"], ["drugLicenseNumber", "Drug license number"],
    ["licenseExpiryDate", "Drug license expiry date"], ["issuingAuthority", "Drug license issuing authority"],
    ["form20Number", "Form 20 number"], ["form20GrantDate", "Form 20 grant date"],
    ["retentionDueDate", "Retention due date"], ["pharmacistFullName", "Pharmacist name"],
    ["registrationNumber", "Pharmacist registration number"], ["statePharmacyCouncil", "State Pharmacy Council"],
    ["registrationValidityDate", "Pharmacist registration validity date"], ["employmentType", "Pharmacist employment type"],
    ["pharmacistPhone", "Pharmacist phone"],
  ].filter(([field]) => !String(data[field] || "").trim()).map(([, label]) => label);

  if (data.collectPayments && !String(data.gstin || "").trim()) missingFields.push("GSTIN (required for platform payment collection)");
  if (data.shopEstablishmentApplicable && !String(data.shopEstablishmentNumber || "").trim()) missingFields.push("Shop & Establishment number");

  const documentData = { ...data, ...uploadedDocuments, ...(data.uploadedDocuments || {}) };
  const missingDocuments = PHARMACY_DOCUMENTS
    .filter(({ field }) => isPharmacyDocumentRequired(field, documentData) && !documentData[field])
    .map(({ label }) => label);

  const unverifiedContacts = [
    ...(isValidEmail(email) && !emailVerified ? ["Store email"] : []),
  ];
  const submissionIssues = [
    ...missingFields.map((label) => `Missing information: ${label}`),
    ...missingDocuments.map((label) => `Missing document: ${label}`),
    ...unverifiedContacts.map((label) => `Unverified contact: ${label}`),
    ...(!allDeclarationsAccepted ? ["Required declarations are incomplete"] : []),
  ];
  if (email && !isValidEmail(email)) submissionIssues.push("Invalid store email address");
  if (mobile && !isValidMobile(mobile)) submissionIssues.push("Invalid store mobile number");
  if (pharmacistMobile && !isValidMobile(pharmacistMobile)) submissionIssues.push("Invalid pharmacist phone number");

  const updateDeclaration = (key, checked) => {
    setDeclarations((prev) => ({ ...prev, [key]: checked }));
    clearError();
  };

  const sendOtp = async ({ kind, valid, destination, send, setSending, setOtp, setSent, setVerified, timer, expiry, setAttempts, label }) => {
    if (busy || timer.seconds > 0) return;
    if (!valid) { setError(`Enter a valid ${label} before requesting OTP.`); return; }
    if (typeof send !== "function") { setError(`${label} OTP service is not connected.`); return; }
    try {
      clearError(); setSending(true);
      const result = await send(destination);
      if (!serverConfirmed(result)) throw new Error(`The server did not confirm that the ${label} OTP was sent.`);
      setOtp(""); setSent(true); setVerified(false); setAttempts(0);
      timer.start(); expiry.start(OTP_EXPIRY_SECONDS);
    } catch (err) { setError(getErrorMessage(err, `Unable to send the ${label} OTP.`)); }
    finally { setSending(false); }
  };

  const verifyOtp = async ({ otp, sent, expiry, attempts, setAttempts, setVerifying, verify, destination, setVerified, setOtp, timer, resendTimer, label }) => {
    if (busy) return;
    if (!sent || expiry.seconds <= 0 || otp.length !== 6) { setError(`Please enter the complete, unexpired 6-digit ${label} OTP.`); return; }
    if (attempts >= MAX_OTP_ATTEMPTS) { setError(`The ${label} OTP attempt limit has been reached. Request a new code.`); return; }
    if (typeof verify !== "function") { setError(`${label} OTP verification service is not connected.`); return; }
    try {
      clearError(); setVerifying(true);
      const result = await verify(destination);
      if (!serverConfirmed(result)) throw new Error(`The server did not confirm ${label} verification.`);
      setVerified(true); setOtp(""); timer.reset(); expiry.reset(); resendTimer?.reset();
    } catch (err) {
      setAttempts((prev) => prev + 1);
      setError(getErrorMessage(err, `Invalid or expired ${label} OTP.`));
    } finally { setVerifying(false); }
  };

  const handleSendEmail = () => sendOtp({
    kind: "email", valid: isValidEmail(email), destination: { email }, send: onSendOtp,
    setSending: setSendingEmail, setOtp: setEmailOtp, setSent: setEmailSent, setVerified: setEmailVerified,
    timer: emailTimer, expiry: emailExpiryTimer, setAttempts: setEmailAttempts, label: "email",
  });
  const handleVerifyEmail = () => verifyOtp({
    otp: emailOtp, sent: emailSent, expiry: emailExpiryTimer, attempts: emailAttempts, setAttempts: setEmailAttempts,
    setVerifying: setVerifyingEmail, verify: onVerifyOtp, destination: { email, otp: emailOtp },
    setVerified: setEmailVerified, setOtp: setEmailOtp, timer: emailTimer, label: "email",
  });
  const handleSendMobile = () => sendOtp({
    kind: "mobile", valid: isValidMobile(mobile), destination: { mobileNumber: mobile, countryCode: "+91" }, send: onSendMobileOtp,
    setSending: setSendingMobile, setOtp: setMobileOtp, setSent: setMobileSent, setVerified: setMobileVerified,
    timer: mobileTimer, expiry: mobileExpiryTimer, setAttempts: setMobileAttempts, label: "mobile",
  });
  const handleVerifyMobile = () => verifyOtp({
    otp: mobileOtp, sent: mobileSent, expiry: mobileExpiryTimer, attempts: mobileAttempts, setAttempts: setMobileAttempts,
    setVerifying: setVerifyingMobile, verify: onVerifyMobileOtp, destination: { mobileNumber: mobile, countryCode: "+91", otp: mobileOtp },
    setVerified: setMobileVerified, setOtp: setMobileOtp, timer: mobileTimer, label: "mobile",
  });
  const handleSendPharmacist = () => sendOtp({
    kind: "pharmacist phone", valid: isValidMobile(pharmacistMobile), destination: { mobileNumber: pharmacistMobile, countryCode: "+91" }, send: onSendPharmacistOtp,
    setSending: setSendingPharmacistOtp, setOtp: setPharmacistOtp, setSent: setPharmacistOtpSent, setVerified: setPharmacistPhoneVerified,
    timer: pharmacistTimer, expiry: pharmacistExpiryTimer, setAttempts: setPharmacistAttempts, label: "pharmacist phone",
  });
  const handleVerifyPharmacist = () => verifyOtp({
    otp: pharmacistOtp, sent: pharmacistOtpSent, expiry: pharmacistExpiryTimer, attempts: pharmacistAttempts, setAttempts: setPharmacistAttempts,
    setVerifying: setVerifyingPharmacistOtp, verify: onVerifyPharmacistOtp, destination: { mobileNumber: pharmacistMobile, countryCode: "+91", otp: pharmacistOtp },
    setVerified: setPharmacistPhoneVerified, setOtp: setPharmacistOtp, timer: pharmacistTimer, label: "pharmacist phone",
  });

  const handleSubmit = async () => {
    if (busy) return;
    if (!isValidEmail(email) || !isValidMobile(mobile)) { setError("Email or mobile details are missing or invalid."); return; }
    if (submissionIssues.length) { setError("Complete the items listed below before submitting."); return; }
    if (typeof onSubmit !== "function") { setError("Registration submit action is not connected."); return; }
    try {
      clearError(); setSubmitting(true);
      await onSubmit({
        email, mobileNumber: mobile, countryCode: "+91",
        emailVerified, mobileVerified, pharmacistPhoneVerified,
        declarationAccepted: true, declarations,
      });
    } catch (err) { setError(getErrorMessage(err, "Unable to submit registration.")); }
    finally { setSubmitting(false); }
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", bgcolor: C.white, py: 2, px: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.2, mb: 2 }}>
        <GppGoodOutlinedIcon sx={{ color: C.primary, fontSize: 27 }} />
        <Box>
          <Typography sx={{ fontSize: { xs: 14, sm: 18 }, fontWeight: 750, color: C.text }}>Verification & Declaration</Typography>
          <Typography sx={{ mt: 0.3, fontSize: 11, color: C.muted }}>Verify the details entered in the previous step.</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 2, borderRadius: "8px", "& .MuiAlert-message": { fontSize: 11 } }}>{error}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 2, mb: 2, width: "100%" }}>
        <VerificationSection
          title="Email Verification" subtitle="A verification code will be sent to your registered email."
          Icon={MarkEmailReadOutlinedIcon} destination={emailSent || emailVerified ? maskEmail(email) : email || "Email not available"}
          destinationValid={isValidEmail(email)} serviceAvailable={typeof onSendOtp === "function" && typeof onVerifyOtp === "function"}
          sent={emailSent} verified={emailVerified} otp={emailOtp} setOtp={setEmailOtp} timer={emailTimer} expiryTimer={emailExpiryTimer}
          attempts={emailAttempts} maxAttempts={MAX_OTP_ATTEMPTS} sending={sendingEmail} verifying={verifyingEmail} busy={busy}
          onSend={handleSendEmail} onVerify={handleVerifyEmail} prefix="email"
        />

      </Box>

      {submissionIssues.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "9px" }}>
          <Typography sx={{ mb: 0.5, fontSize: 12, fontWeight: 700 }}>Complete these items before submitting:</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 11 }}>{submissionIssues.map((issue) => <li key={issue}>{issue}</li>)}</Box>
        </Alert>
      )}

      <Box sx={{ display: "block", width: "100%", boxSizing: "border-box", p: { xs: 1.5, sm: 2 }, border: `1px solid ${C.border}`, borderRadius: "10px", mb: 2, bgcolor: "background.paper" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.text, mb: 1 }}>Declaration</Typography>
        {DECLARATIONS.map((item) => (
          <Box key={item.key} sx={{ display: "flex", alignItems: "flex-start", gap: 0.7, mb: 0.5, width: "100%" }}>
            <Checkbox
              checked={Boolean(declarations[item.key])}
              onChange={(event) => updateDeclaration(item.key, event.target.checked)}
              disabled={busy} size="small"
              sx={{ p: 0.4, mt: 0.1, flexShrink: 0, color: C.primary, "&.Mui-checked": { color: C.primary }, "& .MuiSvgIcon-root": { fontSize: 18 }, "& .MuiTouchRipple-root": { display: "none" } }}
            />
            <Typography onClick={() => { if (!busy) updateDeclaration(item.key, !declarations[item.key]); }}
              sx={{ pt: 0.4, flex: 1, minWidth: 0, fontSize: 11, lineHeight: 1.7, color: C.muted, cursor: busy ? "default" : "pointer", overflowWrap: "anywhere" }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
        <Button variant="outlined" onClick={onBack} disabled={busy}
          sx={{ minHeight: 42, borderColor: C.border, color: C.text, borderRadius: "8px", textTransform: "none", fontSize: 12 }}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={busy || submissionIssues.length > 0}
          startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : <VerifiedOutlinedIcon />}
          sx={{ minHeight: 42, px: 2.5, bgcolor: C.primary, borderRadius: "8px", boxShadow: "none", textTransform: "none", fontSize: 12, fontWeight: 700, "&:hover": { bgcolor: C.hover, boxShadow: "none" } }}>
          {submitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </Box>
    </Box>
  );
}
