import {
  PrismaClient,
  Role,
  ApplicationStatus,
  BookingStatus,
  DocStatus,
  GrievanceStatus,
  NotificationChannel,
} from "@prisma/client";
import { seedReferenceData } from "./seed.reference";

const prisma = new PrismaClient();

export async function seedDemoData() {
  console.log("🚀 Initializing Sahaj Seva Demo Dataset...");

  // Strict environment guard
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DEMO_SEED !== "true"
  ) {
    throw new Error(
      "🛑 CRITICAL SAFETY GUARD: Demo seeding cannot run in production without explicit ALLOW_DEMO_SEED=true."
    );
  }

  // Ensure reference tables are populated first
  await seedReferenceData();

  const offices = await prisma.office.findMany();
  const services = await prisma.service.findMany({
    include: { documents: true },
  });

  if (offices.length === 0 || services.length === 0) {
    throw new Error("Reference data must be seeded before running demo dataset.");
  }

  // Demo Citizen User
  const demoCitizen = await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: { name: "Ramesh Sharma", role: Role.CITIZEN },
    create: {
      phone: "9999999999",
      email: "citizen@seva.demo",
      name: "Ramesh Sharma",
      role: Role.CITIZEN,
    },
  });

  // Get officer user for visit assignments
  const officerUser = await prisma.user.findFirst({
    where: { role: Role.OFFICER },
  });
  if (!officerUser) {
    throw new Error("Officer user must exist for demo visits.");
  }

  // Generate Slots for the next 7 days across offices
  console.log("Generating appointment slots...");
  const slotTimes = [
    { start: "10:00 AM", end: "10:15 AM" },
    { start: "10:15 AM", end: "10:30 AM" },
    { start: "10:30 AM", end: "10:45 AM" },
    { start: "10:45 AM", end: "11:00 AM" },
    { start: "11:00 AM", end: "11:15 AM" },
    { start: "11:15 AM", end: "11:30 AM" },
    { start: "11:30 AM", end: "11:45 AM" },
    { start: "11:45 AM", end: "12:00 PM" },
    { start: "02:00 PM", end: "02:15 PM" },
    { start: "02:15 PM", end: "02:30 PM" },
    { start: "02:30 PM", end: "02:45 PM" },
    { start: "02:45 PM", end: "03:00 PM" },
  ];

  const createdSlots = [];
  const today = new Date();

  for (const office of offices) {
    for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dateStr = d.toISOString().split("T")[0];

      for (const t of slotTimes) {
        const slot = await prisma.slot.upsert({
          where: {
            officeId_date_startTime: {
              officeId: office.id,
              date: dateStr,
              startTime: t.start,
            },
          },
          update: {
            capacity: 15,
            bookedCount: Math.floor(Math.random() * 8),
          },
          create: {
            officeId: office.id,
            date: dateStr,
            startTime: t.start,
            endTime: t.end,
            capacity: 15,
            bookedCount: Math.floor(Math.random() * 8),
            isAvailable: true,
          },
        });
        createdSlots.push(slot);
      }
    }
  }

  // Realistic Citizen Names
  const firstNames = [
    "Amit", "Sunita", "Rajesh", "Pooja", "Vikas", "Neetu", "Manoj", "Kavita",
    "Sanjay", "Rekha", "Deepak", "Anjali", "Gaurav", "Suman", "Praveen", "Meenakshi",
    "Ashok", "Geeta", "Rohit", "Usha", "Arun", "Poonam", "Suresh", "Seema",
  ];
  const lastNames = [
    "Sharma", "Verma", "Singh", "Yadav", "Gupta", "Kumar", "Tyagi", "Chaudhary",
    "Mishra", "Pandey", "Tomar", "Nagar", "Rawat", "Joshi", "Bhardwaj", "Saxena",
  ];

  const repeatReasonsList = [
    "Missing affidavit on prescribed stamp paper",
    "Signature / Name spelling mismatch with Aadhaar",
    "Fee payment challan unverified by treasury",
    "Uncertified copy of property registry deed",
    "Biometric authentication retry required at counter",
    "Address mismatch with latest electricity utility bill",
  ];

  console.log("Generating 300 realistic demo applications across offices...");
  const existingAppCount = await prisma.application.count();

  if (existingAppCount < 200) {
    const totalToGenerate = 300 - existingAppCount;

    for (let i = 0; i < totalToGenerate; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const citizenName = `${fn} ${ln}`;
      const citizenPhone = `98${Math.floor(10000000 + Math.random() * 89999999)}`;
      const aadhaarLast4 = String(Math.floor(1000 + Math.random() * 9000));

      const service = services[Math.floor(Math.random() * services.length)];
      const office = offices[Math.floor(Math.random() * offices.length)];

      const codePrefix = service.code.split("-")[1] || "SRV";
      const seq = 1000 + existingAppCount + i;
      const trackingNumber = `GZB-${codePrefix}-2026-${seq}`;

      const roll = Math.random();
      let status: ApplicationStatus = ApplicationStatus.APPROVED;
      let stage = "Ready / Issued";
      let score = 90 + Math.floor(Math.random() * 10);
      let stuckReason = null;
      let stuckReasonHi = null;

      if (roll < 0.35) {
        status = ApplicationStatus.APPROVED;
        stage = "Certificate Digitally Approved & Issued";
      } else if (roll < 0.55) {
        status = ApplicationStatus.VISIT_COMPLETED;
        stage = "Counter Visit Completed (Under 2 Min)";
      } else if (roll < 0.70) {
        status = ApplicationStatus.VISIT_SCHEDULED;
        stage = "Scheduled Appointment Slot Reserved";
      } else if (roll < 0.85) {
        status = ApplicationStatus.SUBMITTED;
        stage = "Submitted - Pre-check Passed";
        score = 80 + Math.floor(Math.random() * 15);
      } else if (roll < 0.93) {
        status = ApplicationStatus.ACTION_REQUIRED;
        stage = "Clarification / Document Correction Required";
        score = 55 + Math.floor(Math.random() * 15);
        stuckReason = "Defect flagged during verification: Blurred or missing page.";
        stuckReasonHi = "सत्यापन के दौरान दस्तावेज में कमी पाई गई। कृपया सही प्रति अपलोड करें।";
      } else {
        status = ApplicationStatus.REJECTED;
        stage = "Application Ineligible / Rejected";
        score = 45 + Math.floor(Math.random() * 20);
        stuckReason = "Ineligible as per department statutory rules.";
        stuckReasonHi = "विभागीय पात्रता नियमों के अनुकूल न होने के कारण आवेदन अस्वीकृत।";
      }

      const createdApp = await prisma.application.create({
        data: {
          trackingNumber,
          serviceId: service.id,
          userId: i === 0 ? demoCitizen.id : null,
          citizenName,
          citizenPhone,
          citizenAadhaarLast4: aadhaarLast4,
          officeId: office.id,
          status,
          currentStage: stage,
          visitReadyScore: score,
          stuckReason,
          stuckReasonHi,
          assignedOfficerName: "Desk 3 - Verifying Officer",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000),
        },
      });

      // Events
      await prisma.applicationEvent.create({
        data: {
          applicationId: createdApp.id,
          stage: "Submitted",
          title: "Application Submitted Online",
          titleHi: "आवेदन ऑनलाइन जमा किया गया",
          description: `Submitted with Visit-Ready Score of ${score}%.`,
          descriptionHi: `आवेदन ${score}% तैयारी स्कोर के साथ सफलतापूर्वक दर्ज हुआ।`,
          actorRole: "CITIZEN",
          actorName: citizenName,
          deskInfo: "Citizen Portal",
          timestamp: createdApp.createdAt,
        },
      });

      // Attach Documents
      for (const d of service.documents) {
        const docStatus: DocStatus =
          score < 60 ? DocStatus.WARNING : DocStatus.PASS;
        await prisma.applicationDocument.create({
          data: {
            applicationId: createdApp.id,
            docCode: d.docCode,
            docName: d.name,
            fileUrl: `/uploads/${trackingNumber}_${d.docCode}.pdf`,
            fileType: "application/pdf",
            fileSizeKb: 250 + Math.floor(Math.random() * 400),
            status: docStatus,
            issuesJson: docStatus === DocStatus.WARNING ? ["Border cropped / partial readability"] : [],
            simulatedAiScore: score,
          },
        });
      }

      // Slot & Booking for Scheduled or Completed Visits
      if (
        status === ApplicationStatus.VISIT_SCHEDULED ||
        status === ApplicationStatus.VISIT_COMPLETED
      ) {
        const availableSlot =
          createdSlots[Math.floor(Math.random() * createdSlots.length)];
        const tokenNumber = `GZB-T${100 + (i % 899)}`;
        const bookingStatus: BookingStatus =
          status === ApplicationStatus.VISIT_COMPLETED
            ? BookingStatus.COMPLETED
            : BookingStatus.BOOKED;

        const booking = await prisma.booking.create({
          data: {
            applicationId: createdApp.id,
            slotId: availableSlot.id,
            officeId: office.id,
            tokenNumber,
            qrCodeData: JSON.stringify({
              tokenNumber,
              trackingNumber,
              citizenName,
            }),
            date: availableSlot.date,
            timeSlot: availableSlot.startTime,
            status: bookingStatus,
          },
        });

        // Visit record for completed visits
        if (status === ApplicationStatus.VISIT_COMPLETED) {
          const isRepeat = Math.random() < 0.18;
          const repeatReason = isRepeat
            ? repeatReasonsList[Math.floor(Math.random() * repeatReasonsList.length)]
            : null;

          await prisma.visit.create({
            data: {
              bookingId: booking.id,
              applicationId: createdApp.id,
              officerId: officerUser.id,
              officeId: office.id,
              durationMinutes: 2,
              isRepeatVisit: isRepeat,
              repeatReason,
              notes: isRepeat
                ? `Citizen had to revisit: ${repeatReason}`
                : "Fast counter verification completed under 2 minutes.",
              completedAt: new Date(createdApp.createdAt.getTime() + 86400000),
            },
          });
        }
      }

      // Sample Grievances for stuck files
      if (status === ApplicationStatus.ACTION_REQUIRED && Math.random() < 0.25) {
        await prisma.grievance.create({
          data: {
            ticketNumber: `GRV-GZB-2026-${200 + i}`,
            applicationId: createdApp.id,
            citizenName,
            citizenPhone,
            officeId: office.id,
            issueCategory: "Document rejected without explanation",
            description: "Clarification requested on uploaded document format.",
            status: GrievanceStatus.OPEN,
          },
        });
      }
    }
  }

  console.log("✅ Demo dataset generated successfully.");
}

if (require.main === module) {
  seedDemoData()
    .catch((e) => {
      console.error("❌ Demo seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
