import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class CiphorUtil {
  algorithm = 'aes-256-gcm';
  charEncoding = 'utf-8';
  byteLength = 16;

  getInitialVector(): string {
    return crypto.randomBytes(this.byteLength).toString('hex');
  }

  encrypt(encryptionKey: string, value: string, iv: string): string {
    const keyBuffer = Buffer.from(encryptionKey, this.charEncoding).slice(
      0,
      this.byteLength,
    );
    const ivBuffer = Buffer.from(iv, 'hex');
    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);
    let encryptedValue = cipher.update(value, this.charEncoding, 'hex');
    encryptedValue += cipher.final('hex');

    return encryptedValue;
  }

  decrypt(decryptionKey: string, value: string, iv: string): string {
    const keyBuffer = Buffer.from(decryptionKey, this.charEncoding).slice(
      0,
      this.byteLength,
    );
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      keyBuffer,
      ivBuffer,
    );
    let decryptedValue = decipher.update(value, 'hex', this.charEncoding);
    decryptedValue += decipher.final(this.charEncoding);

    return decryptedValue;
  }
}
