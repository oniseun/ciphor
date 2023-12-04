import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Ciphor } from './ciphor.entity';
import { CiphorUtil } from './ciphor.util';

@Injectable()
export class CiphorService {
  private readonly logger = new Logger(CiphorService.name);
  constructor(
    @InjectRepository(Ciphor) private ciphorRepository: Repository<Ciphor>,
    private ciphorUtil: CiphorUtil,
  ) {}

  async encrypt(
    id: string,
    encryptionKey: string,
    value: any,
  ): Promise<Ciphor> {
    try {
      const vector = this.ciphorUtil.getInitialVector();
      const stringValue = JSON.stringify(value);

      const content = this.ciphorUtil.encrypt(
        encryptionKey,
        stringValue,
        vector,
      );

      const ciphor = {
        id,
        vector,
        content,
      };

      return await this.ciphorRepository.save(ciphor);
    } catch (e) {
      this.logger.error(`encrypt ${e}`);
      throw e;
    }
  }

  async decrypt(id: string, decryptionKey: string): Promise<Ciphor[]> {
    const records = await this.ciphorRepository.find({
      where: { id: Like(`${id}%`) },
    });

    if (records.length > 0) {
      const decryptedRecords = records.reduce((decrypted, record) => {
        const { id, content, vector, dateCreated, dateUpdated } = record;

        try {
          const decryptContent = this.ciphorUtil.decrypt(
            decryptionKey,
            content,
            vector,
          );
          decrypted.push({
            id,
            content: decryptContent,
            vector,
            dateCreated,
            dateUpdated,
          });
        } catch (e) {
          this.logger.error(`FAILED Decryption: content ID: ${id}`);
        }

        return decrypted;
      }, []);

      return decryptedRecords;
    }

    return [];
  }
}
