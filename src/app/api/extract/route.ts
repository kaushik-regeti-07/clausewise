import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isText = file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt");

  let text: string;
  try {
    if (isPdf) {
      text = await extractTextFromPdf(buffer);
    } else if (isText) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF or a plain text file." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not read that file. It may be a scanned image - try pasting the text directly instead.",
      },
      { status: 422 }
    );
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return NextResponse.json(
      {
        error:
          "No readable text found in that file. It may be a scanned image - try pasting the text instead.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ text: trimmed });
}
