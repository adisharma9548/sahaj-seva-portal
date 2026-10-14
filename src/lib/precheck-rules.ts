export interface PrecheckIssue {
  severity: "error" | "warning" | "info";
  messageEn: string;
  messageHi: string;
  fixActionEn: string;
  fixActionHi: string;
}

export interface DocumentValidationResult {
  docCode: string;
  docName: string;
  fileName: string;
  fileSizeBytes: number;
  status: "PASS" | "WARNING" | "REJECTED";
  score: number; // 0 to 100
  issues: PrecheckIssue[];
  simulatedAiNotes: string;
}

export interface ApplicationPrecheckSummary {
  overallScore: number; // Visit-Ready Score 0-100
  status: "READY" | "NEEDS_ATTENTION" | "CRITICAL_ISSUES";
  passedCount: number;
  warningCount: number;
  errorCount: number;
  results: DocumentValidationResult[];
}

export function validateUploadedDocument(
  docCode: string,
  docName: string,
  file: { name: string; size: number; type: string; isDeliberateDemoError?: boolean }
): DocumentValidationResult {
  const issues: PrecheckIssue[] = [];
  let score = 95;

  const fileNameLower = file.name.toLowerCase();
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
  const hasValidExt = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));

  // 1. File type check
  if (!hasValidExt) {
    issues.push({
      severity: "error",
      messageEn: "Unsupported file type. Only PDF, JPG, and PNG files are accepted.",
      messageHi: "अमान्य फ़ाइल प्रकार। केवल PDF, JPG एवं PNG फ़ाइलें ही स्वीकार्य हैं।",
      fixActionEn: "Please save as PDF or scan as clear JPG.",
      fixActionHi: "कृपया इसे PDF या JPG प्रारूप में पुनः स्कैन करें।",
    });
    score -= 40;
  }

  // 2. File size checks (too small = thumbnail/unreadable, too large = rejected by portal)
  if (file.size < 25 * 1024) {
    issues.push({
      severity: "warning",
      messageEn: "Document resolution is very low (<25 KB). Text or seal may be unreadable.",
      messageHi: "फ़ाइल का आकार बहुत कम है (<25 KB)। मोहर या अक्षर अपठनीय हो सकते हैं।",
      fixActionEn: "Upload a sharp scan (at least 150 DPI) to prevent in-person counter rejection.",
      fixActionHi: "कम से कम 150 DPI पर साफ फोटो या स्कैन अपलोड करें।",
    });
    score -= 20;
  } else if (file.size > 5 * 1024 * 1024) {
    issues.push({
      severity: "error",
      messageEn: "File exceeds 5MB limit. Server upload limit exceeded.",
      messageHi: "फ़ाइल 5MB सीमा से अधिक है।",
      fixActionEn: "Compress file under 5MB using any scanner tool.",
      fixActionHi: "फ़ाइल को 5MB से कम आकार में कंप्रेस करें।",
    });
    score -= 30;
  }

  // 3. Deliberate demo error or filename keywords (e.g. for demo simulation journey)
  if (
    file.isDeliberateDemoError ||
    fileNameLower.includes("expired") ||
    fileNameLower.includes("blurry") ||
    fileNameLower.includes("defect") ||
    fileNameLower.includes("old_bill")
  ) {
    if (docCode.includes("ADDR") || fileNameLower.includes("bill")) {
      issues.push({
        severity: "error",
        messageEn: "Pre-Check Alert: Electricity Bill is older than 90 days (Dated 5 months ago).",
        messageHi: "पूर्व-जाँच चेतावनी: बिजली का बिल 90 दिनों से अधिक पुराना है (5 माह पूर्व का)।",
        fixActionEn: "Upload latest electricity bill or provide active Bank Passbook / Ration Card.",
        fixActionHi: "कृपया पिछले 3 माह का नवीनतम बिजली बिल या बैंक पासबुक अपलोड करें।",
      });
      score = 42;
    } else if (docCode.includes("INC") || fileNameLower.includes("affidavit")) {
      issues.push({
        severity: "error",
        messageEn: "Affidavit missing Notary Public stamp & advocate registration number.",
        messageHi: "शपथ पत्र पर नोटरी की मोहर एवं अधिवक्ता पंजीकरण संख्या अनुपलब्ध है।",
        fixActionEn: "Upload notarized affidavit on ₹10 non-judicial e-stamp paper.",
        fixActionHi: "तहसील नोटरी द्वारा सत्यापित 10 रुपये के ई-स्टाम्प पर शपथ पत्र अपलोड करें।",
      });
      score = 48;
    } else {
      issues.push({
        severity: "error",
        messageEn: "Document clarity test failed: Text is blurry or edges are clipped.",
        messageHi: "दस्तावेज अस्पष्ट है: अक्षर धुंधले हैं या किनारे कटे हुए हैं।",
        fixActionEn: "Retake photo in good lighting with all four corners visible.",
        fixActionHi: "अच्छी रोशनी में सभी चारों कोनों के साथ पुनः फोटो लें।",
      });
      score = 45;
    }
  }

  let status: "PASS" | "WARNING" | "REJECTED" = "PASS";
  if (issues.some((i) => i.severity === "error")) {
    status = "REJECTED";
  } else if (issues.some((i) => i.severity === "warning")) {
    status = "WARNING";
  }

  return {
    docCode,
    docName,
    fileName: file.name,
    fileSizeBytes: file.size,
    status,
    score: Math.max(10, Math.min(100, score)),
    issues,
    simulatedAiNotes:
      issues.length === 0
        ? "Automated verification passed. Layout, seal, and readable text detected."
        : "Defects identified by rule pre-check engine. Fix prior to submission to prevent repeat office visits.",
  };
}

export function computeOverallReadinessScore(
  results: DocumentValidationResult[],
  mandatoryDocCodes: string[]
): ApplicationPrecheckSummary {
  const uploadedCodes = new Set(results.map((r) => r.docCode));
  const missingMandatory = mandatoryDocCodes.filter((c) => !uploadedCodes.has(c));

  let passedCount = 0;
  let warningCount = 0;
  let errorCount = 0;
  let totalScoreSum = 0;

  for (const r of results) {
    if (r.status === "PASS") passedCount++;
    else if (r.status === "WARNING") warningCount++;
    else errorCount++;
    totalScoreSum += r.score;
  }

  // Missing mandatory doc penalty
  errorCount += missingMandatory.length;
  const averageDocScore = results.length > 0 ? totalScoreSum / results.length : 0;
  let overallScore = Math.round(averageDocScore - missingMandatory.length * 25);
  overallScore = Math.max(0, Math.min(100, overallScore));

  let status: "READY" | "NEEDS_ATTENTION" | "CRITICAL_ISSUES" = "READY";
  if (overallScore < 60 || errorCount > 0) {
    status = "CRITICAL_ISSUES";
  } else if (overallScore < 85 || warningCount > 0) {
    status = "NEEDS_ATTENTION";
  }

  return {
    overallScore,
    status,
    passedCount,
    warningCount,
    errorCount,
    results,
  };
}
