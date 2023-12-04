import { CiphorUtil } from './ciphor.util';
describe('CiphorUtil', () => {
  let ciphorUtil: CiphorUtil;

  beforeEach(() => {
    ciphorUtil = new CiphorUtil();
  });

  test('getInitialVector should return a string of correct length', () => {
    const iv = ciphorUtil.getInitialVector();
    expect(iv).toHaveLength(2 * ciphorUtil.byteLength); // Hex string length
  });

  test('encrypt and decrypt should produce the original value', () => {
    const encryptionKey = 'mySecretKey1234567'; // Replace with your actual key
    const value = 'Hello, World!';
    const iv = ciphorUtil.getInitialVector();

    const encryptedValue = ciphorUtil.encrypt(encryptionKey, value, iv);
    const decryptedValue = ciphorUtil.decrypt(
      encryptionKey,
      encryptedValue,
      iv,
    );

    expect(decryptedValue).toBe(value);
  });
});
