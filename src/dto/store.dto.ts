// src/ciphor/dto/store.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsJSON, IsNotEmpty } from 'class-validator';

export class StoreDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID of the ciphor record',
    minLength: 3,
    maxLength: 16,
  })
  @IsString()
  @Length(3, 16)
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'mySecretKey1234567',
    description: 'Encryption key',
    maxLength: 16,
  })
  @IsString()
  @Length(16, 16)
  @IsNotEmpty()
  encryptionKey: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Value to be encrypted (JSON format)',
    required: true,
  })
  @IsJSON()
  @IsNotEmpty()
  value: Record<string, any>;
}
