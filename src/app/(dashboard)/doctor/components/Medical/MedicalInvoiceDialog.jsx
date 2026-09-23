import { Box, Dialog, Typography } from "@mui/material";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function MedicalInvoiceDialog({ open, onClose, selectedPatient, stores, rows, invoiceSummary }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 0,
          overflow: "hidden",
          background: "#eef1f4",
          boxShadow: "none",
          maxHeight: "92vh",
        },
      }}
    >
      <Box sx={{ background: "#eef1f4", maxHeight: "92vh", overflowY: "auto" }}>
        <Box sx={{ background: "#0d4a8d", color: "#fff", px: 3, py: 2 }}>
          <Typography sx={{ fontSize: "42px", fontWeight: 800, lineHeight: 1.1 }}>
            Medical Invoice
          </Typography>
        </Box>

        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 700, mb: 1, color: "#123f66" }}>
                Patient Information
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#09314f" }}>
                {selectedPatient.name}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>080 789 67 56</Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>14 Rosewood Drive</Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>Collinwood, NY 134</Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 700, mb: 1, color: "#123f66" }}>
                Prescribing Physician&apos;s Information
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#09314f" }}>
                Dr. Hanaa Pease
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>080 789 67 56</Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>67 Trope Street</Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>Collinwood, NY 345</Typography>
            </Box>
          </Box>

          <Box sx={{ border: "1px solid #0d4a8d", background: "rgba(255,255,255,0.3)", mb: 3 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(100px, 1fr))", borderBottom: "1px solid #0d4a8d" }}>
              {[
                ["Invoice Number", "MED-2026-001"],
                ["Date", new Date().toLocaleDateString("en-GB")],
                ["Invoice Due Date", "24/09/22"],
                ["Price", formatCurrency(invoiceSummary.finalTotal)],
              ].map(([label, value], idx) => (
                <Box key={label} sx={{ p: 1.5, borderRight: idx < 3 ? "1px solid #0d4a8d" : "none" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#123f66", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", mt: 0.5 }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ border: "1px solid #0d4a8d", overflow: "hidden", mb: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 2.2fr 0.8fr", background: "#0d4a8d", color: "#fff" }}>
              <Typography sx={{ p: 1.5, fontWeight: 800, borderRight: "1px solid rgba(255,255,255,.35)" }}>Item</Typography>
              <Typography sx={{ p: 1.5, fontWeight: 800, borderRight: "1px solid rgba(255,255,255,.35)" }}>Description</Typography>
              <Typography sx={{ p: 1.5, fontWeight: 800 }}>Price</Typography>
            </Box>

            {rows.map((row, index) => (
              <Box key={row.id || index} sx={{ display: "grid", gridTemplateColumns: "1.2fr 2.2fr 0.8fr", borderBottom: "1px solid #0d4a8d" }}>
                <Typography sx={{ p: 1.5, color: "#0f172a", borderRight: "1px solid #0d4a8d" }}>{row.medicineName || "Medicine"}</Typography>
                <Typography sx={{ p: 1.5, color: "#0f172a", borderRight: "1px solid #0d4a8d" }}>
                  {row.quantity} item(s) from {stores.find((store) => Number(store.id) === Number(row.storeId))?.name || "selected store"}
                </Typography>
                <Typography sx={{ p: 1.5, color: "#0f172a", fontWeight: 700 }}>{formatCurrency(row.amount)}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 2, alignItems: "flex-end" }}>
            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#123f66", mb: 1 }}>Notes</Typography>
              <Typography sx={{ fontSize: "14px", color: "#334155" }}>
                Online service for monitoring your health!
              </Typography>
            </Box>

            <Box sx={{ border: "1px solid #0d4a8d", p: 2, background: "rgba(255,255,255,0.2)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ color: "#123f66", fontWeight: 700 }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(invoiceSummary.subtotal)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ color: "#123f66", fontWeight: 700 }}>Discount</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(invoiceSummary.discount)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ color: "#123f66", fontWeight: 700 }}>Tax rate</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(invoiceSummary.tax)}</Typography>
              </Box>
              <Box sx={{ borderTop: "1px solid #0d4a8d", pt: 1.5, mt: 1.5, display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#ef4444", fontWeight: 900, fontSize: "22px" }}>TOTAL</Typography>
                <Typography sx={{ color: "#ef4444", fontWeight: 900, fontSize: "22px" }}>{formatCurrency(invoiceSummary.finalTotal)}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, borderTop: "1px solid rgba(13,74,141,0.35)", pt: 2 }}>
            <Box>
              <Typography sx={{ color: "#123f66", fontSize: "14px", lineHeight: 1.4 }}>
                Online consultations 24/7
                <br />
                Laboratories
                <br />
                Delivery of medicines
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "#0d4a8d", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900 }}>
                +
              </Box>
              <Typography sx={{ fontSize: "26px", fontWeight: 900, color: "#0d4a8d", letterSpacing: "0.04em" }}>
                HARRIS HEALTH
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
