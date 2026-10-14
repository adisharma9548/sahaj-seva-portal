import { NextRequest, NextResponse } from "next/server";
import { validateUploadedDocument, computeOverallReadinessScore } from "@/lib/precheck-rules";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents, mandatoryDocCodes } = body;

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { success: false, error: "Documents array is required" },
        { status: 400 }
      );
    }

    const results = documents.map((doc: any) => {
      return validateUploadedDocument(
        doc.docCode,
        doc.docName || doc.docCode,
        {
          name: doc.fileName || `${doc.docCode}.pdf`,
          size: doc.fileSize || 1024 * 350,
          type: doc.fileType || "application/pdf",
          isDeliberateDemoError: doc.isDeliberateDemoError || false,
        }
      );
    });

    const summary = computeOverallReadinessScore(
      results,
      mandatoryDocCodes || []
    );

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Error running pre-check:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate precheck rules" },
      { status: 500 }
    );
  }
}
