"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tab, Tabs, Typography } from "@mui/material";

const base = "/medical/pages/stock-management";

export default function StockManagementLayout({ children }) {
  const pathname = usePathname();

const activeTab = pathname.startsWith(`${base}/batches`)
  ? `${base}/batches`
  : pathname.startsWith(`${base}/default`)
    ? `${base}/default`
    : pathname.startsWith(`${base}/supplier`)
      ? `${base}/supplier`
      : base;

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
        sx={{
          mt: 2,
          borderBottom: "1px solid #DDE9E5",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: "#07876A" },
          "& .MuiTabs-indicator": { bgcolor: "#07876A" },
        }}
      >
        <Tab
          label="Purchase Entry"
          value={base}
          component={Link}
          href={base}
        />
        <Tab
          label="Batches & Stock"
          value={`${base}/batches`}
          component={Link}
          href={`${base}/batches`}
        />
        <Tab
          label="Default"
          value={`${base}/default`}
          component={Link}
          href={`${base}/default`}
        />
        <Tab
          label="Supplier"
          value={`${base}/supplier`}
          component={Link}
          href={`${base}/supplier`}
        />
      </Tabs>

      <Box sx={{ mt: 3 }}>{children}</Box>
    </Box>
  );
}