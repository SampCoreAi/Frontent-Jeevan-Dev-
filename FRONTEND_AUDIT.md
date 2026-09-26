# Jeevan Dev Frontend Audit

**Scope:** Frontend source only. Backend/database behavior, authorization, API existence and persistence are **NOT VERIFIED**. “API-backed” means the frontend makes a request; it is not evidence of backend success. Source review only; no authenticated browser or viewport QA was performed.

## 1. Project Overview

- **Framework:** Next.js App Router. Declared dependencies are `next ^15.5.24`, `react ^19.3.0`, `react-dom ^19.3.0` (package ranges, not resolved installed versions).
- **Routing:** `src/app/**/page.*`; `(dashboard)` is a route group and not part of URLs. `Home/pages` is a physical nested URL segment.
- **UI:** MUI 7, MUI X Data Grid/date pickers, Tailwind CSS 4, CSS, MUI `sx` and inline styles. App theme/provider is in `src/app/styles/theme.js`.
- **State:** Root Redux Toolkit store (`src/store`) has user profile state. Doctor subtree mounts a separate schedule/profile Redux store. Most feature state is local component state; localStorage is used for auth, theme and some drafts.
- **Providers/layouts:** Root layout wraps Redux and theme. Dashboard layout mounts shared sidebar/header, token guard and another root Redux Provider. Doctor layout mounts its separate provider. `ThemeRegistry` is imported in root layout but not used.
- **API:** `src/config/api.js` appends `/api`; `src/utils/axiosInstance.js` has a second client, localhost fallback and refresh queue. Doctor services create another Axios client; many pages use direct Axios/fetch and manual URLs.
- **Auth:** Access/refresh token and user object are stored in `localStorage`. Shared `ProtectedRoute` checks token only. Explicit role checks are limited to a few dashboards.
- **Dark mode:** Real light/dark MUI theme persisted as `jeevan-theme`; explicit controls found in Doctor Settings. Many hardcoded colors bypass the theme.
- **Responsive:** MUI breakpoints, `useMediaQuery`, responsive `sx`, horizontal table scroll, mobile drawer. Some fixed heights/widths remain. No screenshot/device verification.
- **Forms/uploads/PDF:** Ad hoc validation and Formik/Yup dependencies; multipart upload for patient documents and lab reports; fetch/object URL download; PDF tooling via pdf-lib/jsPDF/html2canvas/html2pdf; QR via qrious.
- **Other key libraries:** Axios, Redux Toolkit, Socket.IO, Day.js, Chart.js/Recharts, Framer Motion, react-to-print, webcam, Lucide/React Icons.

**Structure:** Public landing/auth/informational experiences live in `src/app/Home`; dashboard feature areas are grouped by role under `src/app/(dashboard)`. Shared components/layout and API/store/theme logic are under `component`, `config`, `utils`, `store`, and `styles`. Role folder names do not themselves establish access control.

## 2. Roles Found

These roles are evidenced by role IDs, login redirects, menus and registration payloads:

| ID | Role | Login redirect | Evidence |
|---|---|---|---|
| 1 | Patient/User | `/users/pages/doctor` | Patient menu, registration `role_id: 1`, profile/dashboard |
| 2 | Doctor | `/doctor/pages/dashboard` | Doctor menu, role check, prescription/schedule |
| 3 | Assistant/Receptionist | `/doctor/pages/dashboard` | Assistant menu, assistant registration `role_id: 3` |
| 4 | Lab | `/lab/pages/dashboard` | Lab menu/workspace |
| 5 | Admin | `/admin/pages/dashboard` | Admin menu and role check |
| 6 | Medical store/Medical | `/medical/pages/dashboard` | Medical menu/store workspace |
| 7 | Lab technician | No login branch found | Menu and `/lab/pages/technician` route |

Role 3 is called both assistant and receptionist. No separate receptionist ID was found. Role 6 is a medical-store workflow. No additional distinct role was verified.

## 3. Authentication and Route Access

- Login posts `/api/auth/login`, stores `accessToken`, `refreshToken`, and `user`, then redirects by `role_id` (`Home/components/auth/LoginForm.jsx`). Role 7 has no branch; role 3 is sent to the doctor dashboard.
- Patient register posts role 1; email verification, doctor onboarding, forgot password and reset password screens exist.
- `ProtectedRoute.jsx` only checks for a token; it does not check role. Most role routes have no additional role check. Patient, doctor and admin dashboards have local role checks.
- Doctor dashboard rejects `role_id !== 2`; therefore role 3's successful login is redirected back to login. A separate assistant dashboard exists but the menu/login do not target it.
- Refresh failures in root and doctor Axios clients navigate to `/login`; the visible route is `/Home/pages/Login`.
- Patient matching slots navigate to `/dashboard/users/appointment`; actual route is `/users/pages/Appointment`.
- Admin dashboard alternate file links `/admin/pages/doctor`; actual route has uppercase `Doctor`, potentially failing on case-sensitive deployment.
- Email verification links to `/support`; no `/support` route found.

**Security:** Frontend route checks are not sufficient backend authorization. LocalStorage can be changed and URLs opened manually. APIs must independently enforce role, identity and resource ownership; that cannot be verified here.

## 4. Patient/User Features

| Feature | Page/component | API/action and user-visible behavior | Validation/loading/error/responsive notes | Status |
|---|---|---|---|---|
| Dashboard | `/users/pages/dashboard`, `users/components/Dashboard/*` | Cards render fixed values `1, 85, 85, 85`; no live call in card component | Responsive grid, but no real loading/empty/error data flow | **UI ONLY** |
| Search doctors | `/users/pages/doctor`, shared Home `SearchPage.jsx`, `SearchBar.jsx` | GET `/api/doctors/doctor/search`; keyword, pagination, suggestions | Debounce, loading/error/empty handling | **MOSTLY COMPLETE** |
| Nearby/city | Search page and `doctorSearchUtils.js` | Browser geolocation + Nominatim reverse geocode; sends city | Permission-denied states; relies on browser and third-party network; no proven manual city entry | **PARTIAL** |
| Filters/emergency | Search page, `FiltersSidebar.jsx` | Search params include specialization, experience, rating, availability, consultation type, fee, gender; emergency sends `search=emergency` | Error/empty handling and mobile drawer; backend filter semantics unverified | **PARTIAL** |
| Doctor details | `/users/pages/DoctorDetail`, detail and feedback components | GET public doctor profile and feedback; detail links to appointment | Loading/not-found/error UI; feedback requires rating/text | **MOSTLY COMPLETE** |
| Appointment booking | `/users/pages/Appointment`, `AppointmentClient.jsx` | GET profile, schedules and slots; POST `/api/appointments/create/:doctorId` with date/time/reason/type/mode/token/hospital and optional patient details | Date/slot required; validates other-patient name/email/mobile/age; booking spinner/snackbar; slot errors mostly log. Shared Axios adds auth if token exists; explicit token from local state is not passed to POST. | **PARTIAL** |
| Appointment history | `/users/pages/history` | GET `/api/appointments/getAllappoinment/my`; filters, details and PATCH cancel endpoint | Updates local row and snackbar; initial load errors log; tracking poll every 15 sec | **MOSTLY COMPLETE** |
| Track appointment | History and `TrackAppointment.jsx` | GET `/api/appointments/track-appointment`, filters today's visits | Loading/error/empty states; exact date string matching | **PARTIAL** |
| Prescription/history | History and doctor prescription component | GET prescription by appointment ID; patient view supported | Some prescription-load failures only log | **PARTIAL** |
| Prescription PDF | History `handleGeneratePdf` | Generates consultation snapshot, then merges fixed `/prescription.pdf` | Catch logs only; fixed asset is not tied to selected prescription | **BROKEN / POSSIBLE ISSUE** |
| Lab reports/requests | `/users/pages/lab/{requests,reports}`, `PatientLabPanel.jsx` | GET `/api/lab-requests/patient` and `/api/lab-reports`; details/download affordances | Filters, loading/error/empty states | **PARTIAL** |
| Medical requests | `/users/pages/medical`, `PatientMedicalPanel.jsx` | GET `/api/medical-requests/patient` | API-backed view | **PARTIAL** |
| Documents/files | `/users/pages/document`, `document/page.jsx` | GET `/licenseFile/files`, multipart POST `/licenseFile/upload?folder=...`, DELETE `/licenseFile/deleteFiles/:id`, S3 download | Upload progress/errors, PDF/image viewer, mobile drawer | **PARTIAL** |
| Document folders | Same | Folder create/delete is local React state only; deleting folder locally hides file rows without server delete calls | Name only checked for nonempty | **UI ONLY** |
| Feedback | Doctor detail `FeedbackSection.jsx` | GET doctor reviews; POST `/feedback/patient/:doctorId` | Login/rating/text checks, loading and success/error snackbar | **MOSTLY COMPLETE** |
| Notifications | Shared header `NotificationPopover.jsx` | GET `/api/notification/getNotifications` on open | Loading; errors clear list/log. No mark-read request found. | **PARTIAL** |
| Profile/address/emergency contact | `/users/pages/profile` | GET profile; PATCH `/user/updateProfile`, dirty-field payload includes nested address/emergency contact, language, health data | Save/loading/toast and profile reload; validation inconsistent | **MOSTLY COMPLETE** |
| Settings/language/dark mode | `/users/pages/setting`, patient profile, global theme | Password change/logout; language is profile field; theme global | No patient theme toggle identified | **PARTIAL** |
| QR | No patient QR page/menu found | No patient QR scan flow identified | Not linked | **NOT FOUND** |

**Patient journey:** Search → doctor details → booking → history/tracking → prescription/lab report is represented in frontend. Booking and report visibility remain partial; PDF export and folder persistence are defects. Backend behavior is unverified.

## 5. Doctor Features

| Feature | Page/component | API/action | States/limitations | Status |
|---|---|---|---|---|
| Dashboard/today metrics | `/doctor/pages/dashboard` | GET today appointments, today stats, graph in parallel | Explicit role 2 check; appointment loading; errors log and defaults remain | **MOSTLY COMPLETE** |
| Appointment list/status | Dashboard + patient table | API data drives counts/list; selection opens patient workflow | Empty/loading state; status mutation not established for every action | **PARTIAL** |
| Calendar/online/offline | `/doctor/pages/appointment`, `CalendarView.jsx` | GET appointment list/dashboard cards/patient detail | Day/week/month/year and filters; errors log; response mapping assumptions | **PARTIAL** |
| Calendar add/edit/delete/export | `CalendarView.jsx`, `useCalendar.js` | Add/edit/delete mutate local hook state; export only logs | No persistent mutation in hook | **UI ONLY** |
| Patient queue/details | `/doctor/pages/patient`, `patientContent.jsx`, `on-offCard.jsx` | GET hospitals/dashboard cards/appointments/details; prescription history and medical requests | Hospital/mode/status/date filters, pagination and dialogs | **MOSTLY COMPLETE** |
| Appointment token verification | `on-offCard.jsx`, `TokenVerificationDialog.jsx` | Verification service; pending appointments open token dialog | UI/API wiring exists; backend status transition unverified | **PARTIAL** |
| Prescription/consultation | `/doctor/pages/prescription`, `Prescription.jsx`, `PrescriptionUI.jsx` | GET by appointment; POST create/PUT update; diagnosis, medicines, remarks, follow-up | At least one medicine required; snackbar and refresh; five-minute edit limit is client-side | **MOSTLY COMPLETE** |
| Prescription PDF | `PrescriptionPdfView.jsx` and prescription components | PDF tooling/render/download | Data-to-PDF correctness not runtime-tested | **PARTIAL** |
| Lab requests/reports | Doctor lab pages and `LabTestRequestForm.jsx` | GET approved connections; POST one request per test; GET requests/reports; PATCH review/cancel; POST repeat | Per-test lab selection, priority/sample type, localStorage draft, errors/notices | **MOSTLY COMPLETE** |
| Medical requests | `/doctor/pages/medical`, medical request form | GET approved store connections; POST request | API wiring present; response/business behavior unverified | **PARTIAL** |
| Schedule/availability | `/doctor/pages/schedule` | GET hospitals/schedules; POST create, PUT update, DELETE, PATCH slot state | API services/forms exist; inconsistent error handling | **PARTIAL** |
| Profile | `/doctor/pages/profile` | Profile get/update and image/document upload components | Multiple profile state/service paths | **PARTIAL** |
| QR | Doctor profile can display assigned QR | Data/image URL from profile | No doctor-side management found | **PARTIAL** |
| Feedback | `/doctor/pages/feedback` | GET ratings and feedback list | Ratings call shown without bearer header; chart has static dataset; errors log | **PARTIAL** |
| Notifications/settings/dark mode | Shared header and `/doctor/pages/setting` | Notifications GET; password POST/logout; explicit theme control | Notification mark-read not found; doctor theme persists | **PARTIAL/MOSTLY COMPLETE** |

**Doctor journey:** Login → dashboard → appointment → patient → prescription → lab request → follow-up fields all exist, with prescription and lab request API calls. Calendar mutations and guaranteed appointment state transitions are not connected. Backend success is unverified.

## 6. Lab and Medical Store

| Lab workflow stage | Evidence | Status |
|---|---|---|
| Doctor searches/selects connected lab | `DoctorLabPanel`, `LabTestRequestForm`; lab search and approved connections | **IMPLEMENTED** (frontend call/UI) |
| Doctor requests tests | POST `/api/lab-requests/create` with lab/patient/appointment/tests/note/priority/sample | **IMPLEMENTED** (frontend call/UI) |
| Lab receives requests | `LabPanel` GET `/api/lab-requests/lab` with filters/paging | **IMPLEMENTED** (frontend call/UI) |
| Lab accepts/rejects/status | PATCH request status with expected report date/note | **IMPLEMENTED** (frontend call/UI) |
| Collection/sample details | PATCH collection slot/instructions/token and report date | **IMPLEMENTED** (frontend call/UI) |
| Technician assignment/tasks | Lab PATCH assignment; technician GET tasks | **IMPLEMENTED** (frontend call/UI) |
| Technician collection status | PATCH technician status; UI permits `SAMPLE_SCHEDULED` → `SAMPLE_COLLECTED` | **PARTIAL** |
| Lab report upload | Multipart POST `/api/lab-reports/upload` | **IMPLEMENTED** (frontend call/UI) |
| Doctor views/reviews report | GET reports; PATCH review comment | **IMPLEMENTED** (frontend call/UI) |
| Patient views/downloads report | Patient request/report views and download affordance | **PARTIAL**; backend cross-role availability unknown |

Lab journey is substantially represented; no frontend evidence proves server-side transitions, storage, emails, or cross-role authorization. Some doctor report views request current/old data with repeated calls.

**Medical store (role 6):** Dashboard, profile, connections, requests and reports. `MedicalPanel.jsx` reads profile/connections/requests and PATCHes connection/request status including notes, amount, batch/expiry, unit price and GST. Doctor-side connection/request creation exists. Invoice-like display is based on completed requests; no payment processing is established.

## 7. Assistant/Receptionist (Role 3)

| Feature | Actual evidence | Status |
|---|---|---|
| Login/dashboard | Role 3 login targets doctor dashboard, which rejects role 3; separate assistant dashboard is not the menu target | **BROKEN / POSSIBLE ISSUE** |
| Separate dashboard | `/doctorReceptionist/pages/dashboard` mounts doctor widgets without their required data props; patient dashboard cards are static | **UI ONLY** |
| Calendar/appointments | `/doctorReceptionist/pages/appointment` reuses doctor CalendarView | **PARTIAL** |
| Offline booking | `CalendarHeader.jsx` fetches hospital/slots and posts `/api/appointments/bookAppointmentByAssistant` | **BROKEN / POSSIBLE ISSUE**: selected `form.slotId` is omitted from body; errors only log, no success feedback |
| Patient details/queue | `/doctorReceptionist/pages/patient` reuses doctor patient components | **PARTIAL**; token-only route guard |
| Doctor search | No dedicated receptionist search page | **NOT FOUND** |
| Walk-in/token | Offline form plus shared token verification; separate walk-in workflow not verified | **PARTIAL** |
| Reschedule/cancel/schedule | Shared calendar state mutations local-only; no receptionist-specific persistent mutations found | **UI ONLY / NOT FOUND** |
| Payments/reports | No receptionist payment/report page found | **NOT FOUND** |
| Profile/settings/feedback | Routes exist | **PARTIAL** |

Exactly supported: receptionist can see shared calendar/patient views and invoke an offline booking form. Selected-slot persistence and successful booking are not established.

## 8. Admin

| Feature | Page/component and action | Status |
|---|---|---|
| Dashboard | `/admin/pages/dashboard`; role-5 check; GET admin card numbers | **PARTIAL**: charts/recent lists static |
| Patients/users | `/admin/pages/patient`; GET `/api/user/getAllUsers`, search/detail | **PARTIAL** read-only |
| Doctors | `/admin/pages/Doctor`; list/detail/status PATCH/QR assignment | **PARTIAL**: edit logs only, add dialog never opened, add callback logs only, spec/day filters empty |
| Doctor verification | `/admin/pages/Registration`; list/stats/documents and account assignment | **PARTIAL**: explicit approve/reject mutation not found; assignment posts `assistant-register` with role 2 |
| QR | `/admin/pages/qrcode`; details GET, generate POST; doctor assignment PUT | **MOSTLY COMPLETE** frontend wiring |
| Labs | `/admin/pages/labs`; list/create/status | **MOSTLY COMPLETE** frontend wiring and validation |
| Medical stores | `/admin/pages/medical`; list/create/status | **MOSTLY COMPLETE** frontend wiring and validation |
| Assistants | `/admin/pages/Assistant`; doctors and assistant profiles GET | **PARTIAL**; view action logs selected row |
| Hospitals | No admin hospital route/page found | **NOT FOUND** |
| Reports/analytics | `SummaryCard.jsx` chart data hard-coded; selector inert; no reports page | **UI ONLY / NOT FOUND** |
| Settings | `/admin/pages/setting` | **PARTIAL** |

## 9. Role Feature Matrix

✅ frontend available/wired · ⚠️ partial · 🎨 UI only · ❌ not found · 🔒 other role’s menu/route (not security authorization)

| Feature | Patient | Doctor | Lab | Receptionist | Admin | Medical | Technician |
|---|---|---|---|---|---|---|---|
| Dashboard | 🎨 | ✅ | ⚠️ | 🎨 | ⚠️ | ⚠️ | ✅ |
| Profile | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ |
| Doctor search | ✅ | 🔒 | 🔒 | ❌ | ⚠️ | 🔒 | 🔒 |
| Appointments | ⚠️ | ⚠️ | 🔒 | ⚠️ | ⚠️ | 🔒 | 🔒 |
| Schedule | ❌ | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| Prescription | ⚠️ | ✅ | 🔒 | ⚠️ | ❌ | 🔒 | 🔒 |
| Lab requests | ⚠️ | ✅ | ✅ | ❌ | ❌ | 🔒 | ⚠️ |
| Lab reports | ⚠️ | ✅ | ✅ | ❌ | ❌ | ❌ | ⚠️ |
| Documents | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| QR | ❌ | ⚠️ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Feedback | ✅ | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| Settings | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Dark mode | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

“Available” indicates frontend evidence only, not backend permission.

## 10. App Router Route Inventory

All `(dashboard)` routes use the shared token guard. Explicit role checks are called out; “No” means none was found in inspected page/component path.

| Route | Role / purpose | Protected? | Role check? | Status/notes |
|---|---|---:|---:|---|
| `/` | Public landing | No | No | Present |
| `/reset-password/[token]` | Public password reset | No | No | Present |
| `/Home/landingPage` | Public landing | No | No | Present |
| `/Home/pages/About` | Public About | No | No | Static stats |
| `/Home/pages/AllDoctors` | Public doctor directory | No | No | API-backed |
| `/Home/pages/Appointment` | Public appointment | No | No | Present |
| `/Home/pages/Contact` | Public contact | No | No | Present |
| `/Home/pages/DoctorRegister` | Doctor onboarding | No | No | API calls present |
| `/Home/pages/FAQ` | Public FAQ | No | No | Present |
| `/Home/pages/Login` | Login | No | No | Role 3/7 redirect issues |
| `/Home/pages/Register` | Patient register | No | No | API role 1 |
| `/Home/pages/search` | Doctor search | No | No | API-backed |
| `/Home/pages/verify-email/[token]` | Email verification | No | No | `/support` link dead |
| `/users/pages/Appointment` | Patient booking | Yes | No | Partial; expected matching-slot target |
| `/users/pages/DoctorDetail` | Patient doctor detail | Yes | No | API-backed |
| `/users/pages/Favorites` | Patient favorites | Yes | No | Static demo, unlinked |
| `/users/pages/dashboard` | Patient metrics | Yes | Component: role 1 | Fixed values; unlinked |
| `/users/pages/document` | Patient files | Yes | No | API file actions; folders local |
| `/users/pages/doctor` | Patient doctor search | Yes | No | API-backed |
| `/users/pages/history` | Patient appointments | Yes | No | API-backed; PDF issue |
| `/users/pages/lab/reports` | Patient lab reports | Yes | No | API-backed |
| `/users/pages/lab/requests` | Patient lab requests | Yes | No | API-backed |
| `/users/pages/medical` | Patient medical requests | Yes | No | API-backed |
| `/users/pages/profile` | Patient profile | Yes | No | API update |
| `/users/pages/setting` | Patient settings | Yes | No | Password/logout |
| `/doctor/pages/appointment` | Doctor calendar | Yes | No | Mutations local |
| `/doctor/pages/dashboard` | Doctor dashboard | Yes | Yes, role 2 | Rejects role 3 |
| `/doctor/pages/doctorReceptionistUser` | Doctor assistants | Yes | No | API list/create |
| `/doctor/pages/feedback` | Doctor feedback | Yes | No | API list, static chart elements |
| `/doctor/pages/lab/connections` | Doctor lab connections | Yes | No | API-backed |
| `/doctor/pages/lab/reports` | Doctor lab reports | Yes | No | API-backed |
| `/doctor/pages/lab/requests` | Doctor lab requests | Yes | No | API-backed |
| `/doctor/pages/medical` | Doctor medical requests | Yes | No | Partial |
| `/doctor/pages/patient` | Doctor patient queue | Yes | No | API-backed, shared role 3 |
| `/doctor/pages/prescription` | Doctor prescription | Yes | No | API create/update |
| `/doctor/pages/profile` | Doctor profile | Yes | No | Present |
| `/doctor/pages/reportPatient` | Patient report surface | Yes | No | Present, linked by prescription |
| `/doctor/pages/schedule` | Doctor schedule | Yes | No | API calls present |
| `/doctor/pages/setting` | Doctor settings | Yes | No | Password/theme/logout |
| `/doctorReceptionist/pages/appointment` | Role 3 shared calendar | Yes | No | Slot omitted from booking body |
| `/doctorReceptionist/pages/dashboard` | Role 3 dashboard | Yes | No | Unlinked/disconnected props |
| `/doctorReceptionist/pages/feedback` | Role 3 feedback | Yes | No | Present |
| `/doctorReceptionist/pages/patient` | Role 3 queue | Yes | No | Reuses doctor component |
| `/doctorReceptionist/pages/prescription` | Role 3 prescription | Yes | No | Shared workflow |
| `/doctorReceptionist/pages/profile` | Role 3 profile | Yes | No | Present |
| `/doctorReceptionist/pages/setting` | Role 3 settings | Yes | No | Present |
| `/lab/pages/connections` | Lab connections | Yes | No | API-backed |
| `/lab/pages/dashboard` | Lab dashboard | Yes | No | Loaded-data stats |
| `/lab/pages/profile` | Lab profile | Yes | No | API-backed read |
| `/lab/pages/reports` | Lab reports | Yes | No | API-backed |
| `/lab/pages/requests` | Lab requests | Yes | No | Status/collection/upload |
| `/lab/pages/setting` | Lab settings | Yes | No | Present |
| `/lab/pages/technician` | Lab technician tasks | Yes | No | API-backed; login redirect missing |
| `/lab/pages/technicians` | Lab technician management | Yes | No | API-backed |
| `/medical/pages/connections` | Medical connections | Yes | No | API-backed |
| `/medical/pages/dashboard` | Medical dashboard | Yes | No | Loaded-data counts |
| `/medical/pages/profile` | Medical profile | Yes | No | API-backed read |
| `/medical/pages/reports` | Medical reports | Yes | No | Partial |
| `/medical/pages/requests` | Medical requests | Yes | No | Status/amount updates |
| `/medical/pages/setting` | Medical settings | Yes | No | Present |
| `/admin/pages/Assistant` | Admin assistant list | Yes | No | View action logs |
| `/admin/pages/Doctor` | Admin doctor list | Yes | No | Edit/add incomplete |
| `/admin/pages/Registration` | Admin registration queue | Yes | No | Review incomplete |
| `/admin/pages/dashboard` | Admin dashboard | Yes | Yes, role 5 | Mixed static/API |
| `/admin/pages/labs` | Admin lab management | Yes | No | Create/status wired |
| `/admin/pages/medical` | Admin medical-store management | Yes | No | Create/status wired |
| `/admin/pages/patient` | Admin patients | Yes | No | Read/search |
| `/admin/pages/qrcode` | Admin QR | Yes | No | Generate/list; assignment elsewhere |
| `/admin/pages/setting` | Admin settings | Yes | No | Present |

**Unlinked/dead candidates:** Favorites and patient dashboard not in patient menu/login target; role-3 dashboard not menu/login target; empty `doctorReceptionist/components/AllPage.jsx`; `_app.jsx` in App Router tree; static receptionist request card not mounted. Alternate `admin/components/Dashboard/a.jsx` may be stale; confirm references before removal.

## 11. API Call Inventory (Deduplicated Families)

Methods/endpoints below reflect frontend call sites only. Query/body examples are what the inspected caller sends; server contract is not verified.

| Method / endpoint | Files / role | Frontend purpose and visible request data | Response/error handling |
|---|---|---|---|
| POST `/api/auth/login` | `Home/components/auth/LoginForm.jsx`; all | email/password | Saves token/refresh/user; timeout and status messages |
| POST `/api/auth/register` | `Home/components/auth/RegisterForm.jsx`; patient | name/email/phone/password/role 1 | Client validation and messages |
| POST `/api/auth/forgot-password`, `/api/auth/reset-password/:token` | Forgot/reset pages | Email or token/password | Page messages; backend unknown |
| GET `/api/auth/verify-email` | verify-email page | Token | Renders verification response |
| POST `/api/auth/refresh` | root + doctor clients | refresh token | Retry/queue; failure clears local storage and redirects `/login` |
| POST `/api/auth/change-password` | user/doctor settings | old/new password | Snackbar; doctor validates confirmation |
| GET/POST `/api/doctor-registration/*` | onboarding/verification/admin | get by ID; create/update; OTP; document upload; admin list/stats with page/limit/search/status/sort | Loading and errors vary; registration flow spans components |
| POST `/api/auth/assistant-register` | Admin/doctor assistant pages | User details and role 2/3 | Success/error messages vary |
| GET `/api/doctors/doctor/search` | Public/patient search | Search/city/filters/limit/offset | Normalized result list, pagination, errors |
| GET `/api/doctors/getAlldoctor`, `/api/doctors/getDoctors` | Admin | Pagination/search or doctor list | Admin list states; errors logged/snackbar |
| GET `/api/doctors/getDoctorPublicProfileById/:id` | Patient | Doctor ID | Loading/error/not found |
| GET `/api/doctors/admin/doctors/:userId`, PATCH `/api/doctors/doctors/:userId/status` | Admin | Doctor ID/status | Opens details/refetch; errors log |
| GET `/api/assistant/getAllAssistantProfiles/:doctorId` | Admin | Doctor ID | List/error notification |
| GET `/api/user/getProfile`, PATCH `/api/user/updateProfile` | Patient | Profile; dirty subset (address/emergency contact/language/health data) | Refresh after save; error toast |
| GET `/api/user/getAllUsers`, `/api/user/getPatientDetails/:id` | Admin/doctor/assistant | User list or patient/appointment ID | Search/dialog; failures vary |
| GET `/api/schedules/getHospitalsName`, `/api/schedules/getSchedulePublicByDoctorId/:id`, `/api/schedules/getScheduleById` | Patient/doctor/assistant | Hospital/schedule/doctor ID | Schedule selection; errors vary |
| POST/PUT/DELETE `/api/schedules/createSchedule`, `/api/schedules/updateSchedule/:id`, `/api/schedules/Delete/:id` | Doctor service | Schedule payload/ID | Generic service wrapper |
| PATCH `/api/schedules/:scheduleId/slots/:slotId/status`, `/api/schedules/Activate/:id` | Doctor | Slot/schedule status | Local update/refetch varies |
| GET `/api/appointments/doctor-slots` | Patient/assistant booking | Doctor, hospitalName, date (assistant caller omits doctor) | Slot lists; some errors log |
| GET `/api/appointments/today-appointments`, `/api/dashboard/today-stats`, `/api/dashboard/appointment-graph` | Doctor dashboard | Bearer token | Updates cards/graphs; errors log/defaults |
| GET `/api/appointments/patient-dashboard-cards` | Shared dashboard component | filter/mode | Response data or null; errors log |
| GET `/api/appointments/dashboard-cards`, `/api/appointments/getAllappoinment/my` | Calendar/history | Bearer or Axios token | Calendar/history mapping |
| GET `/api/appointments/view-e-visit`, `/api/appointments/getAppointments` | Doctor service | hospital/mode/status/slot_date/limit/offset | Generic service wrapper |
| POST `/api/appointments/create/:doctorId` | Patient | appointment date/time/reason/type/mode/token/hospital/optional patient | Refetch slots and snackbar |
| POST `/api/appointments/bookAppointmentByAssistant` | Assistant | offline date/hospital/patient/reason; chosen `slotId` omitted | Errors only log |
| PATCH `/api/appointments/:id/cancel` | Patient | Cancel reason | Local status update/snackbar |
| GET `/api/appointments/track-appointment` | Patient | No visible params | History polls at 15s; tracking dialog loads on open |
| GET `/api/appointments/verify-token/:token` | Doctor queue | Token | Token verification dialog; server behavior unknown |
| GET `/api/appointments/prescription`, POST `/api/prescriptions/save`, PUT `/api/prescriptions/update/:appointmentId` | Doctor | Appointment ID, diagnosis/remark/follow-up/medicines | Refresh and snackbar/error |
| GET `/api/appointments/getprescriptions` | Doctor patient details | user_id and optional date | History loading/error/empty |
| GET `/api/feedback/doctor/:id`, `/api/feedback/ratings`, `/api/feedback` | Patient/doctor | Doctor ID or user token | Patient handles errors; doctor mostly logs; ratings call has no shown auth header |
| POST `/feedback/patient/:doctorId` | Patient | Rating and feedback text | Refresh and snackbar |
| GET `/api/notification/getNotifications` | Shared header | Bearer token | Errors log and clear list; no mark-read call found |
| GET `/licenseFile/files`, POST `/licenseFile/upload?folder=...`, DELETE `/licenseFile/deleteFiles/:id` | Patient | Multipart file/folder/file ID; manual bearer | Upload progress, reload, alerts; S3 fetch for downloads |
| POST `/api/licenseFile/imageUpload`, `/api/licenseFile/upload` | Profile/onboarding | Multipart images/documents | Screen-level handling |
| GET `/api/labs/search`, `/api/labs/doctor/connections`, `/api/doctors/connections` | Doctor | Search/connection list | Normalization and errors |
| POST `/api/doctors/connections`, PATCH `/api/labs/connections/:id/status` | Doctor/lab | Connection request/status | Local status update/notice |
| GET `/api/lab-requests/doctor|lab|patient`, GET `/api/lab-reports` | Doctor/lab/patient | Search/status/date/page/pageSize/appointment filters | Lists, pagination, errors/empty |
| POST `/api/lab-requests/create` | Doctor | labId/patientId/appointment/tests/note/priority/sample | One call per test; 409 treated as duplicate |
| PATCH `/api/lab-requests/:id/status`, `/report-date`, `/collection-details`, `/cancel`; POST `/:id/repeat` | Lab/doctor | status/date/note/collection details or request ID | Local updates/notice/errors |
| POST `/api/lab-reports/upload`, DELETE `/api/lab-reports/:id`, PATCH `/api/lab-reports/:id/review` | Lab/doctor | Multipart file + request ID; report ID/comment | Upload/delete/review states and reload |
| GET/POST/PATCH `/api/lab-technicians`, `/tasks`, `/:id/assign`, `/:id/status` | Lab/technician | Technician payload/email, task filters, status | Reload/error states |
| GET/POST/PATCH `/api/medical-stores/*`, `/api/medical-requests/*` | Doctor/medical/patient | Search/connections/request fields/status/amount/batch/expiry/GST | Local update/error; no payment call found |
| GET `/api/dashboard/admin/cardNumber` | Admin | filter or startDate/endDate | Card data; errors log |
| GET/POST/PATCH `/admin/getLabDetails`, `/admin/createLabs`, `/admin/labs/:id/status` | Admin | Search/status/date; owner/lab payload; status | Validation/loading/snackbar |
| GET/POST/PATCH `/admin/getMedicalStoreDetails`, `/admin/createMedicalStores`, `/admin/medical-stores/:id/status` | Admin | Search/status/date; owner/store payload; status | Validation/loading/snackbar |
| GET/POST/PUT `/api/QR/details`, `/api/QR/generate`, `/api/QR/doctors/:userId/connect-qr` | Admin | page/limit, count, QR assignment list | Loading/pagination/validation/messages |
| GET `/api/doctor-registration/getAllDoctorRegistrations`, `/stats` | Admin | page/limit/search/status/sort | Abortable list; stats errors log |

### API configuration risks

- No hardcoded private IP found. Root Axios defaults to `http://localhost:4000`; commented localhost schedule URLs exist. Public Nominatim and randomuser/image URLs also occur.
- URL construction mixes env URLs, `/api`-suffixed `API_BASE_URL`, `${API_URL}/api/...`, relative Axios paths and manual `fetch`.
- Root Axios has bearer interceptor and refresh queue; doctor has another refresh client; direct Axios/fetch headers are inconsistent. Tokens are script-readable in localStorage; httpOnly cookie usage is not present in inspected frontend.
- Root client logs API URL. Refresh failure route is wrong. No definite infinite effect loop found; history polling is intentional. Doctor prescription lab refresh duplicates current/old list requests.
- Date formats include `YYYY-MM-DD`, `hh:mm A`, ISO slicing and locale strings. Timezone correctness is **NOT VERIFIED**.

## 12. Static Data, UI Quality and Code Quality

**Static/mock data found:** Patient `CardPage` metrics; admin `DashboardTables` sample names/IDs/cities/dates; admin `SummaryCard` chart arrays and inert month selector; doctor and receptionist feedback/chart arrays; random doctor patient-chart values; receptionist request cards; Favorites static doctor with simulated delay; calendar department/doctor constants; landing stats. Do not treat these as live metrics.

**Responsive/UI:** MUI breakpoints and mobile drawers are used; tables may scroll horizontally. Hardcoded `90vh/91vh`, fixed-width cards and some oversized grid tracks deserve real viewport checks. Loading/error states are strongest in newer admin/lab panels; older appointment/search/feedback paths often only log. Colors/radii/spacing/fonts vary and hardcoded white/hex styles reduce dark-mode consistency. Generic clickable Box elements and image labels need keyboard/contrast/alt review. No accessibility or visual test was run.

**Duplication/unused candidates:** Duplicate API clients and refresh implementations; nested/redundant Redux providers and doctor-specific store; large stateful orchestration (`on-offCard`, LabPanel); empty `doctorReceptionist/components/AllPage.jsx`; `_app.jsx` is not App Router; Favorites is unlinked/static; unused receptionist request card; possible alternate admin dashboard `a.jsx`. Verify import references before deleting. No specific dead imports were exhaustively catalogued.

**Files using real request data:** Doctor search/profile, booking, appointment history/tracking, patient profile, documents, doctor dashboard, patient queue, prescription, doctor/lab/medical requests, lab request/report/technician panels, admin doctor/patient/lab/store/QR/registration lists. “Real” here only means fetched from an API call.

## 13. Findings by Severity

| Severity | Role/page | File(s) | Problem and user impact | Suggested fix |
|---|---|---|---|---|
| **HIGH** | All dashboard roles | `ProtectedRoute.jsx`, `(dashboard)/layout.js` | Token-only guard; many routes lack role check; cross-role URLs render under client UI | Add UX role gates and enforce role/resource authorization in APIs; backend unknown |
| **HIGH** | Assistant login | `LoginForm.jsx`, doctor dashboard, `menuItems.jsx` | Role 3 is redirected to role-2-only dashboard and bounced to login | Route to assistant dashboard and correct menu target |
| **HIGH** | Lab technician login | `LoginForm.jsx`, `menuItems.jsx` | Role 7 has route/menu but no redirect branch | Add role-7 redirect and test |
| **HIGH** | Assistant booking | `doctor/components/calendar/CalendarHeader.jsx` | Selected slot ID omitted from booking body; errors only log | Confirm API contract, send selection, show success/error and refresh |
| **HIGH** | Patient documents | `users/pages/document/page.jsx` | Folder deletion hides rows but does not delete server files; folder structure local-only | Implement persistence/server delete or label local-only and avoid claiming files deleted |
| **HIGH** | Patient PDF | `users/pages/history/page.jsx` | Merges fixed `/prescription.pdf`, not selected visit prescription; errors only log | Generate from selected appointment data and expose errors |
| **HIGH** | Patient slot routing | `users/components/Profile/MatchingSlots.jsx` | Navigates to nonexistent `/dashboard/users/appointment` | Use `/users/pages/Appointment` and preserve doctor ID |
| **HIGH** | Refresh flow | `utils/axiosInstance.js`, `doctor/services/api.js` | Redirects to nonexistent `/login` | Centralize client and canonical login route |
| **MEDIUM** | Admin navigation | `admin/components/Dashboard/a.jsx` | Lowercase `doctor` link vs uppercase real route | Normalize route casing and validate every navigation target |
| **MEDIUM** | Admin doctor actions | `admin/pages/Doctor/page.jsx` | Edit logs only; add dialog never opens; add callback logs only; empty filters | Wire real actions or disable/remove controls |
| **MEDIUM** | Admin verification | `admin/pages/Registration/page.jsx`, `RegistrationTable.jsx` | Status/docs visible but explicit verify/reject mutation not found | Add clear review transitions/actions if required |
| **MEDIUM** | Admin/patient dashboards | `DashboardTables.jsx`, `SummaryCard.jsx`, `CardPage.jsx` | Fake operational values/charts | Replace with API data or unmistakable demo labels |
| **MEDIUM** | Doctor calendar | `calendar/hooks/useCalendar.js` | Add/edit/delete are local; export logs | Persist via service or remove misleading controls |
| **MEDIUM** | API integration | Multiple direct API call sites | Mixed base URL/auth/error behavior and duplicated refresh logic | Standardize clients/interceptors and endpoint helpers |
| **MEDIUM** | Notifications | `users/components/Header/NotificationPopover.jsx` | Read-only fetch; no mark-read call | Add supported read state mutation or label view-only |
| **LOW** | UI/theme | `globals.css`, `styles/theme.js`, role components | Hardcoded colors/fixed dimensions/inconsistent states and typography | Consolidate tokens and run browser viewport/accessibility checks |
| **LOW** | Theme setup | `app/layout.js`, `app/theme/globalTheme.js` | Unused ThemeRegistry plus active theme source | Confirm intent, remove/merge only after checking references |
| **LOW** | Code structure | Role component trees | Duplicate clients/providers, large orchestration, stale candidates | Refactor incrementally after tests and references are mapped |

## 14. P0 / P1 / P2

### P0 — Must fix before production

1. **Authorization boundary:** token-only routes are not role authorization. Add route UX gates and verify backend role/resource authorization.
2. **Role 3 and 7 entry:** fix receptionist/assistant redirect and missing technician redirect.
3. **Assistant booking:** include/verify selected slot and give visible result.
4. **Prescription export:** produce a visit-specific PDF, not a fixed public asset.
5. **Document deletion semantics:** prevent local-only disappearance from implying server deletion.
6. **Expired-session navigation:** redirect refresh failures to actual login and test refresh concurrency.

### P1 — Important

1. Fix matching-slot and case-sensitive admin routes.
2. Complete/disable Admin doctor add/edit and registration review controls.
3. Persist doctor calendar changes or remove misleading controls.
4. Replace or label static operational metrics.
5. Standardize URL/auth/error handling and remove production localhost fallback.
6. Give patient roles theme control and audit hardcoded colors.

### P2 — Improvements

1. Consolidate stores/providers/API clients after workflow stabilization.
2. Review stale/unlinked pages before removal.
3. Standardize date/timezone, validation, loading/empty/error states.
4. Add accessibility and mobile/tablet/desktop browser checks.
5. Reduce repeated current/old report API calls and review polling cadence.

## 15. Important Files

| File | Role/purpose | Important logic / API / issues |
|---|---|---|
| `src/app/Home/components/auth/LoginForm.jsx` | All; login and role redirects | localStorage auth; role 3/7 redirect defects |
| `src/app/(dashboard)/component/layout/ProtectedRoute/ProtectedRoute.jsx` | All; shared guard | Token-only check |
| `src/app/(dashboard)/layout.js` | All; shared shell | Header/sidebar and duplicate root provider |
| `src/app/(dashboard)/component/layout/menuItems.jsx` | All; role menus | Role 3 dashboard wrong |
| `src/utils/axiosInstance.js`, `src/config/api.js` | Shared API | localhost fallback, mixed URL patterns, wrong refresh redirect |
| `src/app/styles/theme.js` | All; theme | Persistent light/dark, doctor-only controls |
| `src/store/store.js`, `src/store/slices/userProfileSlice.js` | Shared/patient | Root profile state |
| `src/app/(dashboard)/users/components/Appointment/AppointmentClient.jsx` | Patient booking | schedules/slots/booking and validation |
| `src/app/(dashboard)/users/pages/history/page.jsx` | Patient history | tracking/cancel/PDF defect |
| `src/app/(dashboard)/users/pages/document/page.jsx` | Patient files | upload/download/delete; folders local-only |
| `src/app/(dashboard)/users/pages/profile/page.jsx` | Patient profile | dirty-field API update |
| `src/app/(dashboard)/doctor/pages/dashboard/page.jsx` | Doctor dashboard | role 2 check and dashboard API |
| `src/app/(dashboard)/doctor/components/CalendarView.jsx` | Doctor/assistant | calendar read/detail; local mutations via hook |
| `src/app/(dashboard)/doctor/components/calendar/CalendarHeader.jsx` | Assistant booking | Slot chooser and POST omitting slot ID |
| `src/app/(dashboard)/doctor/components/Patient/on-offCard.jsx` | Doctor/assistant | queue, token, patient details, records |
| `src/app/(dashboard)/doctor/components/Prescription/Prescription.jsx` | Doctor/patient view | prescription load/create/edit |
| `src/app/(dashboard)/doctor/components/Prescription/LabTestRequestForm.jsx` | Doctor | connected lab selection and requests |
| `src/app/(dashboard)/doctor/services/api.js` | Doctor API | separate client/refresh implementation |
| `src/app/(dashboard)/lab/components/LabPanel.jsx` | Lab | requests, collection, technician, upload/status |
| `src/app/(dashboard)/lab/components/TechnicianDashboard.jsx` | Technician | assigned tasks and limited state transition |
| `src/app/(dashboard)/doctorReceptionist/pages/appointment/page.jsx` | Assistant | reuses doctor calendar |
| `src/app/(dashboard)/admin/pages/Doctor/page.jsx` | Admin | list/detail/status/QR; add/edit incomplete |
| `src/app/(dashboard)/admin/pages/Registration/page.jsx` | Admin | registration list/stats/documents/assignment |
| `src/app/(dashboard)/admin/pages/qrcode/page.jsx` | Admin | QR details/generation |
| `src/app/(dashboard)/admin/components/Dashboard/DashboardTables.jsx` | Admin | Static sample rows |
| `src/app/(dashboard)/admin/components/Dashboard/SummaryCard.jsx` | Admin | Static charts and inert selector |
| `src/app/(dashboard)/users/components/Dashboard/CardPage.jsx` | Patient | Static metrics |

## 16. Module Completion Snapshot

| Module | UI | API integration | Validation | Loading/error | Responsive | Overall |
|---|---|---|---|---|---|---|
| Authentication | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Patient Dashboard | COMPLETE | NOT CONNECTED | N/A | NOT CONNECTED | PARTIAL | **UI ONLY** |
| Patient Profile | COMPLETE | MOSTLY COMPLETE | PARTIAL | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Doctor Search | COMPLETE | MOSTLY COMPLETE | PARTIAL | MOSTLY COMPLETE | MOSTLY COMPLETE | **MOSTLY COMPLETE** |
| Doctor Details | COMPLETE | MOSTLY COMPLETE | PARTIAL | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Appointment Booking | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Appointment History | COMPLETE | MOSTLY COMPLETE | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Prescription | COMPLETE | MOSTLY COMPLETE | PARTIAL | PARTIAL | PARTIAL | **MOSTLY COMPLETE** |
| Documents | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Lab | COMPLETE | MOSTLY COMPLETE | PARTIAL | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Doctor Dashboard | COMPLETE | MOSTLY COMPLETE | N/A | PARTIAL | PARTIAL | **MOSTLY COMPLETE** |
| Doctor Schedule | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Doctor Calendar | COMPLETE | PARTIAL | N/A | PARTIAL | PARTIAL | **PARTIAL** |
| Doctor Prescription | COMPLETE | MOSTLY COMPLETE | PARTIAL | PARTIAL | PARTIAL | **MOSTLY COMPLETE** |
| Doctor Feedback | COMPLETE | PARTIAL | N/A | PARTIAL | PARTIAL | **PARTIAL** |
| Doctor Lab | COMPLETE | MOSTLY COMPLETE | PARTIAL | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Admin Dashboard | COMPLETE | PARTIAL | N/A | PARTIAL | PARTIAL | **PARTIAL** |
| Admin Doctors | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Admin Labs | COMPLETE | MOSTLY COMPLETE | COMPLETE | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Admin QR | COMPLETE | MOSTLY COMPLETE | COMPLETE | MOSTLY COMPLETE | PARTIAL | **MOSTLY COMPLETE** |
| Receptionist | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Settings | COMPLETE | PARTIAL | PARTIAL | PARTIAL | PARTIAL | **PARTIAL** |
| Dark Mode | COMPLETE | N/A | N/A | N/A | PARTIAL | **PARTIAL** |

## 17. Final Summary

1. **Contains:** Multi-role healthcare frontend: public pages, auth, patient search/booking/records, doctor consultation/schedule, lab/medical-store workspaces, assistant screens, admin and QR tools.
2. **Roles:** Seven role IDs: patient, doctor, assistant/receptionist, lab, admin, medical store, technician.
3. **Patient can:** Search doctors, view profiles/reviews, attempt booking, view/cancel appointments, track today, edit profile, upload/download/delete individual files, view lab/medical requests and submit feedback.
4. **Patient missing/defective:** Verified role authorization, reliable prescription-specific PDF, persistent folders, QR flow, complete live dashboard and proven manual city selection.
5. **Doctor can:** View API-backed dashboard/appointments/patient details; create/edit prescriptions; request lab/medical services; manage schedules; review lab reports; access profile/settings and assigned QR display.
6. **Doctor missing/defective:** Persistent calendar mutations/export and verified appointment state transitions.
7. **Lab can:** Manage connection/request states, collection details, technicians and report uploads/deletes.
8. **Lab limitations:** Technician transition is narrow; backend state, storage and cross-role visibility are unknown.
9. **Receptionist can:** Access shared queue/calendar and an offline booking form; selected slot is not sent in the visible payload.
10. **Receptionist missing:** Reliable post-login dashboard, dedicated doctor search, confirmed persistent reschedule/cancel, payments and reports.
11. **Admin can:** View patients/doctors/registrations/assistants/labs/stores/QR, create labs/stores, toggle statuses, generate/assign QR.
12. **Admin missing:** Complete doctor add/edit, explicit verify/reject, hospital management, real analytics/report pages.
13. **Main connected workflows:** Patient search/detail/booking request; doctor patient/prescription/lab request; lab request/status/collection/report upload; admin QR and lab/store management.
14. **Partial workflows:** Patient booking/history/export, doctor calendar/schedule, receptionist booking, admin verification, cross-role report visibility.
15. **UI-only:** Patient metrics, Favorites demo, admin summary/recent rows, calendar local mutations/export, local folders and role-3 dashboard widgets.
16. **Main broken risks:** Role 3/7 redirects, patient slot URL, assistant slot payload, refresh login URL, static PDF, document folder semantics, admin route casing.
17. **API issues:** Mixed clients/base URLs/auth headers, localhost fallback, repeated calls, log-only failures and date/time ambiguity; server behavior cannot be established.
18. **Auth issues:** localStorage tokens and token-only route guard; all backend authorization remains unverified.
19. **Next work:** Fix P0 access and workflow integrity, then complete admin/receptionist actions, replace mock operational values, and run browser/a11y QA.

## Validation

- `npm run lint`: failed with 355 findings (352 errors, 3 warnings); ESLint scanned generated `dist` bundles/vendor chunks.
- `npx eslint src`: completed with no output (source-only lint passed).
- No application source was modified. No backend calls or browser/device visual QA were performed.