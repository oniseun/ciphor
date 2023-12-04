import { Test, TestingModule } from '@nestjs/testing';
import { CiphorController } from './ciphor.controller';
import { CiphorService } from './ciphor.service';
import { StoreDto } from './dto/store.dto';
import { RetrieveDto } from './dto/retrieve.dto';
import { Ciphor } from './ciphor.entity';
import { StoreResponseDto } from './dto/store-response.dto';
import { RetrieveResponseDto } from './dto/retrieve-response.dto';

describe('CiphorController', () => {
  let ciphorController: CiphorController;
  let ciphorServiceMock: jest.Mocked<CiphorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiphorController],
      providers: [
        {
          provide: CiphorService,
          useFactory: () => {
            ciphorServiceMock = {
              encrypt: jest.fn(),
              decrypt: jest.fn(),
            } as unknown as jest.Mocked<CiphorService>;
            return ciphorServiceMock;
          },
        },
      ],
    }).compile();

    ciphorController = module.get<CiphorController>(CiphorController);
  });

  describe('store', () => {
    it('should call CiphorService encrypt method and return the result as StoreResponseDto', async () => {
      const storeDto: StoreDto = {
        id: '1',
        encryptionKey: 'mySecretKey1234567',
        value: { key: 'value' },
      };

      const expectedResult: Ciphor = {
        id: '1',
        vector: 'abcdef0123456789',
        content: 'encryptedContent',
        dateCreated: new Date(),
        dateUpdated: new Date(),
      };

      ciphorServiceMock.encrypt.mockResolvedValue(expectedResult);

      const result = await ciphorController.store(storeDto);

      expect(result).toBeInstanceOf(StoreResponseDto);
      expect(result.id).toEqual(expectedResult.id);
      expect(result.content).toEqual(storeDto.value);
      expect(result.dateCreated).toEqual(expectedResult.dateCreated);
      expect(result.dateUpdated).toEqual(expectedResult.dateUpdated);

      expect(ciphorServiceMock.encrypt).toHaveBeenCalledWith(
        storeDto.id,
        storeDto.encryptionKey,
        storeDto.value,
      );
    });

    it('should handle errors thrown by CiphorService encrypt method', async () => {
      const storeDto: StoreDto = {
        id: '1',
        encryptionKey: 'mySecretKey1234567',
        value: { key: 'value' },
      };

      const error = new Error('Encryption failed');
      ciphorServiceMock.encrypt.mockRejectedValue(error);

      try {
        await ciphorController.store(storeDto);
        // Fail the test if it does not throw an error
        fail('Expected an error to be thrown');
      } catch (e) {
        expect(e.response).toHaveProperty('statusCode', 500);
        expect(e.response).toHaveProperty('message', 'Internal server error');
      }
    });
  });

  describe('retrieve', () => {
    it('should call CiphorService decrypt method and return the result as an array of RetrieveResponseDto', async () => {
      const retrieveDto: RetrieveDto = {
        id: '1',
        decryptionKey: 'myDecryptionKey123',
      };

      const expectedResult: Ciphor[] = [
        {
          id: '1',
          vector: 'abcdef0123456789',
          content: 'decryptedContent1',
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
        {
          id: '2',
          vector: '0123456789abcdef',
          content: 'decryptedContent2',
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
      ];

      ciphorServiceMock.decrypt.mockResolvedValue(expectedResult);

      const results = await ciphorController.retrieve(retrieveDto);

      expect(results).toBeInstanceOf(Array);
      results.forEach((result) => {
        expect(result).toBeInstanceOf(RetrieveResponseDto);
        expect(result.id).toEqual(
          expectedResult.find((r) => r.id === result.id).id,
        );
        expect(result.content).toEqual(
          JSON.parse(expectedResult.find((r) => r.id === result.id).content),
        );
        expect(result.dateCreated).toEqual(
          expectedResult.find((r) => r.id === result.id).dateCreated,
        );
        expect(result.dateUpdated).toEqual(
          expectedResult.find((r) => r.id === result.id).dateUpdated,
        );
      });

      expect(ciphorServiceMock.decrypt).toHaveBeenCalledWith(
        retrieveDto.id,
        retrieveDto.decryptionKey,
      );
    });

    it('should handle errors thrown by CiphorService decrypt method', async () => {
      const retrieveDto: RetrieveDto = {
        id: '1',
        decryptionKey: 'myDecryptionKey123',
      };

      const error = new Error('Decryption failed');
      ciphorServiceMock.decrypt.mockRejectedValue(error);

      try {
        await ciphorController.retrieve(retrieveDto);
        // Fail the test if it does not throw an error
        fail('Expected an error to be thrown');
      } catch (e) {
        expect(e.response).toHaveProperty('statusCode', 500);
        expect(e.response).toHaveProperty('message', 'Internal server error');
      }
    });
  });
});
