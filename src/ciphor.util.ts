import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CiphorUtil {
  algorithm = 'aes-128-cbc';
  byteLength = 16;

  getInitialVector(): string {
    return crypto.randomBytes(this.byteLength).toString('hex');
  }

  encrypt(encryptionKey: string, value: string, iv: string): string {
    const keyBuffer = Buffer.from(encryptionKey, 'utf-8').slice(
      0,
      this.byteLength,
    );
    const ivBuffer = Buffer.from(iv, 'hex');
    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);
    let encryptedValue = cipher.update(value, 'utf-8', 'hex');
    encryptedValue += cipher.final('hex');

    return encryptedValue;
  }

  decrypt(decryptionKey: string, value: string, iv: string): string {
    const keyBuffer = Buffer.from(decryptionKey, 'utf-8').slice(
      0,
      this.byteLength,
    );
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      keyBuffer,
      ivBuffer,
    );
    let decryptedValue = decipher.update(value, 'hex', 'utf-8');
    decryptedValue += decipher.final('utf-8');

    return decryptedValue.toString();
  }
}
