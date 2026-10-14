# Testing & Verification Guide: Sahaj Seva Portal
> **Ghaziabad Seva First Innovation Challenge 2026 — Problem Statement 9: Reducing Repeated Visits**

This document provides end-to-end manual testing instructions for all three core user journeys: Citizen, Officer, and District Admin.

---

## 🧪 Flow 1: End-to-End Citizen Journey (Mobile & Desktop)

### Objective
Verify that a citizen can find an exact service guide, answer personalized questions, upload documents with pre-check validation, book an appointment, and track status without repeated office trips.

### Test Steps
1. **Explore Home & Service Directory:**
   - Navigate to `http://localhost:3000/`.
   - Verify bilingual toggle: Click **हिन्दी** in header -> observe all UI elements render in Hindi; switch back to **English**.
   - In the search bar, type `Income` -> observe live suggestions appear.
   - Click **"Plain Guide →"** for Income Certificate (`/services/SRV-INC`).
   - Confirm all accepted alternatives are listed (e.g., *Aadhaar Card OR Voter ID OR PAN Card*).
   - Review the **"Common Mistakes That Cause Rejection"** alert box.

2. **Generate Personalized Smart Checklist:**
   - Navigate to `/checklist`.
   - Select service: *Income Certificate*.
   - Change employment type to *Self-Employed / Shopkeeper*.
   - Observe tailored advice banner: explains *notarized affidavit on ₹10 e-stamp is mandatory; do not buy ₹50 stamp*.
   - Click **"Download Custom Checklist (PDF)"** -> verify print preview dialog opens cleanly.

3. **Multi-Step Application & Rule Pre-Check Catch:**
   - Click **"Apply for this Service"** (`/apply?serviceId=SRV-INC`).
   - Step 1: Confirm citizen name *Ramesh Sharma*, phone *9999999999*, and masked Aadhaar `XXXX-XXXX-4819`. Click **Next: Upload Documents**.
   - Step 2: Under *Address Proof*, click the red button **"⚡ Test Defect"** to simulate an outdated bill (`expired_electricity_bill_april2026.pdf`). Under other documents, click **Upload File**. Ensure privacy consent checkbox is checked. Click **"Run Document Pre-Check"**.
   - Step 3 (Pre-Check Results):
     - Verify Visit-Ready Score drops to **42% (RED / DEFECT)**.
     - Verify exact rule alert: *"Electricity Bill is older than 90 days. Upload latest bill or active bank passbook."*
     - Click **"Replace with Clean Scan & Re-Check"**.
     - Observe Visit-Ready Score rises to **98% (GREEN / PASS)**!
   - Step 4: Click **"Submit Verified Application"** -> observe confirmed tracking number generated (e.g. `GZB-INC-2026-XXXX`).

4. **Slot Booking & QR E-Token:**
   - Click **"Book 15-Min Slot & QR Token"** (`/slots`).
   - Select *Tehsil Ghaziabad (Sadar)* and tomorrow's date.
   - Choose time slot `10:15 AM - 10:30 AM` (estimated queue wait: 2 mins).
   - Click **"Reserve Slot & Get Token"**.
   - Verify official QR e-token card renders with token number (e.g. `GZB-T104`).

5. **Live Tracking:**
   - Navigate to `/track` with the generated tracking number.
   - Observe courier-style horizontal timeline with all 4 stages.
   - Confirm handling desk: *Desk 3 - Scrutiny Officer* at *Tehsil Ghaziabad (Sadar)*.

---

## 👮 Flow 2: Counter Officer Verification & Counter Mode

### Objective
Verify front-desk officer scrutiny, defect notifications via SMS, and the <2 minute counter mode visit with repeat-visit reason capture.

### Test Steps
1. **Switch Role to Counter Officer:**
   - In the top-right persona dropdown, select **"Counter Officer: Desk 3"** (`officer@seva.demo`).
   - Click **"Officer Desk"** in the navigation bar (`/officer/queue`).

2. **Document Verification Queue:**
   - In the left pane, click an application awaiting scrutiny.
   - Verify side-by-side view: mock document preview on the left, scrutiny checklist on the right.
   - Action 1: Click **"Request Correction"** -> select *Electricity bill older than 90 days* -> verify status updates and automated SMS is sent to citizen.
   - Action 2: Click **"Approve & Issue Certificate (0 Visits)"** -> verify application is marked *Approved & Issued*.

3. **Fast Counter Mode (< 2 Minutes):**
   - Click **"2-Min Counter Mode"** (`/officer/counter`).
   - Click one of the pre-filled demo tokens (e.g. `GZB-T104`) and click **"Retrieve File"**.
   - Observe real-time stopwatch starts counting elapsed seconds.
   - Review pre-verified file details and check off physical Aadhaar inspection.
   - **Case A (Success):** Click **"Mark Visit Completed (Under 2 Min)"** -> visit finishes in <2 mins and status marks issued.
   - **Case B (Repeat Visit Logger):** Click **"Citizen Must Return"** -> select repeat reason: *Missing affidavit on prescribed stamp paper* -> click **"Log Repeat Visit & Update District Analytics"** -> observe the reason feeds directly into the CDO dashboard!

4. **Officer Workload & SLA Timers:**
   - Click **"My Workload & SLA"** (`/officer/workload`).
   - Observe the table of pending applications.
   - Verify SLA countdown: files near 24-48 hours show **amber/red pulsing alert badges**.

---

## 🏛️ Flow 3: Office Head & District CDO Analytics Dashboard

### Objective
Verify that district leadership has complete transparency into repeat visits, SLA pendency, and automated recommendations.

### Test Steps
1. **Switch Role to District Admin (CDO):**
   - In the persona dropdown, switch to **"District Admin (CDO)"** (`cdo@seva.demo`).
   - Click **"District Analytics"** in header (`/admin/analytics`).

2. **Repeat Visit Analytics:**
   - Verify **Before/After Impact Benchmark**:
     - Baseline Without Portal: **3.2 Visits Avg**
     - With Sahaj Portal: **1.1 Visits Avg**
   - Check **Top Drivers of Repeat Visits** chart: verifies reasons like *Missing affidavit* and *Signature mismatch*.
   - Check **Repeat Visit Rate by Service (%)** chart.
   - Check **Offices Ranked by Efficiency**: ranks all 8 offices with efficiency scores out of 100.

3. **Pendency & Ageing Buckets:**
   - Navigate to `/admin/pendency`.
   - Observe **0-3, 4-7, 8-15, and 15+ Days** bar chart.

4. **District Geospatial Map:**
   - Navigate to `/admin/map`.
   - Verify interactive map showing all 8 Ghaziabad offices.
   - Click any office marker (e.g. *Tehsil Modinagar* or *Tehsil Loni*) -> observe its repeat visit rate, efficiency score, and coordinates update in the right inspection card.

5. **Automated Insights & Weekly PDF Export:**
   - Navigate to `/admin/insights`.
   - Read plain-language administrative directives (e.g. *Update pre-check rules for missing affidavits*).
   - Click **"Export Weekly Report PDF"** -> verify report layout opens in print preview with CDO signature block.

6. **Public QR Verification Check:**
   - Navigate to `/downloads`.
   - Click **"View & Download PDF"** on any approved certificate.
   - Click the QR verification link or open `/verify/GZB-INC-2026-0001`.
   - Verify page confirms **"Document Authenticity Verified: Genuine & Active"**.
