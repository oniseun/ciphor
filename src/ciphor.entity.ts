import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Ciphor {
  @Column({ type: 'text', nullable: false, unique: true })
  id: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ length: 'text', name: 'initial_vector', nullable: false })
  vector: string;

  @CreateDateColumn({
    name: 'date_created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @UpdateDateColumn({
    name: 'date_updated',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateUpdated: Date;
}
