import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.H4I_AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.H4I_AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.H4I_AWS_SECRET_KEY || "",
  },
});

export const imageUpload = async (file: any, fileName: string) => {
  console.log(file);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileKey = `${fileName}-${Date.now()}`;
  const command = new PutObjectCommand({
    Bucket: process.env.H4I_AWS_S3_BUCKET,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: "image",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
  return `https://${process.env.H4I_AWS_S3_BUCKET}.s3.${process.env.H4I_AWS_REGION}.amazonaws.com/${fileKey}`;
};
