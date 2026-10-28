
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tab, Tabs, Typography } from "@mui/material";

const base = "/medical/pages/stock-management";

export default function StockManagementLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Purchase Entry", value: base },
    { label: "Batches & Stock", value: `${base}/batches` },
    { label: "Default", value: `${base}/default` },
    { label: "Supplier", value: `${base}/supplier` },
    { label: "Quick Add", value: `${base}/quick-add` },
  ];

  const activeTab =
    tabs.find((tab) => pathname === tab.value)?.value ||
    (pathname.startsWith(`${base}/batches/`)
      ? `${base}/batches`
      : pathname.startsWith(`${base}/supplier/`)
        ? `${base}/supplier`
        : pathname.startsWith(`${base}/default/`)
          ? `${base}/default`
          : base);

  return (
    <Box sx={{ p: { xs: 2, md: 2.5 }, mt: 8, bgcolor: "#fff" }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
        Purchase Entry &amp; Stock
      </Typography>

      <Typography sx={{ color: "#71827B", fontSize: 12, mt: 0.5 }}>
        Enter one supplier bill with many medicine batches, then save them together.
      </Typography>

      <Tabs
        value={activeTab}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mt: 2,
          borderBottom: "1px solid #DDE9E5",
          minHeight: 44,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
            px: 2,
          },
          "& .Mui-selected": { color: "#07876A" },
          "& .MuiTabs-indicator": {
            bgcolor: "#07876A",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            component={Link}
            href={tab.value}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 3 }}>{children}</Box>
    </Box>
  );
}