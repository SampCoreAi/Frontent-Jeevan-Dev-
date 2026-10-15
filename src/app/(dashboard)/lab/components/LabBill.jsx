"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function LabBill() {
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(
      "https://example.com/report/access?token=demo-report-token",
      { width: 88, margin: 1, errorCorrectionLevel: "H" },
    )
      .then((image) => {
        if (!cancelled) setQrImage(image);
      })
      .catch(() => {
        if (!cancelled) setQrImage("");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page">
      <article className="bill">
        <header className="brand">
          <svg className="logo" viewBox="0 0 64 64" role="img" aria-label="VR Diagnostics logo">
            <circle cx="32" cy="32" r="29" fill="#e8f1f3" stroke="#253b4a" strokeWidth="3" />
            <path d="M9 34h12l5-12 8 23 7-16 4 5h10" fill="none" stroke="#168c83" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="18" r="5" fill="#d66b55" />
          </svg>

          <div>
            <h1 className="brand-name">VR Diagnostics</h1>
            <p className="tagline">ACCURATE &amp; AFFORDABLE ALWAYS</p>
          </div>

          <div className="bill-title">
            LABORATORY BILL
            <small>Bill No: VRD-260531-238004</small>
          </div>
        </header>

        <section className="section details">
          <div>
            <p className="info"><span className="label">Registration No</span><span>:</span><span className="value">VR-260523802701</span></p>
            <p className="info"><span className="label">Patient Name</span><span>:</span><span className="value">Rahul Kumar</span></p>
            <p className="info"><span className="label">Age / Sex</span><span>:</span><span className="value">27 Years / Male</span></p>
            <p className="info"><span className="label">Center</span><span>:</span><span className="value">VRD Walk-in</span></p>
          </div>

          <div>
            <p className="info"><span className="label">Location</span><span>:</span><span className="value">Sachin, Surat</span></p>
            <p className="info"><span className="label">Bill Date</span><span>:</span><span className="value">31/05/2026 10:30 AM</span></p>
            <p className="info"><span className="label">Ref. Doctor</span><span>:</span><span className="value">Dr. Arvind Shah</span></p>
            <p className="info"><span className="label">Payment</span><span>:</span><span className="value">Paid - Online</span></p>
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
              <tr><td>Complete Blood Counts</td><td>250.00</td></tr>
              <tr><td>ESR</td><td>0.00</td></tr>
              <tr><td>Urine Examination</td><td>100.00</td></tr>
              <tr><td>Widal Test (Slide)</td><td>100.00</td></tr>
            </tbody>
          </table>

          <div className="totals">
            <table>
              <tbody>
                <tr><td>Total Bill Amount</td><td>₹ 450.00</td></tr>
                <tr><td>Discount</td><td>₹ 0.00</td></tr>
                <tr><td>Other Charges</td><td>₹ 0.00</td></tr>
                <tr className="grand-total"><td>Amount Paid</td><td>₹ 450.00</td></tr>
              </tbody>
            </table>
          </div>
        </section>

      

        <footer className="footer">
          <div className="footer-main">
            <div className="qr-box">
              {qrImage && (
                <img
                  className="qr-image"
                  src={qrImage}
                  alt="Scan to view report"
                  width={88}
                  height={88}
                />
              )}
              <small>Scan to view report</small>
            </div>

            <div className="signature-area">
              <p className="thanks">Thank You</p>
              <div className="signature">
                <small>Authorized Signature</small>
              </div>
            </div>
          </div>

          <div className="footer-details">
            <div>
              <b>Working Hours</b><br />
              08:00 AM - 08:00 PM<br />
              connectvrhealth@example.com
            </div>

            <div className="lab-address">
              <b>VR Diagnostics - Venture of VR Health</b><br />
              Shop No. 10, Ground Floor, Shopping Center,<br />
              Palan Road, Opposite Diamond Gate, Sachin, Surat
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
          min-height: 217mm;
          margin: auto;
          padding: 13mm 12mm 60mm;
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

        .logo { width: 52px; height: 52px; flex: none; }
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
          position: absolute;
          right: 12mm;
          bottom: 8mm;
          left: 12mm;
          color: #596975;
          font-size: 9px;
          line-height: 1.5;
        }

        .footer-main {
          display: grid;
          min-height: 112px;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          padding: 8px 0;
        }

        .qr-box { width: 120px; text-align: center; }

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
          padding-top: 27px;
          border-bottom: 1px solid #7d8990;
          text-align: center;
        }

        .signature small {
          display: block;
          padding: 5px 0;
          color: #596975;
        }

        .footer-details {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 7px 0 0;
          border-top: 1px solid #dbe3e7;
        }

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