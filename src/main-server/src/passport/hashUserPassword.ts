import crypto from "crypto";

export default function hashUserPassword(password: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const encrypted = hash.copy().digest("hex");

  return encrypted;
}
