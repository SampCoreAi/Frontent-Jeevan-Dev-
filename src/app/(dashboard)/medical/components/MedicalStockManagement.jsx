"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddCircleOutline,
  AssignmentReturnOutlined,
  EventBusyOutlined,
  Inventory2Outlined,
  PictureAsPdfOutlined,
  ProductionQuantityLimitsOutlined,
  SearchOutlined,
  ShoppingCartCheckoutOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";

const stockRows = [
  {
    name: "Augmentin 625 Duo",
    salt: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    type: "Antibiotic / Systemic",
    location: "Rack A1 • Main Bay",
    batch: "LOT-48291 / Cipla Ltd.",
    quantity: 128,
    buffer: 180,
    expiry: "25 Jun 2027",
    price: "₹420 / ₹612",
    sold: "92 / 160",
    status: "critical",
    tag: "Rx Sch H",
  },
  {
    name: "Dolo 650",
    salt: "Paracetamol 650mg",
    type: "Analgesic / Antipyretic",
    location: "Rack B3 • Pain Care",
    batch: "LOT-77120 / Micro Labs",
    quantity: 540,
    buffer: 240,
    expiry: "14 Sep 2027",
    price: "₹36 / ₹58",
    sold: "210 / 400",
    status: "healthy",
    tag: "OTC",
  },
  {
    name: "Insugen N",
    salt: "Human Insulin Neutral",
    type: "Endocrine / Diabetes",
    location: "Cold Unit 01",
    batch: "LOT-15234 / Novo Nordisk",
    quantity: 86,
    buffer: 120,
    expiry: "08 Apr 2026",
    price: "₹820 / ₹950",
    sold: "64 / 120",
    status: "warning",
    tag: "Cold Chain",
  },
  {
    name: "Atorva 20",
    salt: "Atorvastatin 20mg",
    type: "Cardiovascular / Lipid",
    location: "Rack C4 • Cardiac",
    batch: "LOT-99110 / Sun Pharma",
    quantity: 240,
    buffer: 180,
    expiry: "30 Jul 2027",
    price: "₹210 / ₹295",
    sold: "120 / 220",
    status: "healthy",
    tag: "Rx",
  },
  {
    name: "Pantocid 40",
    salt: "Pantoprazole 40mg",
    type: "GI / Acid Control",
    location: "Rack B1 • GI Care",
    batch: "LOT-30645 / Dr. Reddy's",
    quantity: 74,
    buffer: 90,
    expiry: "18 Nov 2026",
    price: "₹166 / ₹222",
    sold: "42 / 90",
    status: "warning",
    tag: "Rx",
  },
];

export default function MedicalStockManagement() {
  return (
    <Box sx={{ width: "100%", display: "grid", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          gap: 2,
          alignItems: { xs: "flex-start", lg: "center" },
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ color: "#4D5F7B" }}>
            <Typography sx={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
              Pharmacy Operations
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#6E7978" }}>/</Typography>
            <Typography sx={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#005F5B" }}>
              SKU Inventory Master
            </Typography>
            <Chip
              label="दवा रिकॉर्ड"
              size="small"
              sx={{
                bgcolor: "#CBDEFF",
                color: "#354862",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "999px",
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.5, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.15, fontWeight: 800, color: "#0B1C30" }}>
              Medicine Stock &amp; Inventory Ledger
            </Typography>
            <Chip
              label="Live Sync"
              size="small"
              sx={{
                bgcolor: "#99F2EB",
                color: "#00201E",
                fontWeight: 700,
              }}
            />
          </Stack>

          <Typography sx={{ mt: 1, color: "#475569", maxWidth: 760 }}>
            Real-time stock monitor, automated batch lot reconciliation, cold-chain temperature telemetry and dynamic replenishment.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75} flexWrap="wrap">
          <Button size="small" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
            Bulk CSV
          </Button>
          <Button size="small" variant="outlined" startIcon={<PictureAsPdfOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
            Stock PDF
          </Button>
          <Button size="small" variant="contained" startIcon={<ShoppingCartCheckoutOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#FFDDD9", color: "#93000A", boxShadow: "none", minHeight: 36, "&:hover": { bgcolor: "#F7C7C2" } }}>
            Reorder (18)
          </Button>
          <Button size="small" variant="contained" startIcon={<AddCircleOutline />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#005F5B", boxShadow: "none", minHeight: 36, "&:hover": { bgcolor: "#0D7A75" } }}>
            + Add Medicine
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
        {[
          { title: "Active Inventory Valuation", value: "1,428", suffix: "SKUs", note: "₹8,42,500 total net worth", noteColor: "#005F5B", accent: "#005F5B", icon: <Inventory2Outlined />, tag: "+14 batches this wk" },
          { title: "Critical Depletion", value: "18", suffix: "Items under buffer", note: "Calpol · Augmentin · Lantus", noteColor: "#BA1A1A", accent: "#BA1A1A", icon: <ProductionQuantityLimitsOutlined />, tag: "Restock" },
          { title: "Near Expiry (< 60 Days)", value: "12", suffix: "Batches", note: "₹28,400 at shelf risk", noteColor: "#4D5F7B", accent: "#4D5F7B", icon: <EventBusyOutlined />, tag: "Isolate Lots" },
          { title: "Quarantine & Returns", value: "03", suffix: "Credit Pending", note: "Supplier credit ₹4,150", noteColor: "#0B1C30", accent: "#6E7978", icon: <AssignmentReturnOutlined />, tag: "3 Invoices Open" },
        ].map((card) => (
          <Card key={card.title} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 1.75 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.25 }}>
                <Box>
                  <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.10em", textTransform: "uppercase", color: "#64748B", fontWeight: 700 }}>
                    {card.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.75 }}>
                    <Typography sx={{ fontSize: "1.7rem", fontWeight: 800, color: card.accent }}>{card.value}</Typography>
                    <Typography sx={{ fontSize: "0.74rem", color: "#475569", fontWeight: 600 }}>{card.suffix}</Typography>
                  </Stack>
                </Box>
                <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: `${card.accent}20`, color: card.accent }}>
                  {card.icon}
                </Box>
              </Stack>

              <Box sx={{ mt: 0.75, p: 1, borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography sx={{ color: card.noteColor, fontWeight: 700, fontSize: "0.72rem" }}>{card.note}</Typography>
                  <Typography sx={{ color: "#005F5B", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.tag}</Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", lg: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", lg: "center" }}>
              <TextField
                fullWidth
                placeholder="Search medicine name, batch, brand..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined sx={{ color: "#6E7978", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    height: 40,
                    borderRadius: 2,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  },
                }}
                sx={{ maxWidth: { lg: 500 } }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", lg: "auto" } }}>
                <Select defaultValue="All Therapeutic Classes" size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 180 }, borderRadius: 2, background: "#F8FAFC" }}>
                  <MenuItem value="All Therapeutic Classes">All Therapeutic Classes</MenuItem>
                  <MenuItem value="Antibiotics & Antimicrobials">Antibiotics &amp; Antimicrobials</MenuItem>
                  <MenuItem value="Cardiovascular & Hypertension">Cardiovascular &amp; Hypertension</MenuItem>
                  <MenuItem value="Endocrine & Diabetes">Endocrine &amp; Diabetes</MenuItem>
                </Select>

                <Select defaultValue="All Locations / Racks" size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 180 }, borderRadius: 2, background: "#F8FAFC" }}>
                  <MenuItem value="All Locations / Racks">All Locations / Racks</MenuItem>
                  <MenuItem value="Rack A1 - Main Bay">Rack A1 - Main Bay</MenuItem>
                  <MenuItem value="Rack B3 - Bulk Solids">Rack B3 - Bulk Solids</MenuItem>
                  <MenuItem value="Cold Unit 01">Cold Unit 01</MenuItem>
                </Select>

                <Select defaultValue="Expiry: All Schedules" size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 170 }, borderRadius: 2, background: "#F8FAFC" }}>
                  <MenuItem value="Expiry: All Schedules">Expiry: All Schedules</MenuItem>
                  <MenuItem value="Expiring < 30 Days">Expiring &lt; 30 Days</MenuItem>
                  <MenuItem value="Expiring < 60 Days">Expiring &lt; 60 Days</MenuItem>
                  <MenuItem value="Safe Shelf Life">Safe Shelf Life</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {[
                  ["Critical Stock (< 20%)", "#FDE8E8", "#BA1A1A"],
                  ["Near Expiry (< 60D)", "#E7F0FF", "#4D5F7B"],
                  ["Schedule H / H1 Monitored", "#E0F2F1", "#005F5B"],
                  ["Cold Storage Only", "#E6F0FF", "#005F5B"],
                ].map(([label, bg, color]) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    sx={{
                      bgcolor: bg,
                      color,
                      fontWeight: 700,
                      borderRadius: "999px",
                      px: 0.5,
                    }}
                  />
                ))}
              </Stack>

              <Typography sx={{ fontSize: "0.74rem", color: "#4D5F7B", fontWeight: 600 }}>
                Active Warehouse: <Box component="span" sx={{ color: "#0B1C30", fontWeight: 800 }}>South Central Hub #01</Box>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1180 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                <TableCell padding="checkbox" sx={{ width: 36, py: 1.25 }}>
                  <Box component="input" type="checkbox" sx={{ width: 14, height: 14, accentColor: "#005F5B" }} />
                </TableCell>
                <TableCell sx={{ minWidth: 260, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Medicine Name &amp; Generic Formulation</TableCell>
                <TableCell sx={{ minWidth: 170, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Therapy Class &amp; Bay</TableCell>
                <TableCell sx={{ minWidth: 185, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Batch / Lot &amp; Manufacturer</TableCell>
                <TableCell sx={{ minWidth: 200, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>On-Hand Quantity &amp; Buffer</TableCell>
                <TableCell sx={{ minWidth: 170, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Expiry &amp; Safety</TableCell>
                <TableCell align="right" sx={{ minWidth: 150, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Pricing</TableCell>
                <TableCell align="center" sx={{ minWidth: 110, py: 1.25, fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockRows.map((row) => (
                <TableRow key={row.name} hover sx={{ backgroundColor: row.status === "critical" ? "#FFF7F7" : "transparent", height: 88 }}>
                  <TableCell padding="checkbox" sx={{ py: 1.25 }}>
                    <Box component="input" type="checkbox" sx={{ width: 14, height: 14, accentColor: "#005F5B" }} />
                  </TableCell>
                  <TableCell sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: row.status === "critical" ? "#FDE8E8" : "#EAF1FF", color: row.status === "critical" ? "#BA1A1A" : "#005F5B" }}>
                        <Inventory2Outlined sx={{ fontSize: 18 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography sx={{ fontWeight: 800, color: "#0B1C30", fontSize: "0.9rem" }}>{row.name}</Typography>
                          <Chip label={row.tag} size="small" sx={{ bgcolor: row.status === "critical" ? "#FDE8E8" : "#EAF1FF", color: row.status === "critical" ? "#BA1A1A" : "#005F5B", fontWeight: 700, borderRadius: 1, height: 20, fontSize: "0.62rem" }} />
                        </Stack>
                        <Typography sx={{ color: "#475569", fontSize: "0.68rem", mt: 0.25, lineHeight: 1.4 }}>{row.salt}</Typography>
                        <Typography sx={{ color: "#6E7978", fontSize: "0.64rem", mt: 0.15 }}>NDC: 0029-6086-12 • Barcode: 8901117281920</Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 1.25 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30", fontSize: "0.8rem" }}>{row.type}</Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.72rem", mt: 0.2 }}>{row.location}</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.25 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30", fontSize: "0.8rem" }}>{row.batch}</Typography>
                    <Typography sx={{ color: "#6E7978", fontSize: "0.68rem", mt: 0.2 }}>Batch lot verified</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.25 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
                      <Typography sx={{ fontWeight: 800, color: row.status === "critical" ? "#BA1A1A" : row.status === "warning" ? "#B45309" : "#0F766E", fontSize: "0.92rem" }}>{row.quantity}</Typography>
                      <Typography sx={{ color: "#64748B", fontSize: "0.7rem" }}>buffer {row.buffer}</Typography>
                    </Stack>
                    <Box sx={{ mt: 0.75, height: 7, borderRadius: 999, bgcolor: "#E2E8F0", overflow: "hidden" }}>
                      <Box sx={{ width: `${Math.min((row.quantity / row.buffer) * 100, 100)}%`, height: "100%", bgcolor: row.status === "critical" ? "#BA1A1A" : row.status === "warning" ? "#F59E0B" : "#0F766E", borderRadius: 999 }} />
                    </Box>
                    <Typography sx={{ color: "#64748B", fontSize: "0.64rem", mt: 0.4 }}>{row.sold} sold</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.25 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30", fontSize: "0.8rem" }}>{row.expiry}</Typography>
                    <Chip
                      label={row.status === "critical" ? "Critical" : row.status === "warning" ? "Watch" : "Healthy"}
                      size="small"
                      sx={{
                        mt: 0.75,
                        bgcolor: row.status === "critical" ? "#FEE2E2" : row.status === "warning" ? "#FEF3C7" : "#DCFCE7",
                        color: row.status === "critical" ? "#991B1B" : row.status === "warning" ? "#92400E" : "#166534",
                        fontWeight: 700,
                        height: 22,
                        fontSize: "0.62rem",
                      }}
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ py: 1.25 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30", fontSize: "0.82rem" }}>{row.price}</Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 1.25 }}>
                    <Stack direction="row" spacing={0.75} justifyContent="center">
                      <Button variant="outlined" size="small" sx={{ minWidth: 0, px: 1.15, py: 0.45, borderRadius: 1.5, textTransform: "none", fontWeight: 700, fontSize: "0.72rem" }}>
                        Edit
                      </Button>
                      <Button variant="contained" size="small" sx={{ minWidth: 0, px: 1.15, py: 0.45, borderRadius: 1.5, textTransform: "none", fontWeight: 700, bgcolor: "#005F5B", boxShadow: "none", fontSize: "0.72rem", "&:hover": { bgcolor: "#0D7A75" } }}>
                        Refill
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
