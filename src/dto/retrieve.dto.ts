import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class RetrieveDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID of the record',
    minLength: 3,
    maxLength: 16,
  })
  @IsString()
  @Length(3, 16)
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'myDecryptionKey123',
    description: 'Decryption key',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Length(16)
  @IsNotEmpty()
  decryptionKey: string;
}
