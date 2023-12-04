import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciphor } from './ciphor.entity';
import { CiphorController } from './ciphor.controller';
import { CiphorService } from './ciphor.service';
import { CiphorUtil } from './ciphor.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DATABASE || 'ciphor',
      entities: [Ciphor],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Ciphor]),
  ],
  controllers: [CiphorController],
  providers: [CiphorService, CiphorUtil],
})
export class CiphorModule {}
