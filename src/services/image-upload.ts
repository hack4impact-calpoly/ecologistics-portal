import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_S3_LOCATION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_PRIV_KEY || "",
  },
});

export const imageUpload = async (file: any, fileName: string) => {
  const fileBuffer = file;
  const fileKey = `${process.env.AWS_FILE_NAME}/${fileName}-${Date.now()}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
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
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_S3_LOCATION}.amazonaws.com/${fileKey}`;
};
