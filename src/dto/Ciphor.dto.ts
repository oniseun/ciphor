import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsJSON } from 'class-validator';
import { Ciphor } from '../ciphor.entity';

export class CiphorDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID of the ciphor record',
    minLength: 3,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Encrypted content (JSON format)',
    required: true,
  })
  @IsJSON()
  @IsNotEmpty()
  content: Record<string, any>;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date and time when the record was created',
  })
  @IsDateString()
  dateCreated: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date and time when the record was last updated',
  })
  @IsDateString()
  dateUpdated: Date;

  constructor(ciphor: Ciphor) {
    this.id = ciphor.id;
    this.content = JSON.parse(ciphor.content);
    this.dateCreated = ciphor.dateCreated;
    this.dateUpdated = ciphor.dateUpdated;
  }
}
