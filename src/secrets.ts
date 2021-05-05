import { SecretValues } from './types';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

const KEY = Buffer.from(process.env.JTK_CREDENTIALS_ENC_KEY, 'hex');
const IV = Buffer.from(process.env.JTK_CREDENTIALS_ENC_IV, 'hex');

export function loadSecret(): SecretValues {
  return decryptSecret(
    JSON.parse(readFileSync('secrets.json', 'utf-8')).secrets as string,
  );
}

export function decryptSecret(encrypted: string): SecretValues {
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
  const decrypted = decipher.update(encrypted, 'base64', 'utf8');
  const json = JSON.parse(decrypted + decipher.final('utf8'));
  return json as SecretValues;
}

export function encryptSecret(value: SecretValues): string {
  const val = JSON.stringify(value);

  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}
