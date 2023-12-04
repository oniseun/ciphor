import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CiphorService } from './ciphor.service';
import { StoreDto } from './dto/store.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RetrieveDto } from './dto/retrieve.dto';
import { RetrieveResponseDto } from './dto/retrieve-response.dto';
import { StoreResponseDto } from './dto/store-response.dto';

@ApiTags('Ciphor')
@Controller('ciphor')
export class CiphorController {
  constructor(private readonly ciphorService: CiphorService) {}

  @Post('store')
  @ApiOperation({ summary: 'Store encrypted value' })
  @ApiBody({ type: StoreDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully stored encrypted value',
    type: StoreResponseDto,
  })
  async store(@Body() storeDto: StoreDto): Promise<StoreResponseDto> {
    try {
      const { id, encryptionKey, value } = storeDto;
      const result = await this.ciphorService.encrypt(id, encryptionKey, value);
      return new StoreResponseDto(result, value);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('retrieve')
  @ApiOperation({ summary: 'Retrieve decrypted value' })
  @ApiBody({ type: RetrieveDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved decrypted value',
    type: [RetrieveResponseDto],
  })
  async retrieve(
    @Body() retrieveDto: RetrieveDto,
  ): Promise<RetrieveResponseDto[]> {
    try {
      const { id, decryptionKey } = retrieveDto;
      const results = await this.ciphorService.decrypt(id, decryptionKey);
      return results.map((result) => new RetrieveResponseDto(result));
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
