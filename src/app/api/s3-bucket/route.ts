import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { imageUpload } from "@/services/image-upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData(); // image will be uploaded via form
    const file = formData.get("file");
    // Checks
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await imageUpload(buffer, file.name);
      return NextResponse.json({ success: true, fileName });
    } else {
      return NextResponse.json({ error: "Error uploading file" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" });
  }
}
