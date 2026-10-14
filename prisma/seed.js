const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean existing data
  await prisma.visit.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.applicationEvent.deleteMany();
  await prisma.applicationDocument.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.notificationLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.serviceDocument.deleteMany();
  await prisma.service.deleteMany();
  await prisma.office.deleteMany();
  await prisma.user.deleteMany();

  // 1. Offices
  const officesData = [
    {
      code: "OFF-TEH-SADAR",
      name: "Tehsil Ghaziabad (Sadar)",
      nameHi: "तहसील गाज़ियाबाद (सदर)",
      address: "Collectorate Compound, Raj Nagar, Ghaziabad",
      zone: "Sadar",
      tehsil: "Ghaziabad",
      lat: 28.6692,
      lng: 77.4538,
      officerCount: 8,
      contactPhone: "0120-2820101",
    },
    {
      code: "OFF-TEH-MODI",
      name: "Tehsil Modinagar",
      nameHi: "तहसील मोदीनगर",
      address: "Delhi-Meerut Road, Modinagar",
      zone: "Modinagar",
      tehsil: "Modinagar",
      lat: 28.834,
      lng: 77.583,
      officerCount: 6,
      contactPhone: "01232-242200",
    },
    {
      code: "OFF-TEH-LONI",
      name: "Tehsil Loni",
      nameHi: "तहसील लोनी",
      address: "Pusta Road, Loni, Ghaziabad",
      zone: "Loni",
      tehsil: "Loni",
      lat: 28.7511,
      lng: 77.2882,
      officerCount: 7,
      contactPhone: "0120-2691122",
    },
    {
      code: "OFF-NN-CITY",
      name: "Nagar Nigam Head Office",
      nameHi: "नगर निगम मुख्यालय",
      address: "Navyug Market, Opp. Old Bus Stand, Ghaziabad",
      zone: "City",
      tehsil: "Ghaziabad",
      lat: 28.665,
      lng: 77.433,
      officerCount: 12,
      contactPhone: "0120-2790369",
    },
    {
      code: "OFF-NN-KAVI",
      name: "Nagar Nigam Kavi Nagar Zone",
      nameHi: "नगर निगम कवि नगर ज़ोन",
      address: "C-Block Market, Kavi Nagar, Ghaziabad",
      zone: "Kavi Nagar",
      tehsil: "Ghaziabad",
      lat: 28.674,
      lng: 77.465,
      officerCount: 5,
      contactPhone: "0120-2700445",
    },
    {
      code: "OFF-NN-VIJAY",
      name: "Nagar Nigam Vijay Nagar Zone",
      nameHi: "नगर निगम विजय नगर ज़ोन",
      address: "Sector 9, Vijay Nagar, Ghaziabad",
      zone: "Vijay Nagar",
      tehsil: "Ghaziabad",
      lat: 28.643,
      lng: 77.439,
      officerCount: 6,
      contactPhone: "0120-2841020",
    },
    {
      code: "OFF-RTO-GZB",
      name: "Regional Transport Office (RTO)",
      nameHi: "संभागीय परिवहन कार्यालय (RTO)",
      address: "Bulandshahr Road Industrial Area, Ghaziabad",
      zone: "Bulandshahr Road",
      tehsil: "Ghaziabad",
      lat: 28.658,
      lng: 77.481,
      officerCount: 9,
      contactPhone: "0120-2865200",
    },
    {
      code: "OFF-DSO-GZB",
      name: "District Supply Office (DSO)",
      nameHi: "जिला पूर्ति कार्यालय (DSO)",
      address: "Room 14, Collectorate, Ghaziabad",
      zone: "Collectorate",
      tehsil: "Ghaziabad",
      lat: 28.671,
      lng: 77.447,
      officerCount: 5,
      contactPhone: "0120-2820300",
    },
  ];

  const createdOffices = [];
  for (const o of officesData) {
    const off = await prisma.office.create({ data: o });
    createdOffices.push(off);
  }

  // 2. Demo Users
  const sadarOffice = createdOffices[0];
  await prisma.user.create({
    data: {
      phone: "9999999999",
      email: "citizen@seva.demo",
      name: "Ramesh Sharma",
      role: "CITIZEN",
    },
  });

  await prisma.user.create({
    data: {
      email: "officer@seva.demo",
      phone: "9811002233",
      name: "Anand Verma (Desk 3)",
      role: "OFFICER",
      officeId: sadarOffice.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "head@seva.demo",
      phone: "9811004455",
      name: "SDM Sadar Ghaziabad",
      role: "HEAD",
      officeId: sadarOffice.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "cdo@seva.demo",
      phone: "9811006677",
      name: "Chief Development Officer (CDO)",
      role: "CDO",
    },
  });

  // 3. Services (10 Services with detailed documents, checklists, mistakes, steps)
  const servicesConfig = [
    {
      code: "SRV-INC",
      name: "Income Certificate",
      nameHi: "आय प्रमाण पत्र",
      description: "Official certificate verifying family annual income for scholarships, subsidies, and schemes.",
      descriptionHi: "छात्रवृत्ति, सरकारी योजनाओं और सब्सिडी हेतु पारिवारिक वार्षिक आय का आधिकारिक प्रमाण पत्र।",
      category: "Revenue",
      fee: 20,
      slaDays: 7,
      physicalVisitRequired: false,
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Uploading an expired salary slip or unsigned self-declaration affidavit",
        "Name spelling mismatch between Aadhaar and ration card",
        "Blurry photo where face is unidentifiable",
        "Entering gross income instead of declared family income"
      ]),
      commonMistakesHi: JSON.stringify([
        "पुराना या बिना हस्ताक्षर वाला स्व-घोषणा शपथ पत्र अपलोड करना",
        "आधार कार्ड और राशन कार्ड में नाम की स्पेलिंग अलग होना",
        "धुंधली फोटो अपलोड करना जिसमें चेहरा स्पष्ट न हो",
        "सकल आय और शुद्ध पारिवारिक आय में भ्रम"
      ]),
      stepsJson: JSON.stringify([
        "Online Application Submission",
        "Pre-check Validation (Auto)",
        "Lekhpal Field Verification",
        "Nayab Tehsildar Digital Approval",
        "Download Digitally Signed Certificate"
      ]),
      docs: [
        {
          docCode: "DOC-ID",
          name: "Identity Proof",
          nameHi: "पहचान प्रमाण",
          isMandatory: true,
          alternatives: ["Aadhaar Card", "Voter ID Card", "PAN Card"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg", "png"] },
          order: 1
        },
        {
          docCode: "DOC-ADDR",
          name: "Address Proof",
          nameHi: "निवास प्रमाण",
          isMandatory: true,
          alternatives: ["Electricity Bill (last 3 months)", "Ration Card", "Water Bill"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg", "png"] },
          order: 2
        },
        {
          docCode: "DOC-INC-PROO",
          name: "Salary Slip or Self-Declaration",
          nameHi: "वेतन पर्ची या स्व-घोषणा शपथ पत्र",
          isMandatory: true,
          alternatives: ["Latest 3 Months Salary Slip", "Tehsil Notarized Affidavit", "Gram Pradhan / Parshad Certificate"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 3
        },
        {
          docCode: "DOC-PHOTO",
          name: "Passport Size Photograph",
          nameHi: "पासपोर्ट साइज फोटो",
          isMandatory: true,
          alternatives: ["Clear Passport Photo (plain background)"],
          criteria: { maxSizeMb: 1, allowedTypes: ["jpg", "png"] },
          order: 4
        }
      ]
    },
    {
      code: "SRV-CAST",
      name: "Caste Certificate",
      nameHi: "जाति प्रमाण पत्र",
      description: "Official certificate confirming SC / ST / OBC category eligibility for educational and employment reservations.",
      descriptionHi: "शिक्षा और नौकरी में आरक्षण और सरकारी योजनाओं हेतु जाति वर्ग का प्रमाण पत्र।",
      category: "Revenue",
      fee: 20,
      slaDays: 7,
      physicalVisitRequired: false,
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Attaching father's caste proof with mismatching lineage name",
        "Submitting outdated 1359 Fasli record without clear Khatauni number",
        "Missing self-declaration signature"
      ]),
      commonMistakesHi: JSON.stringify([
        "पिता के जाति प्रमाण पत्र में उपनाम मेल न खाना",
        "बिना खतौनी या पुराना अपठनीय दस्तावेज लगाना",
        "स्व-घोषणा पर हस्ताक्षर छूट जाना"
      ]),
      stepsJson: JSON.stringify([
        "Online Submission & Pre-Check",
        "Lekhpal Record Verification",
        "Tehsildar Review",
        "Digital Certificate Generation"
      ]),
      docs: [
        {
          docCode: "DOC-ID",
          name: "Applicant Aadhaar Card",
          nameHi: "आवेदक का आधार कार्ड",
          isMandatory: true,
          alternatives: ["Aadhaar Card"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-FAMILY-CASTE",
          name: "Family Caste Proof",
          nameHi: "पारिवारिक जाति प्रमाण (पिता/दादा)",
          isMandatory: true,
          alternatives: ["Father's Caste Certificate", "Grandfather Land Record/Khatauni", "School TC showing caste"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-PHOTO",
          name: "Applicant Photograph",
          nameHi: "आवेदक की फोटो",
          isMandatory: true,
          alternatives: ["Passport Photo"],
          criteria: { maxSizeMb: 1, allowedTypes: ["jpg", "png"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-DOM",
      name: "Domicile/Residence Certificate",
      nameHi: "मूल निवास प्रमाण पत्र",
      description: "Proof of permanent residence in Uttar Pradesh for competitive exams and state quota admissions.",
      descriptionHi: "उत्तर प्रदेश में स्थायी निवास का आधिकारिक प्रमाण पत्र (प्रवेश एवं सरकारी सेवाओं हेतु)।",
      category: "Revenue",
      fee: 20,
      slaDays: 7,
      physicalVisitRequired: false,
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Submitting proof for less than 3 continuous years of residence",
        "House registry without latest electricity bill",
        "Incomplete address details"
      ]),
      commonMistakesHi: JSON.stringify([
        "3 वर्ष से कम समय का निवास प्रमाण पत्र संलग्न करना",
        "बिना बिजली बिल के सिर्फ रजिस्ट्री लगाना",
        "अधूरा पता दर्ज करना"
      ]),
      stepsJson: JSON.stringify([
        "Form Filling & Document Check",
        "Ward/Gram Panchayat Verification",
        "Sub-Divisional Officer Approval",
        "Certificate Download with QR"
      ]),
      docs: [
        {
          docCode: "DOC-ID",
          name: "Aadhaar / Voter ID",
          nameHi: "आधार / मतदाता पहचान पत्र",
          isMandatory: true,
          alternatives: ["Aadhaar Card", "Voter ID Card"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-EDU-PROOF",
          name: "Education Proof (3+ yrs in UP)",
          nameHi: "शैक्षणिक प्रमाण (3+ वर्ष यूपी में)",
          isMandatory: true,
          alternatives: ["High School Certificate", "Continuous Electricity Bill (3 years)", "Father's Service Record"],
          criteria: { maxSizeMb: 4, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-PHOTO",
          name: "Passport Size Photograph",
          nameHi: "पासपोर्ट साइज फोटो",
          isMandatory: true,
          alternatives: ["Recent Color Photo"],
          criteria: { maxSizeMb: 1, allowedTypes: ["jpg", "png"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-RAT",
      name: "Ration Card (New / Modification)",
      nameHi: "राशन कार्ड (नया / संशोधन)",
      description: "NFSA subsidized foodgrain card for family units with family member addition/deletion.",
      descriptionHi: "खाद्य सुरक्षा योजना के तहत राशन कार्ड जारी करना या परिवार के सदस्य जोड़ना।",
      category: "Food & Civil Supplies",
      fee: 50,
      slaDays: 15,
      physicalVisitRequired: false,
      officeType: "DSO",
      commonMistakes: JSON.stringify([
        "Missing bank account details of female head of household",
        "Unlinked Aadhaar numbers of minor family members",
        "Duplicate family member listed in another active ration card"
      ]),
      commonMistakesHi: JSON.stringify([
        "महिला मुखिया के बैंक खाते की पासबुक न लगाना",
        "नाबालिग सदस्यों के आधार कार्ड संलग्न न करना",
        "पुराने जिले/पते से राशन कार्ड सरेंडर न कराना"
      ]),
      stepsJson: JSON.stringify([
        "Online Family Registration",
        "Food Inspector Verification",
        "Supply Officer Final Clearance",
        "Card Generation & FPS Assignment"
      ]),
      docs: [
        {
          docCode: "DOC-PASSBOOK",
          name: "Passbook of Female Head",
          nameHi: "महिला मुखिया की बैंक पासबुक",
          isMandatory: true,
          alternatives: ["Nationalised Bank Passbook with IFSC", "Post Office Bank Account"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-ALL-AADHAAR",
          name: "All Family Members Aadhaar Cards",
          nameHi: "परिवार के सभी सदस्यों के आधार कार्ड",
          isMandatory: true,
          alternatives: ["Combined PDF of all Aadhaar Cards"],
          criteria: { maxSizeMb: 5, allowedTypes: ["pdf"] },
          order: 2
        },
        {
          docCode: "DOC-GAS-CONN",
          name: "LPG Connection Proof",
          nameHi: "गैस कनेक्शन विवरण",
          isMandatory: false,
          alternatives: ["LPG Blue Book / Subscription Voucher"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-MUT",
      name: "Property Mutation (Dakhil-Kharij)",
      nameHi: "दाखिल-खारिज (नामांतरण)",
      description: "Transfer of property title in revenue records after sale deed purchase or inheritance.",
      descriptionHi: "बैनामा या वरासत के उपरांत सरकारी राजस्व रिकॉर्ड (खतौनी) में नाम दर्ज कराना।",
      category: "Revenue",
      fee: 150,
      slaDays: 35,
      physicalVisitRequired: true, // target 1 single scheduled slot
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Not providing registered sale deed certified copy",
        "Missing death certificate in case of ancestral inheritance (Varasat)",
        "Missing boundary map / Khasra description"
      ]),
      commonMistakesHi: JSON.stringify([
        "पंजीकृत बैनामा की स्पष्ट प्रति न लगाना",
        "वरासत के मामले में मृत्यु प्रमाण पत्र न होना",
        "खसरा नंबर या चौहद्दी का विवरण न होना"
      ]),
      stepsJson: JSON.stringify([
        "Application Submission & Deed Upload",
        "Document Pre-Screening & Notice Generation",
        "30-Day Public Objection Window",
        "Single Scheduled Registry Verification Slot",
        "Order Passed by Tehsildar & Khatauni Updated"
      ]),
      docs: [
        {
          docCode: "DOC-REG-DEED",
          name: "Registered Sale Deed / Will",
          nameHi: "पंजीकृत बैनामा / वसीयतनामा",
          isMandatory: true,
          alternatives: ["Registered Sale Deed Copy", "Sub-Registrar Certified Deed"],
          criteria: { maxSizeMb: 10, allowedTypes: ["pdf"] },
          order: 1
        },
        {
          docCode: "DOC-KHATAUNI",
          name: "Current Khatauni Copy",
          nameHi: "नवीनतम खतौनी नकल",
          isMandatory: true,
          alternatives: ["Certified Khatauni (Bhulekh)", "Khasra Map Copy"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-ID",
          name: "Buyer & Seller Identification",
          nameHi: "क्रेता एवं विक्रेता पहचान पत्र",
          isMandatory: true,
          alternatives: ["Aadhaar Cards of both parties"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-BIRTH",
      name: "Birth Certificate",
      nameHi: "जन्म प्रमाण पत्र",
      description: "Legal certificate recording birth details issued by Nagar Nigam Urban Health Department.",
      descriptionHi: "नगर निगम स्वास्थ्य विभाग द्वारा जारी आधिकारिक जन्म प्रमाण पत्र।",
      category: "Municipal",
      fee: 10,
      slaDays: 5,
      physicalVisitRequired: false,
      officeType: "Nagar Nigam",
      commonMistakes: JSON.stringify([
        "Spelling error in mother/father name compared to hospital discharge slip",
        "Delay beyond 21 days without SDM late permission order",
        "Missing hospital institutional discharge certificate"
      ]),
      commonMistakesHi: JSON.stringify([
        "अस्पताल की पर्ची और माता-पिता के आधार में नाम की भिन्नता",
        "21 दिन से अधिक विलंब पर एसडीएम आदेश संलग्न न करना",
        "अस्पताल का जन्म डिस्चार्ज प्रमाण पत्र न होना"
      ]),
      stepsJson: JSON.stringify([
        "Hospital Event Matching & Application",
        "Registrar Verification",
        "Medical Officer Sign-off",
        "QR Enabled Certificate Issuance"
      ]),
      docs: [
        {
          docCode: "DOC-HOSP-SLIP",
          name: "Hospital Birth Slip / Discharge Card",
          nameHi: "अस्पताल की जन्म पर्ची / डिस्चार्ज कार्ड",
          isMandatory: true,
          alternatives: ["Hospital Birth Report Slip", "Gram Pradhan Verification (if home birth)"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-PARENT-ID",
          name: "Parents Aadhaar Cards",
          nameHi: "माता और पिता के आधार कार्ड",
          isMandatory: true,
          alternatives: ["Combined Aadhaar of Parents"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        }
      ]
    },
    {
      code: "SRV-DEATH",
      name: "Death Certificate",
      nameHi: "मृत्यु प्रमाण पत्र",
      description: "Official record of death required for insurance, property succession, and legal claims.",
      descriptionHi: "बीमा, उत्तराधिकार एवं कानूनी औपचारिकताओं हेतु मृत्यु प्रमाण पत्र।",
      category: "Municipal",
      fee: 10,
      slaDays: 5,
      physicalVisitRequired: false,
      officeType: "Nagar Nigam",
      commonMistakes: JSON.stringify([
        "Missing cremation/burial ground receipt",
        "Doctor's medical cause of death certificate missing",
        "Date of death mismatch"
      ]),
      commonMistakesHi: JSON.stringify([
        "श्मशान घाट / कब्रिस्तान की रसीद संलग्न न करना",
        "चिकित्सक द्वारा मृत्यु का कारण पर्ची न लगाना",
        "मृत्यु की तिथि में विरोधाभास"
      ]),
      stepsJson: JSON.stringify([
        "Online Submission",
        "Cremation Record Verification",
        "Health Officer Approval",
        "Digital Certificate Generation"
      ]),
      docs: [
        {
          docCode: "DOC-CREM-REC",
          name: "Cremation / Burial Slip",
          nameHi: "दाह संस्कार / दफन रसीद",
          isMandatory: true,
          alternatives: ["Moksha Dhaam Receipt", "Graveyard Record Slip"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-DOC-SLIP",
          name: "Doctor's Death Certificate",
          nameHi: "डॉक्टर द्वारा जारी मृत्यु प्रमाण",
          isMandatory: true,
          alternatives: ["Hospital Death Slip", "Registered Medical Practitioner Form 4/4A"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-DEC-ID",
          name: "Deceased & Applicant Aadhaar",
          nameHi: "मृतक एवं आवेदक का पहचान पत्र",
          isMandatory: true,
          alternatives: ["Aadhaar Cards of deceased and applicant"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-DL-LRN",
      name: "Driving Licence (Learner)",
      nameHi: "लर्नर ड्राइविंग लाइसेंस",
      description: "Provisional licence to practice driving motor vehicles under Transport Department.",
      descriptionHi: "परिवहन विभाग द्वारा जारी वाहन चलाने का प्रारंभिक लाइसेंस।",
      category: "Transport",
      fee: 350,
      slaDays: 3,
      physicalVisitRequired: true, // exactly 1 visit for photo/biometric/online test
      officeType: "RTO",
      commonMistakes: JSON.stringify([
        "Blood group report missing or unverified",
        "Age proof document not clearly showing date of birth",
        "Form 1 self-declaration of physical fitness incomplete"
      ]),
      commonMistakesHi: JSON.stringify([
        "ब्लड ग्रुप जांच रिपोर्ट संलग्न न करना",
        "आयु प्रमाण पत्र में जन्मतिथि अस्पष्ट होना",
        "फॉर्म 1 फिटनेस स्व-घोषणा अधूरा भरना"
      ]),
      stepsJson: JSON.stringify([
        "Online Application & Rule Pre-Check",
        "Slot Booking for Biometric & LL Test",
        "Single 15-Minute RTO Counter Visit",
        "Instant Learner License Issuance"
      ]),
      docs: [
        {
          docCode: "DOC-AGE-PROOF",
          name: "Age Proof (18+ yrs)",
          nameHi: "आयु प्रमाण पत्र (18+ वर्ष)",
          isMandatory: true,
          alternatives: ["10th Class Marksheet", "Birth Certificate", "Passport", "PAN Card"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-ADDR-PROOF",
          name: "Address Proof",
          nameHi: "निवास प्रमाण",
          isMandatory: true,
          alternatives: ["Aadhaar Card", "Voter ID Card", "Passport"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-BLOOD-GRP",
          name: "Blood Group Report",
          nameHi: "ब्लड ग्रुप रिपोर्ट",
          isMandatory: true,
          alternatives: ["Pathology Lab Blood Report", "Doctor Certificate"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-PEN",
      name: "Old-Age / Widow Pension",
      nameHi: "वृद्धावस्था / विधवा पेंशन योजना",
      description: "Direct monthly pension support for senior citizens (60+) and destitute widows under Social Welfare.",
      descriptionHi: "समाज कल्याण विभाग द्वारा 60 वर्ष से अधिक वरिष्ठ नागरिकों और विधवाओं हेतु मासिक पेंशन।",
      category: "Social Welfare",
      fee: 0,
      slaDays: 21,
      physicalVisitRequired: false,
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Age in Aadhaar is below 60 years for old age pension",
        "Bank account not linked with Aadhaar NPCI mapper for DBT",
        "Income certificate missing or above Rs 46,080 (rural) / Rs 56,460 (urban)"
      ]),
      commonMistakesHi: JSON.stringify([
        "आधार कार्ड में उम्र 60 वर्ष से कम होना",
        "बैंक खाता डीबीटी (DBT) के लिए आधार से लिंक न होना",
        "आय प्रमाण पत्र आय सीमा से अधिक होना"
      ]),
      stepsJson: JSON.stringify([
        "Online Application with Bank Passbook",
        "Gram Panchayat / Ward Verification",
        "Social Welfare Officer Approval",
        "Monthly Direct Benefit Transfer (DBT) Setup"
      ]),
      docs: [
        {
          docCode: "DOC-AGE-ID",
          name: "Aadhaar Card (Showing 60+ yrs)",
          nameHi: "आधार कार्ड (60+ आयु स्पष्ट)",
          isMandatory: true,
          alternatives: ["Aadhaar Card", "Voter ID"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-BANK-NPCI",
          name: "Aadhaar Seeded Bank Passbook",
          nameHi: "आधार लिंक बैंक पासबुक",
          isMandatory: true,
          alternatives: ["Bank Passbook with Account & IFSC", "Cancelled Cheque"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-INC-CERT",
          name: "Income Certificate (Under threshold)",
          nameHi: "आय प्रमाण पत्र (निर्धारित सीमा के भीतर)",
          isMandatory: true,
          alternatives: ["Income Certificate from Tehsil"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-UTIL",
      name: "Water / Electricity New Connection",
      nameHi: "नल / बिजली नया कनेक्शन",
      description: "New residential water supply or domestic electricity connection and meter installation.",
      descriptionHi: "घरेलू जल आपूर्ति या नवीन विद्युत संयोजन एवं मीटर स्थापना।",
      category: "Utilities",
      fee: 250,
      slaDays: 10,
      physicalVisitRequired: false,
      officeType: "Nagar Nigam",
      commonMistakes: JSON.stringify([
        "Providing an unapproved builder plot allotment without NOC",
        "Outstanding dues on previous owner at the same premises",
        "Electrical test report from unauthorized contractor"
      ]),
      commonMistakesHi: JSON.stringify([
        "अनाधिकृत कॉलोनी में बिना अनापत्ति प्रमाण पत्र आवेदन",
        "परिसर पर पुराने बिल का बकाया होना",
        "अनधिकृत ठेकेदार की टेस्ट रिपोर्ट लगाना"
      ]),
      stepsJson: JSON.stringify([
        "Online Request & Ownership Verification",
        "Technical Feasibility Check (Lineman/JE)",
        "Demand Note Online Payment",
        "Meter Installation at Site (No citizen visit needed)"
      ]),
      docs: [
        {
          docCode: "DOC-OWNER-PROOF",
          name: "Property Ownership Proof",
          nameHi: "मकान/दुकान मालिकाना हक प्रमाण",
          isMandatory: true,
          alternatives: ["Registered Sale Deed", "House Tax Assessment Receipt", "Allotment Letter"],
          criteria: { maxSizeMb: 5, allowedTypes: ["pdf"] },
          order: 1
        },
        {
          docCode: "DOC-ID",
          name: "Identity Proof (Aadhaar/PAN)",
          nameHi: "पहचान प्रमाण (आधार/पैन)",
          isMandatory: true,
          alternatives: ["Aadhaar Card", "PAN Card", "Voter ID"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-FIT-REP",
          name: "Licensed Electrician / Plumber Report",
          nameHi: "लाइसेंसशुदा इलेक्ट्रीशियन / प्लंबर टेस्ट रिपोर्ट",
          isMandatory: true,
          alternatives: ["Wiring Test Report B-Form", "Plumbing Layout Form"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 3
        }
      ]
    },
    {
      code: "SRV-ARMS",
      name: "Arms / Weapon Licence Renewal",
      nameHi: "शस्त्र लाइसेंस नवीनीकरण",
      description: "Mandatory renewal and physical inspection of licensed firearms under District Magistrate Collectorate.",
      descriptionHi: "ज़िला मजिस्ट्रेट कलेक्ट्रेट कार्यालय द्वारा लाइसेंसी शस्त्र का भौतिक निरीक्षण एवं नवीनीकरण।",
      category: "Collectorate",
      fee: 500,
      slaDays: 30,
      physicalVisitRequired: true,
      processType: "OFFLINE",
      carryDocsJson: JSON.stringify([
        "Original Arms Licence Booklet",
        "CMO MMG District Hospital Medical & Dope Test Report",
        "Local Thana Police Station Character Verification",
        "Firearm in safe holster for physical inspection"
      ]),
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Submitting medical certificate from unauthorized private clinic instead of CMO MMG Hospital",
        "Missing police character verification report from jurisdiction police station",
        "Delay beyond grace period without late penalty challan"
      ]),
      commonMistakesHi: JSON.stringify([
        "सीएमओ जिला अस्पताल के बजाय निजी क्लिनिक का मेडिकल लगाना",
        "संबंधित थाने से चरित्र सत्यापन रिपोर्ट संलग्न न होना",
        "निर्धारित समय सीमा बीतने के बाद लेट फीस चालान न लगाना"
      ]),
      stepsJson: JSON.stringify([
        "Prepare All Mandatory Documents as per Sahaj Checklist",
        "Visit Collectorate Arms Counter for Weapon Physical Inspection",
        "Police Report & CMO Report Verification",
        "District Magistrate Endorsement & Renewal Stamp"
      ]),
      docs: [
        {
          docCode: "DOC-ARMS-BOOK",
          name: "Original Arms Licence Booklet",
          nameHi: "मूल शस्त्र लाइसेंस पुस्तिका",
          isMandatory: true,
          alternatives: ["Original Arms Licence Booklet"],
          criteria: { maxSizeMb: 5, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-CMO-MED",
          name: "CMO Medical Fitness & Dope Test Report",
          nameHi: "सीएमओ मेडिकल फिटनेस व डोप टेस्ट रिपोर्ट",
          isMandatory: true,
          alternatives: ["CMO MMG District Hospital Fitness Certificate"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-POLICE-VERIF",
          name: "Thana Police Verification Report",
          nameHi: "संबंधित थाने की पुलिस आख्या रिपोर्ट",
          isMandatory: true,
          alternatives: ["Police Station Verification Report Form"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf"] },
          order: 3
        },
        {
          docCode: "DOC-ID-PROO",
          name: "Aadhaar Card & 3 Passport Photos",
          nameHi: "आधार कार्ड एवं 3 पासपोर्ट फोटो",
          isMandatory: true,
          alternatives: ["Aadhaar Card with 3 Color Photos"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 4
        }
      ]
    },
    {
      code: "SRV-MARR",
      name: "Court / Hindu Marriage Registration",
      nameHi: "विवाह पंजीकरण (सब-रजिस्ट्रार)",
      description: "Official civil registration of marriage before Sub-Registrar under Special / Hindu Marriage Act.",
      descriptionHi: "सब-रजिस्ट्रार कार्यालय (सदर) में दोनों पक्षों एवं गवाहों की भौतिक उपस्थिति में कानूनी विवाह पंजीकरण।",
      category: "Sub-Registrar",
      fee: 150,
      slaDays: 7,
      physicalVisitRequired: true,
      processType: "OFFLINE",
      carryDocsJson: JSON.stringify([
        "Original Marriage Invitation Card OR Mandir/Arya Samaj Certificate",
        "Age Proof of Bride (18+) and Groom (21+)",
        "2 Witnesses with Original Aadhaar Cards & 2 Photos each",
        "Joint Notarized Affidavit on ₹10 Stamp Paper"
      ]),
      officeType: "Tehsil",
      commonMistakes: JSON.stringify([
        "Bringing only 1 witness (Law strictly mandates 2 adult witnesses with valid Aadhaar)",
        "Age proof of bride or groom showing age less than 18 / 21 years",
        "Unnotarized joint affidavit"
      ]),
      commonMistakesHi: JSON.stringify([
        "केवल 1 गवाह लाना (कानूनन 2 वयस्क गवाह आवश्यक हैं)",
        "वर (21+) या वधू (18+) की आयु प्रमाण में न्यूनतम उम्र पूरी न होना",
        "बिना नोटरी का सादा शपथ पत्र लगाना"
      ]),
      stepsJson: JSON.stringify([
        "Verify Complete Document Bundle as per Sahaj Checklist",
        "Appear at Sub-Registrar Sadar with Both Spouses & 2 Witnesses",
        "Physical Signature, Thumb Biometric & Photograph Capture",
        "Official Marriage Certificate Handover"
      ]),
      docs: [
        {
          docCode: "DOC-MARR-PROOF",
          name: "Marriage Proof / Invitation Card",
          nameHi: "विवाह निमंत्रण पत्र / मंदिर प्रमाणपत्र",
          isMandatory: true,
          alternatives: ["Original Wedding Invitation Card", "Arya Samaj / Mandir Marriage Certificate", "Nikahnama"],
          criteria: { maxSizeMb: 4, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-SPOUSE-AGE",
          name: "Age Proof of Bride & Groom",
          nameHi: "वर एवं वधू का आयु प्रमाण",
          isMandatory: true,
          alternatives: ["10th Class Marksheet", "Birth Certificate", "Passport"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-WITNESS-ID",
          name: "2 Witnesses Original Aadhaar Cards",
          nameHi: "दो गवाहों के मूल आधार कार्ड",
          isMandatory: true,
          alternatives: ["Aadhaar Cards of 2 Adult Witnesses"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf"] },
          order: 3
        },
        {
          docCode: "DOC-JOINT-AFF",
          name: "Joint Notarized Affidavit",
          nameHi: "संयुक्त नोटरी शपथ पत्र",
          isMandatory: true,
          alternatives: ["₹10 Stamp Paper Notarized Joint Affidavit"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 4
        }
      ]
    },
    {
      code: "SRV-VEH-FIT",
      name: "Commercial Vehicle Fitness Inspection",
      nameHi: "कमर्शियल वाहन फिटनेस निरीक्षण",
      description: "Mandatory annual fitness testing of commercial vehicles at RTO Bulandshahr Road Testing Track.",
      descriptionHi: "संभागीय परिवहन कार्यालय (आरटीओ) टेस्टिंग ट्रैक पर व्यावसायिक वाहनों का वार्षिक फिटनेस परीक्षण।",
      category: "Transport",
      fee: 600,
      slaDays: 1,
      physicalVisitRequired: true,
      processType: "OFFLINE",
      carryDocsJson: JSON.stringify([
        "Original Vehicle Registration Certificate (RC)",
        "Valid Commercial Comprehensive Insurance & Online PUC",
        "Speed Governor Calibration & High Security Number Plate (HSRP) Certificate",
        "Physical Commercial Vehicle on RTO Testing Track"
      ]),
      officeType: "RTO",
      commonMistakes: JSON.stringify([
        "Arriving at RTO with expired PUC pollution certificate",
        "Non-functional speed governor or missing calibration certificate",
        "Missing reflective tape (retro-reflective contour markings)"
      ]),
      commonMistakesHi: JSON.stringify([
        "प्रदूषण (PUC) समाप्त होना या ऑनलाइन पोर्टल पर न दिखना",
        "स्पीड गवर्नर कैलिब्रेशन प्रमाणपत्र न होना",
        "वाहन पर रेट्रो-रिफ्लेक्टिव टेप न लगा होना"
      ]),
      stepsJson: JSON.stringify([
        "Prepare All 4 Required Documents using Sahaj Checklist",
        "Bring Vehicle to RTO Bulandshahr Road Inspection Track",
        "Brake, Light, Speed Governor & Emission Physical Test by Motor Vehicle Inspector (MVI)",
        "Fitness Certificate Endorsement on VAHAN"
      ]),
      docs: [
        {
          docCode: "DOC-VEH-RC",
          name: "Original Registration Certificate (RC)",
          nameHi: "मूल पंजीयन प्रमाण पत्र (RC)",
          isMandatory: true,
          alternatives: ["Original Smart Card RC", "DigiLocker RC"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 1
        },
        {
          docCode: "DOC-INS-PUC",
          name: "Valid Insurance & Online PUC",
          nameHi: "वैध बीमा एवं ऑनलाइन प्रदूषण प्रमाण",
          isMandatory: true,
          alternatives: ["Commercial Insurance Policy + Valid PUC Slip"],
          criteria: { maxSizeMb: 3, allowedTypes: ["pdf", "jpg"] },
          order: 2
        },
        {
          docCode: "DOC-SPEED-GOV",
          name: "Speed Governor & HSRP Proof",
          nameHi: "स्पीड गवर्नर एवं HSRP प्रमाण",
          isMandatory: true,
          alternatives: ["Speed Governor Fitment Certificate", "SLD Manufacturer Slip"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 3
        },
        {
          docCode: "DOC-TAX-CLEAR",
          name: "Road Tax Clearance Receipt",
          nameHi: "रोड टैक्स क्लीयरेंस रसीद",
          isMandatory: true,
          alternatives: ["Latest UP Road Tax Payment Receipt"],
          criteria: { maxSizeMb: 2, allowedTypes: ["pdf", "jpg"] },
          order: 4
        }
      ]
    }
  ];

  const createdServices = [];
  for (const s of servicesConfig) {
    const { docs, ...serviceData } = s;
    if (!serviceData.processType) {
      if (s.code === "SRV-MUT" || s.code === "SRV-DL-LRN" || s.code === "SRV-PEN") {
        serviceData.processType = "SEMI_ONLINE";
        if (s.code === "SRV-MUT") {
          serviceData.carryDocsJson = JSON.stringify([
            "Original Registered Sale Deed (मूल बैनामा)",
            "Certified Khatauni Copy (Bhulekh)",
            "Original Aadhaar Cards of Buyer & Seller"
          ]);
        } else if (s.code === "SRV-DL-LRN") {
          serviceData.carryDocsJson = JSON.stringify([
            "Original 10th Marksheet / Birth Certificate (Age Proof)",
            "Original Aadhaar Card (Address Proof)",
            "Original Blood Group Laboratory Report",
            "Online Application QR E-Token Printout"
          ]);
        } else if (s.code === "SRV-PEN") {
          serviceData.carryDocsJson = JSON.stringify([
            "Original Aadhaar Card (for Biometric Life Certificate)",
            "Original Bank Passbook (NPCI DBT Linked)",
            "Income Certificate (Tehsil Verified)"
          ]);
        }
      } else {
        serviceData.processType = "ONLINE";
        serviceData.carryDocsJson = "[]";
      }
    }
    const serv = await prisma.service.create({ data: serviceData });
    createdServices.push({ ...serv, docs });

    for (const d of docs) {
      await prisma.serviceDocument.create({
        data: {
          serviceId: serv.id,
          docCode: d.docCode,
          name: d.name,
          nameHi: d.nameHi,
          isMandatory: d.isMandatory,
          alternativesJson: JSON.stringify(d.alternatives),
          criteriaJson: JSON.stringify(d.criteria),
          order: d.order
        }
      });
    }
  }

  // 4. Slots creation for offices with physical visit requirement (e.g. Property Mutation, RTO Learner DL)
  const today = new Date();
  const slotDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    slotDates.push(d.toISOString().split("T")[0]);
  }

  const timeSlots = [
    { start: "10:00 AM", end: "10:15 AM" },
    { start: "10:15 AM", end: "10:30 AM" },
    { start: "10:30 AM", end: "10:45 AM" },
    { start: "11:00 AM", end: "11:15 AM" },
    { start: "11:15 AM", end: "11:30 AM" },
    { start: "11:45 AM", end: "12:00 PM" },
    { start: "02:00 PM", end: "02:15 PM" },
    { start: "02:15 PM", end: "02:30 PM" },
    { start: "02:30 PM", end: "02:45 PM" },
    { start: "03:00 PM", end: "03:15 PM" },
  ];

  const createdSlots = [];
  for (const office of createdOffices) {
    for (const dStr of slotDates.slice(0, 4)) {
      for (const ts of timeSlots) {
        const slot = await prisma.slot.create({
          data: {
            officeId: office.id,
            date: dStr,
            startTime: ts.start,
            endTime: ts.end,
            capacity: 10,
            bookedCount: Math.floor(Math.random() * 6),
            isAvailable: true
          }
        });
        createdSlots.push(slot);
      }
    }
  }

  // 5. Generate ~300 Sample Applications across 8 offices and 10 services
  console.log("Generating 300 sample applications with realistic Ghaziabad citizen profiles...");

  const firstNames = [
    "Rajesh", "Suresh", "Sunita", "Pooja", "Amit", "Manoj", "Kavita", "Vipin",
    "Deepak", "Anjali", "Sanjay", "Neelam", "Pankaj", "Vandana", "Rohit", "Seema",
    "Mohit", "Geeta", "Ashok", "Suman", "Arun", "Meena", "Kapil", "Rekha",
    "Vikas", "Priyanka", "Mukesh", "Saroj", "Dharmendra", "Santosh", "Vivek", "Anita",
    "Gaurav", "Shashi", "Naveen", "Kiran", "Satish", "Usha", "Pradeep", "Mamta"
  ];

  const lastNames = [
    "Sharma", "Verma", "Gupta", "Singh", "Yadav", "Tyagi", "Chaudhary", "Pandey",
    "Mishra", "Aggarwal", "Rawat", "Tomar", "Shukla", "Gautam", "Kumar", "Devi",
    "Bhardwaj", "Joshi", "Bansal", "Saxena", "Chauhan", "Nagar", "Kashyap", "Prasad"
  ];

  const sampleRepeatReasons = [
    "Missing affidavit on prescribed stamp paper",
    "Signature mismatch on self-declaration form",
    "Fee payment challan unverified / illegible",
    "Original document physical verification needed",
    "Biometric fingerprint sensor retry",
    "Address proof older than 6 months",
    "Spelling error in applicant father name"
  ];

  const statuses = [
    { status: "APPROVED", weight: 45, stage: "Ready / Issued" },
    { status: "VISIT_COMPLETED", weight: 20, stage: "Approved & Issued" },
    { status: "VISIT_SCHEDULED", weight: 15, stage: "Slot Booked - Visit Pending" },
    { status: "DOCS_VERIFIED", weight: 10, stage: "Documents Verified by Officer" },
    { status: "IN_REVIEW", weight: 15, stage: "With Field Officer" },
    { status: "ACTION_REQUIRED", weight: 15, stage: "Action Required by Citizen" },
    { status: "SUBMITTED", weight: 15, stage: "Submitted - Pre-check Passed" },
    { status: "REJECTED", weight: 8, stage: "Rejected by Tehsildar" }
  ];

  const expandedStatusPool = [];
  statuses.forEach(s => {
    for (let k = 0; k < s.weight; k++) {
      expandedStatusPool.push(s);
    }
  });

  const createdApplications = [];

  for (let i = 1; i <= 310; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const citizenName = `${fName} ${lName}`;
    const phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const last4 = `${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Distribute services and offices
    const service = createdServices[i % createdServices.length];
    const office = createdOffices[i % createdOffices.length];

    const statusChoice = expandedStatusPool[Math.floor(Math.random() * expandedStatusPool.length)];
    const daysAgo = Math.floor(Math.random() * 35) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * daysAgo) * 24 * 60 * 60 * 1000);

    const trackingNumber = `GZB-${service.code.split("-")[1]}-2026-${String(i).padStart(4, "0")}`;

    let stuckReason = null;
    let stuckReasonHi = null;
    let actionRequiredDetails = null;

    if (statusChoice.status === "ACTION_REQUIRED") {
      stuckReason = "Electricity bill is older than 3 months. Upload a recent bill to avoid in-person verification.";
      stuckReasonHi = "बिजली का बिल 3 महीने से अधिक पुराना है। कृपया नया बिल अपलोड करें।";
      actionRequiredDetails = "Please upload an electricity bill dated within the last 90 days or upload a bank passbook showing active address.";
    } else if (statusChoice.status === "REJECTED") {
      stuckReason = "Annual family income exceeds maximum eligible limit for scholarship category.";
      stuckReasonHi = "वार्षिक पारिवारिक आय छात्रवृत्ति श्रेणी की अधिकतम सीमा से अधिक है।";
    }

    const readyScore = statusChoice.status === "ACTION_REQUIRED" ? 45 : Math.floor(80 + Math.random() * 20);

    const app = await prisma.application.create({
      data: {
        trackingNumber,
        serviceId: service.id,
        citizenName,
        citizenPhone: phone,
        citizenAadhaarLast4: last4,
        officeId: office.id,
        status: statusChoice.status,
        currentStage: statusChoice.stage,
        visitReadyScore: readyScore,
        stuckReason,
        stuckReasonHi,
        actionRequiredDetails,
        assignedOfficerName: `Desk ${1 + (i % 5)} - Officer ${lName}`,
        estimatedCompletionDate: new Date(createdAt.getTime() + service.slaDays * 24 * 60 * 60 * 1000),
        createdAt,
        updatedAt
      }
    });

    createdApplications.push(app);

    // Add Timeline Events
    await prisma.applicationEvent.create({
      data: {
        applicationId: app.id,
        stage: "Submitted",
        title: "Application Submitted Online",
        titleHi: "आवेदन ऑनलाइन जमा किया गया",
        description: "Application received and automated pre-check passed successfully.",
        descriptionHi: "आवेदन प्राप्त हुआ और प्रारंभिक दस्तावेज जांच पूर्ण हुई।",
        actorRole: "CITIZEN",
        actorName: citizenName,
        deskInfo: "Citizen Portal",
        timestamp: createdAt
      }
    });

    if (["DOCS_VERIFIED", "IN_REVIEW", "VISIT_SCHEDULED", "VISIT_COMPLETED", "APPROVED"].includes(app.status)) {
      const verifyDate = new Date(createdAt.getTime() + 1 * 24 * 60 * 60 * 1000);
      await prisma.applicationEvent.create({
        data: {
          applicationId: app.id,
          stage: "Documents Verified",
          title: "Documents Scrutiny Passed",
          titleHi: "दस्तावेज जांच स्वीकृत",
          description: "All mandatory certificates verified against digital records.",
          descriptionHi: "सभी अनिवार्य दस्तावेजों की जांच अधिकारी द्वारा पूर्ण कर ली गई।",
          actorRole: "OFFICER",
          actorName: `Verifying Officer (Desk ${1 + (i % 5)})`,
          deskInfo: `Counter ${1 + (i % 5)}, ${office.name}`,
          timestamp: verifyDate
        }
      });
    }

    if (["APPROVED", "VISIT_COMPLETED"].includes(app.status)) {
      await prisma.applicationEvent.create({
        data: {
          applicationId: app.id,
          stage: "Approved & Issued",
          title: "Certificate Issued with QR Code",
          titleHi: "डिजिटली हस्ताक्षरित प्रमाण पत्र जारी",
          description: "Digitally signed certificate issued. Available for instant download.",
          descriptionHi: "डिजिटल हस्ताक्षरित प्रमाण पत्र जारी किया गया। डाउनलोड के लिए उपलब्ध है।",
          actorRole: "HEAD",
          actorName: "Sub-Divisional Magistrate / Competent Authority",
          deskInfo: office.name,
          timestamp: updatedAt
        }
      });
    }

    // Add Documents for application
    for (const doc of service.docs) {
      await prisma.applicationDocument.create({
        data: {
          applicationId: app.id,
          docCode: doc.docCode,
          docName: doc.name,
          fileUrl: `/uploads/${app.trackingNumber}_${doc.docCode}.pdf`,
          fileType: "application/pdf",
          fileSizeKb: Math.floor(400 + Math.random() * 1200),
          status: statusChoice.status === "ACTION_REQUIRED" && doc.docCode === "DOC-ADDR" ? "WARNING" : "PASS",
          issuesJson: statusChoice.status === "ACTION_REQUIRED" && doc.docCode === "DOC-ADDR" 
            ? JSON.stringify(["Bill date is older than 90 days. Please verify."]) 
            : JSON.stringify([]),
          simulatedAiScore: statusChoice.status === "ACTION_REQUIRED" && doc.docCode === "DOC-ADDR" ? 52 : 98,
          uploadedAt: createdAt
        }
      });
    }

    // If visit completed or visit scheduled, create booking & visit
    if (app.status === "VISIT_COMPLETED" || app.status === "VISIT_SCHEDULED") {
      const isRepeat = i % 4 === 0; // 25% repeat visits to simulate realistic admin insights
      const repeatReason = isRepeat ? sampleRepeatReasons[i % sampleRepeatReasons.length] : null;
      const tokenNumber = `GZB-T${String(100 + (i % 899))}`;

      const booking = await prisma.booking.create({
        data: {
          applicationId: app.id,
          slotId: createdSlots[i % createdSlots.length].id,
          tokenNumber,
          qrCodeData: JSON.stringify({
            tokenNumber,
            trackingNumber: app.trackingNumber,
            citizenName: app.citizenName,
            office: office.name,
            visitReadyScore: app.visitReadyScore
          }),
          date: slotDates[i % slotDates.length],
          timeSlot: timeSlots[i % timeSlots.length].start,
          officeId: office.id,
          status: app.status === "VISIT_COMPLETED" ? "COMPLETED" : "BOOKED",
          createdAt
        }
      });

      if (app.status === "VISIT_COMPLETED") {
        await prisma.visit.create({
          data: {
            bookingId: booking.id,
            applicationId: app.id,
            officerId: "officer_demo_id",
            officeId: office.id,
            durationMinutes: isRepeat ? 8 : 2,
            isRepeatVisit: isRepeat,
            repeatReason,
            notes: isRepeat ? `Repeat visit logged: ${repeatReason}` : "One-shot verification completed in 1.8 mins.",
            completedAt: updatedAt
          }
        });
      }
    }
  }

  // 6. Sample Grievances
  console.log("Seeding grievances...");
  const stuckApps = createdApplications.filter(a => a.status === "ACTION_REQUIRED" || a.status === "IN_REVIEW").slice(0, 15);
  for (let g = 0; g < stuckApps.length; g++) {
    const a = stuckApps[g];
    await prisma.grievance.create({
      data: {
        ticketNumber: `GRV-GZB-2026-${String(100 + g).padStart(4, "0")}`,
        applicationId: a.id,
        citizenName: a.citizenName,
        citizenPhone: a.citizenPhone,
        officeId: a.officeId,
        issueCategory: g % 2 === 0 ? "Application stuck beyond SLA" : "Clarification required on document defect",
        description: `Citizen has not received an update on tracking number ${a.trackingNumber} for 9 days. Need immediate review by Tehsil officer.`,
        status: g % 3 === 0 ? "RESOLVED" : "OPEN",
        resolutionNotes: g % 3 === 0 ? "Application was reviewed and fast-tracked by Sub-Divisional Magistrate." : null
      }
    });
  }

  // 7. Notification Logs (Simulated SMS & WhatsApp)
  console.log("Seeding notifications log...");
  for (let n = 0; n < 25; n++) {
    const a = createdApplications[n];
    await prisma.notificationLog.create({
      data: {
        recipientPhone: a.citizenPhone,
        recipientName: a.citizenName,
        channel: n % 2 === 0 ? "SMS" : "WHATSAPP",
        title: "Sahaj Seva Application Update",
        message: `Namaste ${a.citizenName}, your application ${a.trackingNumber} is currently at: ${a.currentStage}. Visit-Ready Score: ${a.visitReadyScore}%. Open portal: https://sahaj.ghaziabad.gov.in/track?id=${a.trackingNumber}`,
        status: "DELIVERED",
        applicationId: a.id,
        timestamp: new Date(Date.now() - (n * 3) * 60 * 60 * 1000)
      }
    });
  }

  // 8. Audit Logs
  console.log("Seeding audit trail...");
  const sampleActions = ["VERIFIED_DOCUMENTS", "ISSUED_CERTIFICATE", "SLOT_CHECK_IN", "DEFECT_MARKED", "SERVICE_UPDATED"];
  for (let al = 0; al < 20; al++) {
    const a = createdApplications[al];
    await prisma.auditLog.create({
      data: {
        actorId: "demo-staff-id",
        actorName: "Anand Verma (Desk 3)",
        actorRole: "OFFICER",
        action: sampleActions[al % sampleActions.length],
        entityType: "APPLICATION",
        entityId: a.id,
        detailsJson: JSON.stringify({
          trackingNumber: a.trackingNumber,
          notes: "Automated pre-check score confirmed. No repeated citizen visit necessary.",
          ipAddress: "10.45.12.8"
        }),
        timestamp: new Date(Date.now() - (al * 2) * 60 * 60 * 1000)
      }
    });
  }

  console.log("Database seeded successfully with 8 offices, 10 services, and 310 applications!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
