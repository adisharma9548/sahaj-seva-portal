# Sahaj Seva Portal (सहज सेवा पोर्टल)
> *"Ek baar mein kaam, bar bar ka chakkar khatam"* (एक बार में काम, बार-बार का चक्कर खत्म)  
> **Ghaziabad Seva First Innovation Challenge 2026 — Problem Statement 9: Reducing Repeated Visits to Government Offices**

---

## 🌟 Executive Overview
In Ghaziabad district offices (Tehsils Sadar, Modinagar, Loni, Nagar Nigam zones, RTO, and DSO), citizens historically averaged **3.2 in-person visits per application**. The primary root causes were:
1. **Wrong or incomplete documents:** citizens arriving without notarized stamp papers, expired bills, or mismatching affidavits.
2. **Procedural opacity:** lack of clear, plain-language guidance on accepted alternatives (e.g. Aadhaar vs Voter ID vs Passport).
3. **Unscheduled queues & bottleneck counters:** waiting for hours only to be turned away at the front desk.
4. **Lack of administrative visibility:** district heads (SDMs and CDO) had no real-time telemetry on which offices or services caused the most repeat re-work.

**Sahaj Seva Portal solves this end-to-end:**
- **Zero or One Visit Target:** Physical visits are eliminated for online revenue & municipal certificates (0 visits), and strictly capped at 1 scheduled 15-minute slot for legal deeds or biometric tests (e.g., Property Mutation, Learner DL).
- **Rule-based & AI Pre-Check:** Analyzes uploaded documents at home *before submission*. Detects expired utility bills (>90 days), missing notary stamps, low-resolution scans, and gives a **Visit-Ready Score (0 to 100%)**.
- **15-Minute Guaranteed Slot & QR E-Token:** Scheduled appointment with live queue estimation (~2-3 minute wait time).
- **Courier-Style Live Tracker:** Citizen sees exactly which officer desk has their file and gets explicit plain-language instructions if an issue arises.
- **Fast Counter Mode (< 2 minutes):** Counter officers scan citizen QR tokens to view pre-verified files in seconds, logging the exact root cause if an unavoidable repeat visit is required.
- **District Admin Repeat Visit Analytics:** Real-time CDO dashboard showcasing before/after benchmarks, top drivers of repeat visits, service rework rankings, SLA ageing buckets, and automated recommendations.

---

## 🚀 Quick Start (Zero Setup in Demo Mode)

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm 9+

### Installation & Run
```bash
# 1. Clone or open directory
cd "c:\Users\adish\Videos\SAHAJ SEVA PORTAL"

# 2. Install dependencies (Next 14, Tailwind, Prisma, Lucide, Recharts)
npm install

# 3. Initialize SQLite database & seed 310 applications + 8 offices + 10 services
npm run seed

# 4. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Demo Logins & Personas

The portal comes with 4 pre-configured role personas accessible via the **top-right persona switcher**:

| Role | Demo Credentials | Primary Workspaces |
| :--- | :--- | :--- |
| **Citizen** | Phone: `9999999999` (Mock OTP: `123456`) | Service Finder, Smart Checklist, Apply & Pre-Check, Slot Booking, Live Tracker, Downloads |
| **Counter Officer** | `officer@seva.demo` / `off123` | Scrutiny Desk Verification Queue, 2-Minute Counter Mode (<2 min visits), Workload SLA Timers |
| **Department Head / SDM** | `head@seva.demo` / `head123` | Tehsil Sadar Slot Management, Stuck File Escalations & Grievance Resolution |
| **District Admin (CDO)** | `cdo@seva.demo` / `cdo123` | District Repeat Visit Analytics, SLA Ageing Buckets, Geospatial Map, Auto-Insights |

---

## ⚡ How Demo Mode Works
- **Zero External Dependencies:** No external API keys (Twilio, AWS S3, or OpenAI) are needed. Runs self-contained on SQLite.
- **Simulated Communications:** All SMS and WhatsApp notification dispatches are routed to the interactive **Notifications Center** (`/notifications`).
- **Pre-loaded Seed Dataset:** Seed script loads **310 realistic applications** across 8 Ghaziabad offices, pre-populating repeat visit reasons, slot bookings, and SLA ageing states.
- **Simulate Citizen Journey:** Click the **"Simulate Citizen Journey"** button in the header at any time for a guided walkthrough:
  1. Service selection (Income Certificate).
  2. Personalized 3-question checklist generation.
  3. Upload with deliberate defective document (bill older than 90 days).
  4. Pre-check catches the error and drops score to 42% (Amber/Red).
  5. One-click document fix -> score jumps to 98% (Green).
  6. Submits with tracking number.
  7. Fast-forward to officer scrutiny -> instant approval & digitally signed certificate generation!

---

## 🔄 Switching to a Real Production Backend
To migrate from local Demo Mode to a production PostgreSQL database and live external integrations:

1. **Database (Prisma):**
   Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Environment Variables:**
   Set `.env.production`:
   ```env
   DATABASE_URL="postgresql://user:password@aws-rds.amazonaws.com:5432/sahaj_seva"
   NEXT_PUBLIC_DEMO_MODE=false
   SMS_GATEWAY_API_KEY="your_cdac_msdg_sms_key"
   S3_BUCKET_NAME="ghaziabad-seva-documents"
   ```
3. **Repository Interface:**
   The repository layer (`src/lib/db.ts` and API routes) uses Prisma standard queries that execute identically on PostgreSQL with zero code refactoring.

---

## 📂 Project Architecture
```text
sahaj-seva-portal/
├── prisma/
│   ├── schema.prisma               # Prisma relational schema (SQLite / Postgres)
│   └── seed.js                     # Generates 8 offices, 10 services, 310 apps, slots, staff
├── src/
│   ├── app/
│   │   ├── page.tsx                # Citizen Home (Search, Direct Tracker, Impact panel)
│   │   ├── services/               # Plain-Language Service Guides & checklists
│   │   ├── checklist/              # Interactive 3-question personalized Smart Checklist
│   │   ├── apply/                  # Multi-step application with Camera & Rule Pre-Check
│   │   ├── slots/                  # Slot Booking (15-min slots, queue wait, QR e-token)
│   │   ├── track/                  # Courier-style Live Tracker with officer desk details
│   │   ├── notifications/          # Simulated SMS/WhatsApp notification center
│   │   ├── grievance/              # Direct SDM escalation ticket center
│   │   ├── downloads/              # Digitally signed certificate download center
│   │   ├── verify/[certId]/        # Public tamper-evident QR verification page
│   │   ├── officer/                # Front-Desk Officer Workspace
│   │   │   ├── queue/              # Side-by-side document scrutiny desk
│   │   │   ├── counter/            # 2-Minute Fast Counter Mode with repeat reason logger
│   │   │   └── workload/           # Workload monitoring with near-breach SLA countdowns
│   │   ├── admin/                  # Office Head & District CDO Dashboard
│   │   │   ├── analytics/          # Repeat Visit Analytics, before/after impact benchmarks
│   │   │   ├── pendency/           # Ageing buckets (0-3, 4-7, 8-15, 15+ days)
│   │   │   ├── slots/              # Hourly queue & capacity utilization
│   │   │   ├── map/                # Interactive District Geospatial Map
│   │   │   ├── insights/           # Automated plain-language recommendations & PDF export
│   │   │   ├── services/           # Service manager (fees, SLAs, slot limits)
│   │   │   └── audit/              # Staff accounts & vigilance audit trail
│   │   └── api/                    # Full REST API routes (services, apps, precheck, slots)
│   ├── components/                 # Reusable UI, Layout, Journey Modal, Charts
│   └── lib/                        # Precheck rules engine, Auth roles, i18n dictionary, Utils
├── DECISIONS.md                    # Architectural assumptions & rationale
├── TESTING.md                      # Manual test matrix
└── README.md
```
