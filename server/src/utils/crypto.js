import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY || "secret_key"; 
const ivLength = 9;


const formatKey = (key) => Buffer.from(key.padEnd(32).slice(0, 32), "utf8");

// Function to encrypt the text
export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = formatKey(secretKey);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
};

// Function to decrypt the content
export const decrypt = (encrypted) => {
  const iv = Buffer.from(encrypted.iv, "hex");
  const key = formatKey(secretKey);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};