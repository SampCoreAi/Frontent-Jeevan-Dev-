"use client";

import { useState } from "react";

const getBrandingUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const bucketUrl = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
    /\/+$/,
    "",
  );
  const rawValue = value.trim();

  try {
    const parsed = new URL(rawValue, "https://lab-invoice-image.invalid");
    if (/^https?:\/\//i.test(rawValue)) return rawValue;

    const key = parsed.pathname.replace(/^\/+/, "");
    return key && bucketUrl ? `${bucketUrl}/${key}${parsed.search}` : "";
  } catch {
    return "";
  }
};

const getBrandingValue = (profile, keys) => {
  for (const key of keys) {
    const value = profile?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
};

export default function LabBill({
  order = {},
  invoice = {},
  lab = {},
  billRef,
}) {
  const [failedLogoUrl, setFailedLogoUrl] = useState("");
  const profile = lab.profile || lab;
  const registration = lab.registration || {};
  const registrationData = registration.registration_data || {};
  const labInformation = registrationData.labInformation || {};
  const labAddress = registrationData.labAddress || {};
  const logoUrl = getBrandingUrl(
    getBrandingValue(profile, [
      "lab_logo_url",
      "logo_url",
      "lab_logo",
      "lab_logo_path",
      "logo",
      "profile_image",
      "image_url",
    ]),
  );
  const signatureUrl = getBrandingUrl(
    getBrandingValue(profile, [
      "lab_signature_url",
      "signature_url",
      "lab_signature",
      "lab_signature_path",
      "signature",
    ]),
  );
  const tests = invoice.test_charges?.length
    ? invoice.test_charges
    : (order.requested_tests || []).map((test) =>
        typeof test === "string" ? { test_code: test } : test
      );
  const show = (value) =>
    value === null || value === undefined || value === "" ? "—" : value;
  const hasRates =
    tests.length > 0 &&
    tests.every(
      (test) => test.rate !== undefined && test.rate !== null && test.rate !== ""
    );
  const subtotal = tests.reduce((sum, test) => sum + Number(test.rate || 0), 0);
  const discount = Number(invoice.discount_amount || 0);
  const otherCharges = Number(invoice.other_charges || 0);
  const total = subtotal - discount + otherCharges;
  const patientAddress = order.patient_address || order.walk_in_patient_address;
  const labName = labInformation.diagnosticLabName || lab.lab_name || order.lab_name;
  const workingDays = profile.working_hours?.days || [];
  const workingHours = workingDays.length
    ? workingDays
        .map(({ day, openingTime, closingTime }) =>
          `${day}: ${openingTime}–${closingTime}`
        )
        .join(" · ")
    : "—";
  const addressText = (address) => {
    if (!address) return "—";
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch {
        return address;
      }
    }
    if (typeof address !== "object" || Array.isArray(address)) {
      return String(address);
    }
    return [
      address.cityTown || address.city,
      address.state,
    ]
      .filter(Boolean)
      .join(", ") || "—";
  };

  return (
    <main className="page">
      <article className="bill" ref={billRef}>
        <header className="brand">
          {logoUrl && failedLogoUrl !== logoUrl ? (
            <img
              className="logo"
              src={logoUrl}
              alt={`${show(labName)} logo`}
              crossOrigin="anonymous"
              onError={() => setFailedLogoUrl(logoUrl)}
            />
          ) : (
            <svg className="logo" viewBox="0 0 64 64" role="img" aria-label={`${show(labName)} logo`}>
              <circle cx="32" cy="32" r="29" fill="#e8f1f3" stroke="#253b4a" strokeWidth="3" />
              <path d="M9 34h12l5-12 8 23 7-16 4 5h10" fill="none" stroke="#168c83" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="48" cy="18" r="5" fill="#d66b55" />
            </svg>
          )}

          <div>
            <h1 className="brand-name">{show(labName)}</h1>
            <p className="tagline">{show(profile.bio)}</p>
          </div>

          <div className="bill-title">
            LABORATORY BILL
            <small>Bill No: {invoice.invoice_no }</small>
          </div>
        </header>

        <section className="section details">
          <div>
            <p className="info"><span className="label">Registration No</span><span>:</span><span className="value">{show(order.order_id)}</span></p>
            <p className="info"><span className="label">Patient Name</span><span>:</span><span className="value">{show(order.patient_name || order.walk_in_patient_name)}</span></p>
            <p className="info"><span className="label">Age</span><span>:</span><span className="value">{show(order.patient_age ?? order.walk_in_patient_age)}</span></p>
            <p className="info"><span className="label">Sex</span><span>:</span><span className="value">{show(order.patient_gender || order.walk_in_patient_gender)}</span></p>

          </div>

          <div>
            <p className="info"><span className="label">Location</span><span>:</span><span className="value">{addressText(patientAddress)}</span></p>
            <p className="info"><span className="label">Bill Date</span><span>:</span><span className="value">{show(invoice.created_at || order.created_at)}</span></p>
            <p className="info"><span className="label">Ref. Doctor</span><span>:</span><span className="value">{show(order.doctor_name || order.referring_doctor_name)}</span></p>
            <p className="info"><span className="label">Payment</span><span>:</span><span className="value">{show(invoice.payment_mode)}</span></p>
          </div>
        </section>

        <section className="section">
          <h2 className="table-title">Test Details</h2>

          <table className="test-table">
            <thead>
              <tr>
                <th>TEST NAME</th>
                <th>TEST RATE (₹)</th>
              </tr>
            </thead>
            <tbody>
              {tests.length ? tests.map((test, index) => (
                <tr key={`${test.test_code || test.test_name || index}-${index}`}>
                  <td>{show(test.test_name || test.test_code)}</td>
                  <td>{test.rate === undefined || test.rate === null || test.rate === "" ? "—" : Number(test.rate).toFixed(2)}</td>
                </tr>
              )) : <tr><td colSpan={2}>—</td></tr>}
            </tbody>
          </table>

          <div className="totals">
            <table>
              <tbody>
                <tr><td>Total Bill Amount</td><td>{hasRates ? `₹ ${subtotal.toFixed(2)}` : "—"}</td></tr>
                <tr><td>Discount</td><td>{invoice.discount_amount == null || invoice.discount_amount === "" ? "—" : `₹ ${discount.toFixed(2)}`}</td></tr>
                <tr><td>Other Charges</td><td>{invoice.other_charges == null || invoice.other_charges === "" ? "—" : `₹ ${otherCharges.toFixed(2)}`}</td></tr>
                <tr className="grand-total"><td>Amount Paid</td><td>{invoice.amount_received == null || invoice.amount_received === "" ? "—" : `₹ ${Number(invoice.amount_received).toFixed(2)}`}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <footer className="footer">
          <div className="footer-main">
            <div className="qr-box">
              <small>—</small>
            </div>

            <div className="signature-area">
              <p className="thanks">Thank You</p>
              <div className="signature">
                {signatureUrl && (
                  <img
                    className="signature-image"
                    src={signatureUrl}
                    alt="Lab signature"
                    crossOrigin="anonymous"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <small>Authorized Signature</small>
              </div>
            </div>
          </div>

          <div className="footer-details">
            <div>
              <b>Working Hours</b><br />
              {workingHours}<br />
              {show(labInformation.labContactEmail || registration.lab_email)}
            </div>

            <div className="lab-address">
              <b>{show(labName)}</b><br />
              {addressText(labAddress)}
            </div>
          </div>
        </footer>
      </article>

      <style jsx global>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          padding: 24px;
          background: #edf0f2;
          color: #17212b;
          font: 12px Arial, sans-serif;
        }

        .page { min-height: 100vh; overflow-x: auto; }

        .bill {
          position: relative;
          width: 210mm;
          min-height: 271mm;
          margin: auto;
          padding: 13mm 12mm;
          display: flex;
          flex-direction: column;
          background: #fff;
          box-shadow: 0 3px 18px #00000018;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #253b4a;
        }

        .logo { width: 52px; height: 52px; flex: none; object-fit: contain; }
        .brand-name { margin: 0; color: #253b4a; font-size: 23px; letter-spacing: .3px; }
        .tagline { margin: 3px 0 0; color: #61808c; font-size: 9px; font-weight: bold; letter-spacing: 1.3px; }

        .bill-title {
          margin-left: auto;
          color: #253b4a;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          text-align: right;
        }

        .bill-title small {
          display: block;
          margin-top: 5px;
          color: #687782;
          font-size: 10px;
          font-weight: normal;
          letter-spacing: 0;
        }

        .section { margin-top: 15px; }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 30px;
          padding: 12px 14px;
          background: #f5f8f9;
          border: 1px solid #dbe3e7;
          border-radius: 5px;
        }

        .info {
          display: grid;
          grid-template-columns: 100px 10px 1fr;
          gap: 4px;
          margin: 4px 0;
          line-height: 1.4;
        }

        .label { color: #596975; }
        .value { font-weight: 600; }
        .table-title { margin: 0 0 7px; color: #253b4a; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }

        .test-table th {
          padding: 9px 10px;
          background: #253b4a;
          color: #fff;
          font-size: 10px;
          letter-spacing: .5px;
          text-align: left;
        }

        .test-table td {
          padding: 9px 10px;
          border-bottom: 1px solid #e3e8eb;
        }

        .test-table th:last-child,
        .test-table td:last-child {
          width: 28%;
          text-align: right;
        }

        .test-table tbody tr:nth-child(even) { background: #f8fafb; }
        .totals { display: flex; justify-content: flex-end; margin-top: 10px; }
        .totals table { width: 290px; }
        .totals td { padding: 6px 8px; border: 0; }
        .totals td:last-child { font-weight: 600; text-align: right; }
        .grand-total td { border-top: 1px solid #253b4a; font-size: 13px; font-weight: bold; }

        .note {
          margin: 18px 0 0;
          color: #596975;
          font-size: 10px;
          line-height: 1.5;
        }

        .authorization {
          margin: 10px 0 0;
          color: #596975;
          font-size: 10px;
          text-align: right;
        }

        .footer {
          margin-top: auto;
          padding-top: 8mm;
          color: #596975;
          font-size: 9px;
          line-height: 1.5;
        }

        .footer-main {
          display: grid;
          min-height: 36mm;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          padding: 8px 0 12px;
        }

        .qr-box {
          width: 88px;
          height: 88px;
          display: grid;
          place-items: center;
          border: 1px dashed #cbd5da;
          border-radius: 5px;
          text-align: center;
        }

        .qr-image {
          display: block;
          width: 88px;
          height: 88px;
          margin: 0 auto;
          object-fit: contain;
        }

        .qr-box small {
          display: block;
          margin-top: 5px;
          color: #596975;
          font-size: 9px;
        }

        .signature-area {
          width: 190px;
          justify-self: end;
        }

        .thanks {
          margin: 0 0 20px;
          color: #253b4a;
          font-weight: bold;
          text-align: center;
        }

        .signature {
          min-height: 80px;
          border-bottom: 1px solid #7d8990;
          text-align: center;
        }

        .signature-image {
          display: block;
          width: 100%;
          height: 58px;
          margin: 0 auto;
          object-fit: contain;
          object-position: bottom center;
        }

        .signature small {
          display: block;
          padding: 5px 0;
          color: #596975;
        }

        .footer-details {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 10px 0 0;
          border-top: 1px solid #dbe3e7;
        }

        .footer-details > div { max-width: 48%; }
        .footer-details b { color: #253b4a; }
        .lab-address { text-align: right; }

        @media (max-width: 800px) {
          body { padding: 0; }
          .bill { margin: 0; }
        }

        @media print {
          body { padding: 0; background: #fff; }
          .bill { margin: 0; box-shadow: none; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </main>
  );
}