import { Ciphor } from './ciphor.entity';

export abstract class CiphorRepository {
  abstract find(id: string): Promise<Ciphor[]>;

  abstract findOne(id: string): Promise<Ciphor>;

  abstract save(payload: Partial<Ciphor>): Promise<Ciphor>;

  abstract delete(id: string): Promise<void>;
}
