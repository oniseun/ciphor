import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class RetrieveDto {
  @ApiProperty({
    example: 'prefix1-',
    description: 'ID of the record or prefix of the id',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'mySecretKey12345',
    description: 'Decryption key',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Length(16)
  @IsNotEmpty()
  decryptionKey: string;
}
