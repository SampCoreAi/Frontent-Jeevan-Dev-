"use client";

import { Box, Card, CardContent, FormControl, MenuItem, Select, Typography } from "@mui/material";

const lineData = [
  { week: "Week 1", offline: 180, online: 120 },
  { week: "Week 2", offline: 220, online: 150 },
  { week: "Week 3", offline: 240, online: 180 },
  { week: "Week 4", offline: 200, online: 160 },
];

const pieData = [
  { name: "Cardiology", value: 45, color: "#1D9E75" },
  { name: "Neurology", value: 20, color: "#378ADD" },
  { name: "Orthopedics", value: 20, color: "#BA7517" },
  { name: "Pediatrics", value: 15, color: "#E24B4A" },
];

function LineChartSVG() {
  const W = 500, H = 220;
  const pad = { top: 16, right: 20, bottom: 32, left: 40 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const maxV = 300;

  const xPos = (i) => pad.left + (i / (lineData.length - 1)) * cW;
  const yPos = (v) => pad.top + cH - (v / maxV) * cH;

  const makePath = (key) =>
    lineData.map((d, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yPos(d[key])}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
      {[0, 100, 200, 300].map((v) => (
        <g key={v}>
          <line
            x1={pad.left} x2={W - pad.right}
            y1={yPos(v)} y2={yPos(v)}
            stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 3"
          />
          <text x={pad.left - 8} y={yPos(v) + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">
            {v}
          </text>
        </g>
      ))}

      {lineData.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF">
          {d.week}
        </text>
      ))}

      {/* Offline line */}
      <path d={makePath("offline")} fill="none" stroke="#E24B4A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {lineData.map((d, i) => (
        <circle key={i} cx={xPos(i)} cy={yPos(d.offline)} r="4" fill="white" stroke="#E24B4A" strokeWidth="2" />
      ))}

      {/* Online line */}
      <path d={makePath("online")} fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {lineData.map((d, i) => (
        <circle key={i} cx={xPos(i)} cy={yPos(d.online)} r="4" fill="white" stroke="#1D9E75" strokeWidth="2" />
      ))}
    </svg>
  );
}

function PieChartSVG() {
  const cx = 110, cy = 100, R = 72, r = 42;
  const total = pieData.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;

  const slices = pieData.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + R * Math.cos(startAngle), y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle), y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + r * Math.cos(startAngle), iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(endAngle), iy2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const pathD = `M ${ix1} ${iy1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1} Z`;
    startAngle = endAngle;
    return { ...d, pathD };
  });

  return (
    <svg viewBox="0 0 360 200" width="100%" height={200}>
      {slices.map((d, i) => (
        <path key={i} d={d.pathD} fill={d.color} stroke="white" strokeWidth="2" />
      ))}

      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fill="#6B7280" fontFamily="sans-serif">Total</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="20" fontWeight="600" fill="#111827" fontFamily="sans-serif">
        {total}%
      </text>

      {pieData.map((d, i) => {
        const y = cy - 52 + i * 32;
        return (
          <g key={i}>
            <rect x={228} y={y} width={10} height={10} rx={2} fill={d.color} />
            <text x={244} y={y + 9} fontSize="12" fill="#6B7280" fontFamily="sans-serif">{d.name}</text>
            <text x={354} y={y + 9} fontSize="12" fontWeight="500" fill="#111827" textAnchor="end" fontFamily="sans-serif">
              {d.value}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const cardStyle = {
  borderRadius: 2,
  border: "1px solid #1e6658",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  height: "100%",
};

const selectStyle = {
  borderRadius: "10px",
  minWidth: 120,
  height: 38,
  fontSize: 13,
};

function CardHeader({ title, subtitle }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
      <Box>
        <Typography sx={{ fontSize: { xs: "18px", md: "22px" }, fontWeight: 700, color: "#111827", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#6B7280" }}>{subtitle}</Typography>
      </Box>
      <FormControl size="small">
        <Select defaultValue="month" sx={selectStyle}>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="last">Last Month</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default function DashboardCharts() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
      {/* LINE CHART CARD */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <CardHeader title="Patient visits trend" subtitle="Weekly offline vs online consultations" />

          <LineChartSVG />

          <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
            {[{ color: "#E24B4A", label: "Offline patients" }, { color: "#1D9E75", label: "Online patients" }].map((item) => (
              <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }} />
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* PIE CHART CARD */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <CardHeader title="Department activity" subtitle="Active cases by department this month" />

          <PieChartSVG />

          <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            {pieData.map((d) => (
              <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: d.color }} />
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{d.name}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}