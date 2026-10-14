import { PrismaClient, ProcessType, Role, Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface OfficeInput {
  code: string;
  name: string;
  nameHi: string;
  address: string;
  zone: string;
  tehsil: string;
  lat: number;
  lng: number;
  officerCount: number;
  contactPhone: string;
  source: string;
  verifiedAt: string;
}

interface ServiceDocInput {
  docCode: string;
  name: string;
  nameHi: string;
  isMandatory: boolean;
  alternatives: string[];
  criteria: Prisma.InputJsonValue;
  order: number;
}

interface ServiceInput {
  code: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  fee: number;
  slaDays: number;
  physicalVisitRequired: boolean;
  processType: ProcessType;
  carryDocs: string[];
  officeType: string;
  source: string;
  verifiedAt: string;
  commonMistakes: string[];
  commonMistakesHi: string[];
  steps: string[];
  documents: ServiceDocInput[];
}

export async function seedReferenceData() {
  console.log("🌱 Starting idempotent reference data seeding...");

  // 1. Load Offices from canonical JSON
  const officesFilePath = path.join(process.cwd(), "data", "offices.json");
  if (!fs.existsSync(officesFilePath)) {
    throw new Error(`Reference data missing: ${officesFilePath}`);
  }
  const officesData: OfficeInput[] = JSON.parse(
    fs.readFileSync(officesFilePath, "utf8")
  );

  console.log(`Upserting ${officesData.length} administrative offices...`);
  const officeMap = new Map<string, string>();

  for (const office of officesData) {
    const upserted = await prisma.office.upsert({
      where: { code: office.code },
      update: {
        name: office.name,
        nameHi: office.nameHi,
        address: office.address,
        zone: office.zone,
        tehsil: office.tehsil,
        lat: office.lat,
        lng: office.lng,
        officerCount: office.officerCount,
        contactPhone: office.contactPhone,
        source: office.source,
        verifiedAt: office.verifiedAt ? new Date(office.verifiedAt) : null,
      },
      create: {
        code: office.code,
        name: office.name,
        nameHi: office.nameHi,
        address: office.address,
        zone: office.zone,
        tehsil: office.tehsil,
        lat: office.lat,
        lng: office.lng,
        officerCount: office.officerCount,
        contactPhone: office.contactPhone,
        source: office.source,
        verifiedAt: office.verifiedAt ? new Date(office.verifiedAt) : null,
      },
    });
    officeMap.set(office.code, upserted.id);
  }

  // 2. Load Services and ServiceDocuments from canonical JSON
  const servicesFilePath = path.join(process.cwd(), "data", "services.json");
  if (!fs.existsSync(servicesFilePath)) {
    throw new Error(`Reference data missing: ${servicesFilePath}`);
  }
  const servicesData: ServiceInput[] = JSON.parse(
    fs.readFileSync(servicesFilePath, "utf8")
  );

  console.log(`Upserting ${servicesData.length} public statutory services...`);
  for (const service of servicesData) {
    const upsertedService = await prisma.service.upsert({
      where: { code: service.code },
      update: {
        name: service.name,
        nameHi: service.nameHi,
        description: service.description,
        descriptionHi: service.descriptionHi,
        category: service.category,
        fee: service.fee,
        slaDays: service.slaDays,
        physicalVisitRequired: service.physicalVisitRequired,
        processType: service.processType,
        carryDocsJson: service.carryDocs,
        officeType: service.officeType,
        source: service.source,
        verifiedAt: service.verifiedAt ? new Date(service.verifiedAt) : null,
        commonMistakes: service.commonMistakes,
        commonMistakesHi: service.commonMistakesHi,
        stepsJson: service.steps,
      },
      create: {
        code: service.code,
        name: service.name,
        nameHi: service.nameHi,
        description: service.description,
        descriptionHi: service.descriptionHi,
        category: service.category,
        fee: service.fee,
        slaDays: service.slaDays,
        physicalVisitRequired: service.physicalVisitRequired,
        processType: service.processType,
        carryDocsJson: service.carryDocs,
        officeType: service.officeType,
        source: service.source,
        verifiedAt: service.verifiedAt ? new Date(service.verifiedAt) : null,
        commonMistakes: service.commonMistakes,
        commonMistakesHi: service.commonMistakesHi,
        stepsJson: service.steps,
      },
    });

    // Idempotent upsert of required service documents
    for (const doc of service.documents) {
      const existingDoc = await prisma.serviceDocument.findFirst({
        where: {
          serviceId: upsertedService.id,
          docCode: doc.docCode,
        },
      });

      if (existingDoc) {
        await prisma.serviceDocument.update({
          where: { id: existingDoc.id },
          data: {
            name: doc.name,
            nameHi: doc.nameHi,
            isMandatory: doc.isMandatory,
            alternativesJson: doc.alternatives,
            criteriaJson: doc.criteria,
            order: doc.order,
          },
        });
      } else {
        await prisma.serviceDocument.create({
          data: {
            serviceId: upsertedService.id,
            docCode: doc.docCode,
            name: doc.name,
            nameHi: doc.nameHi,
            isMandatory: doc.isMandatory,
            alternativesJson: doc.alternatives,
            criteriaJson: doc.criteria,
            order: doc.order,
          },
        });
      }
    }
  }

  // 3. Idempotent staff reference accounts (system initializers)
  const sadarOfficeId = officeMap.get("OFF-TEH-SADAR");

  const systemStaff = [
    {
      email: "cdo@seva.demo",
      phone: "9811006677",
      name: "Chief Development Officer (CDO)",
      role: Role.CDO,
      officeId: null,
    },
    {
      email: "head@seva.demo",
      phone: "9811004455",
      name: "SDM Sadar Ghaziabad",
      role: Role.HEAD,
      officeId: sadarOfficeId,
    },
    {
      email: "officer@seva.demo",
      phone: "9811002233",
      name: "Anand Verma (Desk 3)",
      role: Role.OFFICER,
      officeId: sadarOfficeId,
    },
  ];

  for (const staff of systemStaff) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        name: staff.name,
        role: staff.role,
        officeId: staff.officeId,
        phone: staff.phone,
      },
      create: {
        email: staff.email,
        phone: staff.phone,
        name: staff.name,
        role: staff.role,
        officeId: staff.officeId,
      },
    });
  }

  console.log("✅ Reference data seeding completed successfully.");
}

if (require.main === module) {
  seedReferenceData()
    .catch((e) => {
      console.error("❌ Reference seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
