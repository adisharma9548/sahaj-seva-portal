# Sahaj Seva Portal - Data Sources & Verification Register

This document tracks all real-world administrative reference data imported into the Sahaj Seva Portal database. In accordance with the project's zero-fabrication guidelines, no synthetic or hallucinated service requirements, fees, or SLAs are used for reference baselines.

---

## 1. Reference Data Inventory

| Entity Code | Entity Name / Service | Official Source Authority | Reference URL / Gazette | Last Verified |
| :--- | :--- | :--- | :--- | :--- |
| `OFF-TEH-SADAR` | Tehsil Ghaziabad (Sadar) | UP Local Government Directory (LGD) | [lgdirectory.gov.in](https://lgdirectory.gov.in) | 2026-03-01 |
| `OFF-TEH-MODI` | Tehsil Modinagar | UP Local Government Directory (LGD) | [lgdirectory.gov.in](https://lgdirectory.gov.in) | 2026-03-01 |
| `OFF-TEH-LONI` | Tehsil Loni | UP Local Government Directory (LGD) | [lgdirectory.gov.in](https://lgdirectory.gov.in) | 2026-03-01 |
| `OFF-NN-CITY` | Nagar Nigam Ghaziabad HQ | Ghaziabad Nagar Nigam Citizen Portal | [onlinegnn.com](https://onlinegnn.com) | 2026-03-01 |
| `OFF-NN-KAVI` | Nagar Nigam Kavi Nagar Zone | Ghaziabad Nagar Nigam Zone Directory | [onlinegnn.com](https://onlinegnn.com) | 2026-03-01 |
| `OFF-NN-VIJAY` | Nagar Nigam Vijay Nagar Zone | Ghaziabad Nagar Nigam Zone Directory | [onlinegnn.com](https://onlinegnn.com) | 2026-03-01 |
| `OFF-RTO-GZB` | Regional Transport Office Ghaziabad | UP Transport Department Citizen Charter | [uptransport.upsdc.gov.in](http://uptransport.upsdc.gov.in) | 2026-03-01 |
| `OFF-DSO-GZB` | District Supply Office Ghaziabad | UP Food & Civil Supplies Department | [fcs.up.gov.in](https://fcs.up.gov.in) | 2026-03-01 |
| `SRV-INC` | Income Certificate | UP e-District Citizen Charter & Revenue Dept | [edistrict.up.gov.in](https://edistrict.up.gov.in) | 2026-03-01 |
| `SRV-CAST` | Caste Certificate | UP e-District Citizen Charter & Revenue Dept | [edistrict.up.gov.in](https://edistrict.up.gov.in) | 2026-03-01 |
| `SRV-DOM` | Domicile/Residence Certificate | UP e-District Citizen Charter & Revenue Dept | [edistrict.up.gov.in](https://edistrict.up.gov.in) | 2026-03-01 |
| `SRV-RAT` | Ration Card (New/Update) | National Food Security Act & FCS UP Portal | [fcs.up.gov.in](https://fcs.up.gov.in) | 2026-03-01 |
| `SRV-MUT` | Property Mutation (Dakhil-Kharij) | UP Revenue Code 2006 & UP Bhulekh | [upbhulekh.gov.in](https://upbhulekh.gov.in) | 2026-03-01 |
| `SRV-BIRTH` | Birth Certificate | Registration of Births and Deaths Act (CRS) | [crsorgi.gov.in](https://crsorgi.gov.in) | 2026-03-01 |
| `SRV-DEATH` | Death Certificate | Registration of Births and Deaths Act (CRS) | [crsorgi.gov.in](https://crsorgi.gov.in) | 2026-03-01 |
| `SRV-DL-LRN` | Driving Licence (Learner) | MoRTH Parivahan Portal | [parivahan.gov.in](https://parivahan.gov.in) | 2026-03-01 |
| `SRV-PEN` | Old-Age / Widow Pension | UP Social Welfare Integrated Pension Portal | [sspy-up.gov.in](https://sspy-up.gov.in) | 2026-03-01 |
| `SRV-UTIL` | Water / Electricity Connection | UPPCL Jhatpat Portal & GNN Jal Kal | [jhatpat.uppcl.org](https://jhatpat.uppcl.org) | 2026-03-01 |
| `SRV-ARMS` | Arms Licence Renewal | Arms Act 1959 & Ghaziabad DM Arms Section | Ghaziabad Collectorate Citizen Notice | 2026-03-01 |
| `SRV-MARR` | Marriage Registration | UP Stamp & Registration Dept (IGRSUP) | [igrsup.gov.in](https://igrsup.gov.in) | 2026-03-01 |
| `SRV-VEH-FIT`| Commercial Vehicle Fitness | Central Motor Vehicles Rules 1989 & RTO | Parivahan Commercial Fitness Track | 2026-03-01 |

---

## 2. Open Government Data Licensing & Compliance
- Data extracted is strictly public statutory domain information (forms, statutory government fees, notification deadlines under the UP Janhit Guarantee Act, and office contact coordinates).
- No automated scraping or rate-limited endpoints were abused.
- In compliance with the Digital Personal Data Protection (DPDP) Act 2023, reference data contains zero citizen PII.

---

## 3. Pre-Production Verification Checklist (TODO for Administrator)

Before commissioning Sahaj Seva Portal in another district or for state-wide UP deployment, the district nodal officer or CDO technical team must verify:
- [ ] **Statutory Fee Updates**: Confirm current government user fees against the latest UP Government Finance Department notification (some e-District user charges receive periodic indexation).
- [ ] **SLA Days (UP Janhit Guarantee Act)**: Confirm if expedited tatkal SLAs exist for certain certificates in Ghaziabad district.
- [ ] **Office Geo-Coordinates**: Re-verify GPS latitudes and longitudes for sub-divisional satellite counters and newly created sub-tehsils.
- [ ] **Service Categorization**: Verify if Sub-Registrar property registration slots link directly to the state C-DAC appointment API or local queue server.
