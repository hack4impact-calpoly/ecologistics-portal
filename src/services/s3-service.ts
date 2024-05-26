import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.H4I_AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.H4I_AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.H4I_AWS_SECRET_KEY || "",
  },
});

export const imageUpload = async (
  file: Blob,
  fileName: string,
): Promise<string> => {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `${fileName}-${Date.now()}`;
    const command = new PutObjectCommand({
      Bucket: process.env.H4I_AWS_S3_BUCKET,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: "image",
    });
    await client.send(command);
    return Promise.resolve(
      `https://${process.env.H4I_AWS_S3_BUCKET}.s3.${process.env.H4I_AWS_REGION}.amazonaws.com/${fileKey}`,
    );
  } catch (error) {
    return Promise.reject(error);
  }
};
