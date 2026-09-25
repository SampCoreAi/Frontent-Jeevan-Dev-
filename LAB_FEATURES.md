# Lab Features Overview

## 1. Overview

This module covers the complete lab request and report workflow across doctor, patient, and lab user roles. It includes lab connection management, request creation, status updates, report upload, duplicate prevention, and historical reasoning for rejected or cancelled requests.

---

## 2. Roles and Scope

### Doctor
- Connect with labs
- Create lab test requests for a patient
- View patient lab requests and report status
- Cancel a pending lab request with a reason
- See lab rejection/cancel notes

### Patient
- View requested lab tests
- View assigned lab and doctor details
- See report delivery date/time
- See lab-assigned collection date/time and queue token
- View uploaded report if available
- See doctor interpretation and next steps after report review
- See rejection/cancel reason when applicable

### Lab User
- Receive incoming lab requests from doctors
- Set expected report delivery date and time
- Assign collection date/time, queue token, and collection instructions
- Update status through the workflow
- Reject or cancel a request with a reason
- Upload the final PDF report
- Delete uploaded files within allowed period

---

## 3. Lab connection flow

### Doctor to lab connection
- Doctor searches lab by name, code, city, or address
- Sends a connection request
- Lab approves or rejects the connection
- Status values include:
  - PENDING
  - APPROVED
  - REJECTED

### Connection rules
- Only approved lab connections are usable for request creation
- Doctor cannot create a request with an unapproved lab

---

## 4. Lab request creation

### Doctor creates request
When a doctor creates a lab test request, the request includes:
- patient id
- doctor id
- selected lab id
- requested tests
- priority
- doctor note (optional)

### Important rule
The request creation flow does not capture a doctor-side report date/time. The report delivery date/time is owned by the lab, not by the doctor.

### Duplicate protection
- If the same test is already active for the same patient and lab, it is skipped instead of creating a duplicate request
- Duplicate attempts do not create repeated rows in the active request list

---

## 5. Request status lifecycle

Supported status values:
- PENDING
- APPROVED
- REJECTED
- SAMPLE_COLLECTED
- PROCESSING
- REPORT_UPLOADED
- COMPLETED
- CANCELLED

### Status meaning
- PENDING: request is created and waiting
- APPROVED: lab accepted the request
- REJECTED: lab rejected it, with a reason
- SAMPLE_COLLECTED: sample is collected
- PROCESSING: report is under processing
- REPORT_UPLOADED: lab uploaded PDF
- COMPLETED: workflow finished
- CANCELLED: request was cancelled by doctor or lab action

---

## 6. Lab-side actions

### Set report delivery date/time
The lab user updates expected report delivery date/time in the lab request table.

### Assign collection sequence
The lab user can assign a collection slot, queue token, and instructions. The patient and assigned technician see the same values.

### Reject or cancel request
When the lab chooses reject or cancel, a small dialog appears that requires a reason/comment before submission.

### Status update rule
If a request is cancelled, the lab cannot modify it further.

### Uploaded report flow
- Lab uploads PDF against a request
- System stores the uploaded report with request association
- User can open or download the report
- Report can be deleted within the defined limit window

---

## 7. Report handling

### Uploaded report details
Each uploaded report includes:
- file name
- request id
- patient details
- lab details
- doctor details
- test name
- status
- upload date
- downloadable link
- doctor review status and interpretation, when reviewed

### Duplicate upload handling
If a report is already uploaded for the same request and the user uploads again, the previous report is replaced with the new one instead of creating a duplicate entry.

---

## 8. Reason / note tracking

### Requirement
Reject/cancel actions must carry a clear reason message.

### Storage
The reason is persisted in the lab request status history table.

### Visibility
The latest note is surfaced to:
- doctor dashboard
- patient lab view
- lab request table

This ensures the user can see why a request was rejected or cancelled.

---

## 9. Frontend behavior

### Patient view
- Shows request status and report date
- Shows collection date/time and queue token
- Shows reason when status is rejected or cancelled
- Shows uploaded report view button if report exists
- Shows doctor interpretation and next steps after review
- Includes SNO row numbers in the table

### Doctor view
- Shows lab request table with relevant status
- Shows report date and note details
- Allows cancel request with reason
- Shows rejection/cancel reason in the visible record
- Shows all reports and can add a clinical interpretation/follow-up comment

### Lab view
- Shows request list with date-time input for expected report delivery
- Shows loader while update is running
- Shows top alert messages for success and error states
- Requires reason input for reject/cancel operations
- Blocks updates on cancelled requests
- Uses server pagination for requests, reports, and technician tasks

---

## 10. Backend logic

### Validation layer
The backend validates:
- request id format
- create request payload
- status update payload
- cancel payload
- required note for reject/cancel flows

### Service layer
The service layer handles:
- request creation
- approval/connection rules
- duplicate check
- status transitions
- history note insertion
- cancellation flow

### Database model layer
The model layer includes:
- request creation
- status updates
- request lookup by doctor, patient, and lab
- last status note lookup
- insertion into status history
- duplicate detection logic

---

## 11. Key implementation fixes completed

- Removed doctor-side date/time from request creation
- Kept report date/time ownership with the lab
- Added SNO values in tables
- Fixed mismatched status colors across screens
- Added visible rejection/cancel reason display
- Removed unnecessary duplicate upload rows
- Added a loader while actions are being processed
- Added user-facing error messages at the top of the UI
- Prevented lab updates on cancelled requests
- Compact reason dialogs for better UX
- Added collection slot, queue token, and technician instructions
- Added doctor report review and patient-visible interpretation
- Added server pagination for high-volume request/report/task APIs

---

## 12. Final note

The lab feature is now aligned across all three major user roles: doctor, patient, and lab. The flow is consistent, the status lifecycle is preserved, and the rejection/cancel reason is clearly visible rather than remaining hidden in backend history only.

---

# Medical Features Overview

## 1. Overview

This module covers the complete medicine request and fulfillment workflow across doctor, patient, and pharmacy roles. It mirrors the lab pattern but adds medicine-specific behavior such as pharmacy connection approval, direct patient purchase, online/offline fulfillment, invoice tracking, and multi-pharmacy assignment per request.

---

## 2. Roles and Scope

### Doctor
- Connect with approved medical stores/pharmacies
- Create medicine requests for a patient
- Select one or multiple medicines for a patient
- Assign each medicine to a pharmacy when more than one pharmacy is connected
- View patient medicine request status and payment summary
- Cancel a pending medicine request with a reason

### Patient
- View medicine request list with pharmacy, amount, and status
- Open each request to see medicine names, quantity, dose, and store info
- See invoice/amount breakdown and pending/paid status
- Buy medicine directly from pharmacy in online or offline mode
- Confirm order status and delivery pickup details
- See rejection/cancel reason when applicable

### Pharmacy User
- Receive medicine requests from doctors or patients
- Accept or reject the request with a reason
- Update fulfillment status: pending, processing, packed, delivered, completed, cancelled
- Add medicine price and final invoice amount
- Update pharmacy stock and availability
- Mark offline or online fulfillment type

---

## 3. Medical store connection flow

### Doctor to pharmacy connection
- Doctor searches pharmacy by name, code, city, address, or phone
- Sends connection request to the pharmacy
- Pharmacy approves or rejects the connection
- Status values include:
  - PENDING
  - APPROVED
  - REJECTED

### Connection rules
- Only approved pharmacy connections are usable for medicine requests
- Doctor cannot send medicine requests to unapproved pharmacy
- A patient may have multiple approved pharmacy connections
- One medicine request can be split across multiple pharmacies when needed

---

## 4. Medicine request creation

### Doctor or patient creates request
When a medicine request is created, it includes:
- patient id
- doctor id
- selected pharmacy id or multiple pharmacy ids
- required medicine items
- quantity, dosage, instruction, and mode
- price estimate or final amount after pharmacy pricing
- request note / doctor instruction
- fulfillment type: ONLINE or OFFLINE

### Request item structure
Each request item should carry:
- medicine name
- quantity
- unit or dosage
- pharmacy id
- status item level
- price per unit
- total amount
- supply status

### Important rule
The request must not be stored as just one flat list. It must be structured with request header + request items so that a patient can be linked to multiple pharmacies and medicines in one clear flow.

---

## 5. Multi-pharmacy handling

### Why this matters
A patient may be connected to multiple pharmacies. The doctor or patient should not be forced to use only one store.

### UI handling pattern
The request builder should work like this:
1. Patient is selected first.
2. Medicines are added one by one.
3. Each medicine row shows:
   - medicine name
   - quantity
   - dosage
   - pharmacy selector
   - amount estimate
4. If the patient has multiple approved pharmacies, each medicine can be assigned to a different pharmacy.
5. The UI must show a single request summary card with:
   - patient name
   - patient age / gender / ID
   - doctor details
   - medicine list
   - assigned pharmacy per medicine
   - total amount
   - fulfillment mode

### One-click summary card
The summary panel should make it easy to review before sending:
- Patient name and ID
- Selected pharmacy names
- Itemized medicines
- Total estimated cost
- Online/offline mode
- Request note

This ensures no confusion about where the medicine is being sent and which medicine belongs to which store.

---

## 6. Patient experience and visible data

### Patient medicine list
The patient should see a list like:
- medicine request id
- pharmacy name
- medicine names
- quantity and total amount
- status
- payment status
- fulfillment type
- order date
- delivery / pickup date

### Amount visibility
The patient must clearly see:
- total amount requested
- amount accepted by pharmacy
- final bill after pharmacy confirmation
- pending amount
- payment status (PAID / UNPAID / PARTIAL)

### Why this matters
This prevents confusion when a pharmacy changes price or when one medicine is handled by a different store than the others.

---

## 7. Fulfillment status lifecycle

Supported statuses:
- PENDING
- APPROVED
- REJECTED
- PROCESSING
- PACKED
- OUT_FOR_DELIVERY
- DELIVERED
- COMPLETED
- CANCELLED

### Meaning
- PENDING: request created and waiting
- APPROVED: pharmacy accepted request
- REJECTED: pharmacy rejected with reason
- PROCESSING: pharmacy preparing medicine
- PACKED: medicine is packed and ready
- OUT_FOR_DELIVERY: delivery in progress
- DELIVERED: delivered to patient
- COMPLETED: final complete status
- CANCELLED: request cancelled by doctor/patient/pharmacy

---

## 8. Offline and online mode

### Offline mode
Used when medicine is picked up directly from the pharmacy store.
Fields to capture:
- pickup date/time
- pharmacy address
- pharmacy contact
- patient pickup confirmation

### Online mode
Used when medicine is delivered at home or through a digital order.
Fields to capture:
- delivery address
- delivery date/time
- delivery partner or status
- payment method
- shipping charge

### Requirement
The same request should support both modes, but each medicine request should keep a clear `fulfillment_mode` and `delivery_type` so the patient sees the right flow.

---

## 9. Pharmacy-side actions

### Accept or reject request
Pharmacy can accept or reject with a reason.

### Price update
Pharmacy should be able to:
- add unit price
- modify quantity if needed
- calculate final bill
- confirm invoice amount

### Stock validation
Before accepting, pharmacy checks:
- medicine availability in stock
- requested quantity limit
- replacement alternatives if unavailable

### Status update rule
If request is cancelled, the pharmacy cannot continue updates on that request unless reopened by admin or doctor.

---

## 10. Reason / note tracking

### Requirement
Reject/cancel actions must carry a clear reason.

### Storage
The reason should be stored in medicine request status history.

### Visibility
The latest reason should be visible in:
- doctor dashboard
- patient request list
- pharmacy request table
- invoice or request summary dialog

---

## 11. Data model plan

### Core tables
- pharmacy_connections
  - id
  - doctor_id
  - pharmacy_id
  - status
  - requested_at
  - approved_at

- medicine_requests
  - id
  - patient_id
  - doctor_id
  - request_source (doctor/patient)
  - fulfillment_mode (ONLINE/OFFLINE)
  - overall_status
  - total_amount
  - final_amount
  - payment_status
  - created_at

- medicine_request_items
  - id
  - medicine_request_id
  - medicine_name
  - quantity
  - dosage
  - pharmacy_id
  - unit_price
  - total_price
  - item_status
  - notes

- medicine_request_history
  - id
  - medicine_request_id
  - status
  - note
  - updated_by
  - created_at

- pharmacy_invoices
  - id
  - medicine_request_id
  - pharmacy_id
  - total_amount
  - discount
  - final_amount
  - payment_status
  - created_at

---

## 12. Frontend behavior plan

### Doctor view
- Show connected pharmacies list
- Select medicine and assign pharmacy per item
- Show patient summary card on one click
- Show total amount before sending
- Allow cancel request with reason
- Real-time request status list in doctor dashboard

### Patient view
- Shows request list with pharmacy, medicine, status, amount, mode
- Shows invoice summary in request detail page
- Shows rejection or cancellation reason clearly
- Allows direct medicine request from pharmacy connection if needed
- Displays online/offline fulfillment details separately

### Pharmacy view
- Shows incoming medicine requests from connected patients/doctors
- Allows accept, reject, update status, and invoice entry
- Real-time table with product and amount details
- Blocks updates after cancel

---

## 13. UI implementation pattern for multiple stores

The key pattern should be:

1. Request is created as a parent entity.
2. Medicines are grouped as child rows.
3. Each medicine row has a pharmacy assignment.
4. A request summary aggregates all rows into one total bill.
5. A patient can see a single, clean medicine request card with multiple pharmacy involvement.
6. Each pharmacy sees only the items assigned to it.

This solves the problem of one patient being connected to multiple medical stores and one request having medicines from different stores.

---

## 14. Key design decision

The main rule for this module is:

- A request can have multiple medicines.
- Each medicine can belong to one pharmacy.
- One patient can have multiple approved pharmacies.
- One patient sees the full request summary in one place.
- Each pharmacy sees only its assigned items.

This is the correct equivalent of the lab module architecture, but adjusted for medicine and billing.

---

## 15. Final note

The medical module should be built using the same structured pattern as the lab module: connection approval, request creation, status life cycle, and history notes. The biggest difference is that medicine fulfillment must support multiple connected pharmacies, item-level pharmacy assignment, final invoice visibility, and both online/offline fulfillment flows. If this structure is followed, the patient can clearly understand what medicine was requested, which pharmacy handled it, how much was charged, and which fulfillment mode was used.
