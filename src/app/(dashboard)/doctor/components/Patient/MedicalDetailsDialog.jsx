"use client";

import React, { useMemo } from "react";
import MedicalInvoiceDialog from "../Medical/MedicalInvoiceDialog";

export default function MedicalDetailsDialog({
  open,
  onClose,
  patient,
  stores,
  rows,
}) {
  const invoiceSummary = useMemo(() => {
    const subtotal = rows.reduce(
      (total, row) => total + Number(row.amount || 0),
      0
    );

    return {
      subtotal,
      discount: 0,
      tax: 0,
      finalTotal: subtotal,
    };
  }, [rows]);

  return (
    <MedicalInvoiceDialog
      open={open}
      onClose={onClose}
      selectedPatient={{
        name: patient?.name || "Patient",
      }}
      stores={stores}
      rows={rows}
      invoiceSummary={invoiceSummary}
    />
  );
}