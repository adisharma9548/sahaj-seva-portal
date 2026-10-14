# Design Decisions & Architectural Assumptions (DECISIONS.md)
> **Sahaj Seva Portal — Ghaziabad Seva First Innovation Challenge 2026 (Problem Statement 9)**

This document records the architectural choices, assumptions, trade-offs, and production deployment considerations made during the development of Sahaj Seva Portal.

---

## 1. Database & Zero-Setup Demo Strategy
- **Decision:** Use Prisma with a local SQLite database (`prisma/dev.db`) for default execution, combined with a comprehensive seed script (`prisma/seed.js`) generating 310 applications across 8 offices and 10 public services.
- **Rationale:** The prompt strictly mandated *zero setup in demo mode* without external database credentials or network keys. SQLite runs in-process with zero configuration on Windows, macOS, or Linux, while Prisma ensures 100% schema compatibility with production PostgreSQL.
- **Migration Path:** Changing `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma` and providing a standard connection string allows immediate production scaling.

---

## 2. Document Pre-Check & "AI Check" Transparency
- **Decision:** Implement a rule-based validation engine in `src/lib/precheck-rules.ts` (file size bounds, mime-type verification, expiry-date age bounds, clarity heuristic) paired with an explicit simulated AI evaluation score (0-100%).
- **Rationale:** The prompt explicitly instructed: *"do NOT claim real OCR unless implemented; rule-based validator plus a simulated AI check with a clear label"*. We added a prominent UI badge reading: `Simulated Rule-based & Heuristic AI Pre-check (Zero OCR Hallucination)` to maintain strict engineering honesty.
- **Deliberate Error Simulation:** Added a `⚡ Test Defect` button in the upload wizard to allow evaluators to immediately experience the pre-check engine catching an expired document (bill older than 90 days) and dropping the Visit-Ready Score to 42%.

---

## 3. Privacy & DPDP Compliance (Masked Identifiers)
- **Decision:** Strict masking of Aadhaar numbers everywhere on screen (`XXXX-XXXX-last4`), explicit consent checkboxes before file upload, and a working **"Delete My Data"** option in the footer.
- **Rationale:** India's Digital Personal Data Protection (DPDP) Act mandates purpose limitation, data minimization, and the citizen's right to erasure. Even in a prototype, sensitive identity numbers should never be rendered in plaintext.
- **Prototype Disclaimer:** Included prominent notices in the header and footer stating: *"Prototype; designed to integrate with e-District / existing government systems"*.

---

## 4. Before/After Impact Comparison Labeling
- **Decision:** Display the baseline metric ("Without portal: 3.2 average visits") alongside the portal target ("With portal: 1.1 average visits"), with an explicit label: `ILLUSTRATIVE SAMPLE DATA`.
- **Rationale:** The prompt required: *"demo numbers clearly marked as sample data... Do not present these as real measured results"*.

---

## 5. Mobile-Responsive Citizen Side (360px viewport)
- **Decision:** Built mobile-first for citizen pages (tested down to 360px width) with large tap targets (minimum 44px), high-contrast text (WCAG AA), and big accessible action buttons.
- **Rationale:** In Uttar Pradesh, the majority of citizens access government web services via budget mobile devices on mobile web browsers rather than desktop PCs.

---

## 6. Deployment Notes for Vercel
To deploy this project to Vercel:
1. Connect Git repository to Vercel.
2. Build Command: `npm run build` (which executes `prisma generate && next build`).
3. Output Directory: `.next`.
4. If deploying with a real cloud database, supply the `DATABASE_URL` environment variable pointing to Supabase, Neon, or AWS RDS PostgreSQL.
5. In serverless environments, file uploads can be hooked to AWS S3 or Cloudflare R2 presigned URLs.
