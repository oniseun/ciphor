import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsObject } from 'class-validator';

export class StoreDto {
  @ApiProperty({
    example: 'prefix1-first',
    description: 'ID of the ciphor record',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'mySecretKey12345',
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
  @IsObject()
  @IsNotEmpty()
  value: Record<string, any>;
}
