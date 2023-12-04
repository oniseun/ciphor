import { Ciphor } from './ciphor.entity';
import { v4 as uuidv4 } from 'uuid';
import { CiphorRepository } from './ciphor.repository.interface';

export default class CiphorRepositoryMock extends CiphorRepository {
  constructor(private ciphorStore: Ciphor[] = []) {
    super();
  }
  async find(id: string): Promise<Ciphor[]> {
    return this.ciphorStore.filter(
      (ciphor) => ciphor.id === id || ciphor.id.startsWith(id),
    );
  }

  async findOne(id: string): Promise<Ciphor> {
    return this.ciphorStore.find((ciphor) => ciphor.id === id);
  }

  async save(payload: Partial<Ciphor>): Promise<Ciphor> {
    if (payload.id !== undefined) {
      const ciphorIndex = this.ciphorStore.findIndex(
        (ciphor) => ciphor.id === payload.id,
      );
      Object.keys(payload).forEach((key) => {
        this.ciphorStore[ciphorIndex][key] = payload[key];
      });

      const ud = new Date();
      ud.setSeconds(ud.getSeconds() + 60);
      this.ciphorStore[ciphorIndex].dateUpdated = ud;

      return this.ciphorStore[ciphorIndex];
    }

    payload.id = uuidv4();
    payload.dateCreated = new Date();
    payload.dateUpdated = new Date();

    this.ciphorStore.push(payload as Ciphor);
    return payload as Ciphor;
  }

  async delete(id: string): Promise<void> {
    const ciphorIndex = this.ciphorStore.findIndex(
      (ciphor) => ciphor.id === id,
    );
    this.ciphorStore.splice(ciphorIndex, 1);
  }
}
