"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  AddOutlined,
  AssessmentOutlined,
  CalendarTodayOutlined,
  CheckCircleOutline,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  DownloadOutlined,
  FirstPageOutlined,
  LastPageOutlined,
  LocalShippingOutlined,
  PointOfSaleOutlined,
  PrintOutlined,
  SearchOutlined,
  SmartphoneOutlined,
  MedicalServicesOutlined,
  StorefrontOutlined,
  VisibilityOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";

const ledgerRows = [
  {
    id: "#INV-2024-8842",
    time: "Today • 11:42 AM",
    channel: "Doctor Rx Sent",
    channelColor: "#EAF1FF",
    channelText: "#005F5B",
    category: "doctor",
    patient: "Rajesh Sharma",
    phone: "+91 98112-40192",
    doctor: "Dr. Anita Verma",
    items: ["Telmisartan 40mg ×30", "Augmentin 625 ×10"],
    amount: "₹1,034.00",
    payment: "UPI Paid",
    status: "Dispensed",
    statusColor: "#EAF1FF",
    statusText: "#005F5B",
    action: "view",
  },
  {
    id: "#INV-2024-8841",
    time: "Today • 11:35 AM",
    channel: "Patient App Order",
    channelColor: "#E0F2F1",
    channelText: "#005F5B",
    category: "app",
    patient: "Pooja Mehra",
    phone: "+91 97723-11820",
    doctor: "Dr. S. K. Bose",
    items: ["Calpol 650mg ×15", "Vitamin D3 60k ×4", "Benadryl Syrup ×1"],
    amount: "₹480.00",
    payment: "App Pre-paid",
    status: "Out for Delivery",
    statusColor: "#E7F0FF",
    statusText: "#4D5F7B",
    action: "shipping",
  },
  {
    id: "#INV-2024-8840",
    time: "Today • 11:28 AM",
    channel: "Walk-in Store Purchase",
    channelColor: "#F1F5F9",
    channelText: "#005F5B",
    category: "walkin",
    patient: "Amit Kumar",
    phone: "+91 99881-22319",
    doctor: "Self / OTC",
    items: ["Pan-D Capsule ×10", "ORS Prolyte ×4", "Digene Gel ×1"],
    amount: "₹265.00",
    payment: "Cash Paid",
    status: "Completed",
    statusColor: "#EAF1FF",
    statusText: "#005F5B",
    action: "view",
  },
  {
    id: "#INV-2024-8839",
    time: "Today • 11:15 AM",
    channel: "Doctor Rx Sent",
    channelColor: "#EAF1FF",
    channelText: "#005F5B",
    category: "doctor",
    patient: "Harpreet Kaur",
    phone: "+91 94170-88219",
    doctor: "Dr. Rajesh Kapoor",
    items: ["Insulin Lantus Solostar ×2", "Accu-Chek Strips 50s ×1"],
    amount: "₹2,150.00",
    payment: "Card Swipe",
    status: "Dispensed",
    statusColor: "#EAF1FF",
    statusText: "#005F5B",
    action: "view",
  },
  {
    id: "#INV-2024-8838",
    time: "Today • 10:52 AM",
    channel: "Patient App Order",
    channelColor: "#E0F2F1",
    channelText: "#005F5B",
    category: "app",
    patient: "Vikram Singh",
    phone: "+91 98991-03912",
    doctor: "Dr. N. C. Singhal",
    items: ["Glycomet-GP 2 Forte ×40", "Januvia 100mg ×14"],
    amount: "₹720.00",
    payment: "Pay on Pickup",
    status: "Packed & Ready",
    statusColor: "#F1F5F9",
    statusText: "#4D5F7B",
    action: "check",
  },
  {
    id: "#INV-2024-8837",
    time: "Today • 10:40 AM",
    channel: "Walk-in Store Purchase",
    channelColor: "#F1F5F9",
    channelText: "#005F5B",
    category: "walkin",
    patient: "Sunita Devi",
    phone: "+91 98103-99214",
    doctor: "Self / OTC",
    items: ["Crepe Bandage 10cm ×1", "Volini Pain Gel 50g ×1", "Paracetamol 500 ×10"],
    amount: "₹340.00",
    payment: "UPI GPay",
    status: "Completed",
    statusColor: "#EAF1FF",
    statusText: "#005F5B",
    action: "view",
  },
];

const kpis = [
  { title: "Doctor e-Rx Orders", value: "342", amount: "₹2,45,800", percent: "32.4% Volume", accent: "#005F5B", icon: <MedicalServicesOutlined />, badge: "Clinic Synced" },
  { title: "Patient App Orders", value: "189", amount: "₹1,12,450", percent: "17.9% Volume", accent: "#4D5F7B", icon: <SmartphoneOutlined />, badge: "Mobile / Delivery" },
  { title: "Walk-in Purchases", value: "524", amount: "₹3,88,200", percent: "49.7% Volume", accent: "#005F5B", icon: <PointOfSaleOutlined />, badge: "OTC & Storefront" },
  { title: "Reconciled Daily Total", value: "₹7,46,450", amount: "1,055 Fulfilled Records", percent: "100% Audited", accent: "#005F5B", icon: <AssessmentOutlined />, badge: "Gross Revenue" },
];

const tabs = [
  { label: "All Dispenses", value: "all", count: "1,055" },
  { label: "Doctor e-Prescriptions", value: "doctor", count: "342" },
  { label: "Patient App Orders", value: "app", count: "189" },
  { label: "Walk-in Counter", value: "walkin", count: "524" },
];

export default function MedicalReports({ reports = [], loading = false, filters, page = 1, pageSize = 6, onPageChange }) {
  const totalRows = ledgerRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const visibleRows = ledgerRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Box sx={{ width: "100%", display: "grid", gap: 2.5 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
            Pharmacy Operations
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 800, color: "#0B1C30", lineHeight: 1.15 }}>
            Sales &amp; Prescription Dispensing History
          </Typography>
          <Typography sx={{ mt: 0.75, color: "#475569", maxWidth: 760 }}>
            Unified audit trail and ledger reconciliation for doctor electronic prescriptions, patient mobile app orders, and walk-in counter OTC transactions.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button size="small" variant="outlined" startIcon={<DownloadOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
            Export CSV
          </Button>
          <Button size="small" variant="outlined" startIcon={<AssessmentOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
            Daily Audit PDF
          </Button>
          <Button size="small" variant="contained" startIcon={<AddOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#005F5B", boxShadow: "none", minHeight: 36, "&:hover": { bgcolor: "#0D7A75" } }}>
            New Dispense / Sale
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
        {kpis.map((card) => (
          <Card key={card.title} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", left: 0, top: 0, width: "100%", height: 4, bgcolor: card.accent }} />
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4D5F7B", fontWeight: 700 }}>
                    {card.badge}
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "#0B1C30", fontWeight: 700 }}>{card.title}</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: `${card.accent}1A`, color: card.accent }}>
                  {card.icon}
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: card.title === "Reconciled Daily Total" ? "1.9rem" : "2.1rem", fontWeight: 800, color: card.title === "Reconciled Daily Total" ? "#FFFFFF" : "#0B1C30", background: card.title === "Reconciled Daily Total" ? "linear-gradient(135deg, #005F5B, #0D7A75)" : "transparent", WebkitBackgroundClip: card.title === "Reconciled Daily Total" ? "text" : "border-box", color: card.title === "Reconciled Daily Total" ? "transparent" : "inherit", display: "inline-block" }}>
                  {card.value}
                </Typography>
                <Typography sx={{ fontSize: "0.76rem", color: "#4D5F7B", fontWeight: 700 }}>{card.amount}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mt: 1.5, pt: 1.25, borderTop: "1px solid #E2E8F0" }}>
                <Typography sx={{ fontSize: "0.68rem", color: "#4D5F7B", fontWeight: 700 }}>{card.percent}</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: card.accent, fontWeight: 700 }}>{card.title === "Reconciled Daily Total" ? "100% Audited" : "volume"}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", lg: "center" }} spacing={2}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.value}
                  size="small"
                  variant={tab.value === "all" ? "contained" : "text"}
                  sx={{
                    borderRadius: 2,
                    px: 1.25,
                    py: 0.75,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: tab.value === "all" ? "#005F5B" : "#F1F5F9",
                    color: tab.value === "all" ? "#FFFFFF" : "#475569",
                    boxShadow: tab.value === "all" ? "none" : "none",
                  }}
                >
                  {tab.label}
                  <Box component="span" sx={{ ml: 0.75, px: 0.6, py: 0.15, borderRadius: 1, bgcolor: tab.value === "all" ? "rgba(255,255,255,0.2)" : "#E2E8F0", fontSize: "0.62rem" }}>
                    {tab.count}
                  </Box>
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Chip label="Today, 24 Oct 2024" size="small" sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700, borderRadius: 1.5 }} />
              <Chip label="Audit Register #REG-SOUTH-04" size="small" sx={{ bgcolor: "#EAF1FF", color: "#4D5F7B", fontWeight: 700, borderRadius: 1.5 }} />
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={1} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by Invoice #, Patient Name, Phone, Doctor Name, Rx#, or App ID..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ color: "#6E7978" }} />
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
              sx={{ maxWidth: { lg: 620 } }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", lg: "auto" } }}>
              <Select defaultValue="" displayEmpty size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 170 }, borderRadius: 2, background: "#F8FAFC" }}>
                <MenuItem value="" disabled>
                  Payment: All
                </MenuItem>
                <MenuItem value="upi">UPI / QR Scan</MenuItem>
                <MenuItem value="cash">Counter Cash</MenuItem>
                <MenuItem value="card">Debit / Credit Card</MenuItem>
              </Select>

              <Select defaultValue="" displayEmpty size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 170 }, borderRadius: 2, background: "#F8FAFC" }}>
                <MenuItem value="" disabled>
                  Status: All Active
                </MenuItem>
                <MenuItem value="dispensed">Dispensed &amp; Complete</MenuItem>
                <MenuItem value="delivery">Out for Delivery</MenuItem>
                <MenuItem value="packed">Packed / Ready</MenuItem>
              </Select>

              <Select defaultValue="newest" size="small" sx={{ height: 40, minWidth: { xs: "100%", sm: 170 }, borderRadius: 2, background: "#F8FAFC" }}>
                <MenuItem value="newest">Latest Timestamp</MenuItem>
                <MenuItem value="amount-high">Amount: High to Low</MenuItem>
                <MenuItem value="amount-low">Amount: Low to High</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Invoice &amp; Time</TableCell>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Origin / Channel</TableCell>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Patient Information</TableCell>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Prescribed / Sold Items</TableCell>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Consultant / Prescriber</TableCell>
                <TableCell align="right" sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Bill &amp; Mode</TableCell>
                <TableCell sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dispense Status</TableCell>
                <TableCell align="center" sx={{ py: 1.25, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => (
                <TableRow key={row.id} hover sx={{ bgcolor: index % 2 === 1 ? "#F8FAFC" : "transparent" }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, color: "#005F5B", fontSize: "0.76rem" }}>{row.id}</Typography>
                    <Typography sx={{ mt: 0.25, fontSize: "0.66rem", color: "#64748B" }}>{row.time}</Typography>
                    <Typography sx={{ fontSize: "0.6rem", color: "#94A3B8" }}>Terminal #04</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Chip label={row.channel} size="small" sx={{ bgcolor: row.channelColor, color: row.channelText, fontWeight: 700, borderRadius: "999px", height: 24 }} />
                    <Typography sx={{ mt: 0.65, fontSize: "0.62rem", color: "#64748B" }}>Ref: Rx #DOC-8821</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30" }}>{row.patient}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#475569" }}>{row.phone}</Typography>
                    <Typography sx={{ fontSize: "0.62rem", color: "#64748B" }}>ABHA: 24-9102-4412-88</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {row.items.map((item) => (
                        <Chip key={item} label={item} size="small" sx={{ bgcolor: "#F1F5F9", color: "#334155", borderRadius: 1, fontSize: "0.58rem", height: 20 }} />
                      ))}
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, color: "#0B1C30" }}>{row.doctor}</Typography>
                    <Typography sx={{ fontSize: "0.62rem", color: "#64748B" }}>Reg: DMC-48921</Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, color: "#0B1C30" }}>{row.amount}</Typography>
                    <Chip label={row.payment} size="small" sx={{ mt: 0.5, bgcolor: "#EAF1FF", color: "#005F5B", fontWeight: 700, borderRadius: 1.5, height: 22 }} />
                  </TableCell>

                  <TableCell sx={{ py: 1.5 }}>
                    <Chip label={row.status} size="small" sx={{ bgcolor: row.statusColor, color: row.statusText, fontWeight: 700, borderRadius: "999px", px: 0.5 }} />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Button size="small" sx={{ minWidth: 0, p: 0.65, borderRadius: 1.5, color: "#475569" }} aria-label="view">
                        <VisibilityOutlined fontSize="small" />
                      </Button>
                      <Button size="small" sx={{ minWidth: 0, p: 0.65, borderRadius: 1.5, color: "#475569" }} aria-label="print">
                        <PrintOutlined fontSize="small" />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ px: 2, py: 1.5, bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
          <Typography sx={{ fontSize: "0.74rem", color: "#475569" }}>
            Showing <Box component="span" sx={{ fontWeight: 800, color: "#0B1C30" }}>1 - {visibleRows.length}</Box> of <Box component="span" sx={{ fontWeight: 800, color: "#0B1C30" }}>{totalRows}</Box> records
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage - 1}
            onChange={(_, value) => onPageChange?.(value + 1)}
            size="small"
            color="primary"
            siblingCount={1}
          />
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "#EAF1FF", color: "#005F5B" }}>
                <VerifiedUserOutlined sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#0B1C30" }}>Day Shift Financial Balancing in Progress</Typography>
                <Typography sx={{ fontSize: "0.76rem", color: "#475569" }}>
                  Cash in drawer: <Box component="span" sx={{ fontWeight: 800, color: "#0B1C30" }}>₹48,220.00</Box> | Digital / QR settled: <Box component="span" sx={{ fontWeight: 800, color: "#0B1C30" }}>₹6,98,230.00</Box>. Shift drawer closes in 3h 15m.
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button size="small" variant="outlined" startIcon={<AssessmentOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                Count Drawer Cash
              </Button>
              <Button size="small" variant="contained" startIcon={<CheckCircleOutline />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#005F5B", boxShadow: "none", "&:hover": { bgcolor: "#0D7A75" } }}>
                Close Shift Register
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
