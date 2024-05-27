process.env.H4I_AWS_REGION = "test-region";
process.env.H4I_AWS_ACCESS_KEY = "test-access-key";
process.env.H4I_AWS_SECRET_KEY = "test-secret-key";
process.env.H4I_AWS_S3_BUCKET = "test-bucket";

import { imageUpload } from "@/services/s3-service";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mocked } from "jest-mock";

jest.spyOn(Date, "now").mockReturnValue(123);

jest.mock("@aws-sdk/client-s3");
const MockedS3Client = mocked(S3Client);
MockedS3Client.prototype.send = jest.fn().mockResolvedValue({}) as unknown as any;
const MockedPutObjectCommand = mocked(PutObjectCommand);

describe("S3 Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("imageUpload", () => {
    it("uploads an image to S3", async () => {
      const file = new Blob(["test"], { type: "image/png" });
      const fileName = "test.png";

      const response = await imageUpload(file, fileName);
      expect(response).toBe("https://test-bucket.s3.test-region.amazonaws.com/test.png-123");
      expect(MockedPutObjectCommand).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "test.png-123",
        Body: Buffer.from("test"),
        ContentType: "image",
      });
    });

    it("rejects with an error if the upload fails", async () => {
      const file = new Blob(["test"], { type: "image/png" });
      const fileName = "test.png";
      MockedS3Client.prototype.send.mockRejectedValueOnce("test-error" as unknown as never);

      await expect(imageUpload(file, fileName)).rejects.toBe("test-error");
    });
  });
});
