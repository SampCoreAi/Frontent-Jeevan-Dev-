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
- View uploaded report if available
- See rejection/cancel reason when applicable

### Lab User
- Receive incoming lab requests from doctors
- Set expected report delivery date and time
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
- Shows reason when status is rejected or cancelled
- Shows uploaded report view button if report exists
- Includes SNO row numbers in the table

### Doctor view
- Shows lab request table with relevant status
- Shows report date and note details
- Allows cancel request with reason
- Shows rejection/cancel reason in the visible record

### Lab view
- Shows request list with date-time input for expected report delivery
- Shows loader while update is running
- Shows top alert messages for success and error states
- Requires reason input for reject/cancel operations
- Blocks updates on cancelled requests

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

---

## 12. Final note

The lab feature is now aligned across all three major user roles: doctor, patient, and lab. The flow is consistent, the status lifecycle is preserved, and the rejection/cancel reason is clearly visible rather than remaining hidden in backend history only.
