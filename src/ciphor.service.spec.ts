import { Test, TestingModule } from '@nestjs/testing';
import { CiphorService } from './ciphor.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ciphor } from './ciphor.entity';
import { CiphorUtil } from './ciphor.util';
import CiphorRepositoryMock from './ciphor.repository.mock';

describe('CiphorService', () => {
  let ciphorService: CiphorService;
  let ciphorRepository: Repository<Ciphor>;
  let ciphorUtil: CiphorUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiphorService,
        CiphorUtil,
        {
          provide: getRepositoryToken(Ciphor),
          useClass: CiphorRepositoryMock,
        },
      ],
    }).compile();

    ciphorService = module.get<CiphorService>(CiphorService);
    ciphorRepository = module.get<Repository<Ciphor>>(
      getRepositoryToken(Ciphor),
    );
    ciphorUtil = module.get<CiphorUtil>(CiphorUtil);
  });

  describe('encrypt', () => {
    it('should encrypt and save a Ciphor record', async () => {
      const id = '1';
      const encryptionKey = 'mySecretKey1234567';
      const value = { key: 'value' };

      const initialVector = 'abcdef0123456789'; // Mock the initial vector
      const encryptedContent = 'encryptedContent'; // Mock the encrypted content

      jest.spyOn(ciphorUtil, 'getInitialVector').mockReturnValue(initialVector);
      jest.spyOn(ciphorUtil, 'encrypt').mockReturnValue(encryptedContent);

      const expectedResult: Ciphor = {
        id,
        vector: initialVector,
        content: encryptedContent,
      } as Ciphor;

      jest.spyOn(ciphorRepository, 'save').mockResolvedValue(expectedResult);

      const result = await ciphorService.encrypt(id, encryptionKey, value);

      expect(result).toEqual(expectedResult);
      expect(ciphorUtil.getInitialVector).toHaveBeenCalledWith();
      expect(ciphorUtil.encrypt).toHaveBeenCalledWith(
        encryptionKey,
        JSON.stringify(value),
        initialVector,
      );
      expect(ciphorRepository.save).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('decrypt', () => {
    it('should decrypt and return Ciphor records', async () => {
      const id = '1';
      const decryptionKey = 'myDecryptionKey123';

      const records: Ciphor[] = [
        { id: '1', vector: 'abcdef0123456789', content: 'encryptedContent1' },
        { id: '2', vector: '0123456789abcdef', content: 'encryptedContent2' },
      ] as Ciphor[];

      jest.spyOn(ciphorRepository, 'find').mockResolvedValue(records);
      jest
        .spyOn(ciphorUtil, 'decrypt')
        .mockImplementation(
          (key, content, vector) => `decrypted-${content}-${vector}`,
        );

      const expectedResult: Ciphor[] = [
        {
          id: '1',
          vector: 'abcdef0123456789',
          content: 'decrypted-encryptedContent1-abcdef0123456789',
        },
        {
          id: '2',
          vector: '0123456789abcdef',
          content: 'decrypted-encryptedContent2-0123456789abcdef',
        },
      ] as Ciphor[];

      const result = await ciphorService.decrypt(id, decryptionKey);

      expect(result).toEqual(expectedResult);
      expect(ciphorRepository.find).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(ciphorUtil.decrypt).toHaveBeenCalledWith(
        decryptionKey,
        records[0].content,
        records[0].vector,
      );
      expect(ciphorUtil.decrypt).toHaveBeenCalledWith(
        decryptionKey,
        records[1].content,
        records[1].vector,
      );
    });

    it('should return an empty array if no records found', async () => {
      const id = 'nonexistentID';
      const decryptionKey = 'myDecryptionKey123';

      jest.spyOn(ciphorRepository, 'find').mockResolvedValue([]);

      const result = await ciphorService.decrypt(id, decryptionKey);

      expect(result).toEqual([]);
      expect(ciphorRepository.find).toHaveBeenCalledWith({
        where: { id: 'nonexistentID' },
      });
    });

    it('should log a message when decryption fails', async () => {
      const loggerSpy = jest.spyOn(ciphorService['logger'], 'log');
      const id = '1';
      const decryptionKey = 'someDecryptionKey';

      // Mock the repository response
      const records: Ciphor[] = [
        {
          id: '1',
          vector: 'abcdef0123456789',
          content: 'invalidEncryptedContent',
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
      ];
      ciphorRepository.save(records);

      // Spy on the CiphorUtil.decrypt method to simulate a decryption failure
      jest.spyOn(ciphorUtil, 'decrypt').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      const result = await ciphorService.decrypt(id, decryptionKey);

      // Check that the logger was called with the correct message
      expect(loggerSpy).toHaveBeenCalledWith(
        `FAILED Decryption: content ID: ${id}`,
      );
      // Check that the result is an empty array since decryption failed
      expect(result).toEqual([]);
    });
  });
});
