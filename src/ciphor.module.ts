import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciphor } from './ciphor.entity';
import { CiphorController } from './ciphor.controller';
import { CiphorService } from './ciphor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ciphor]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DATABASE || 'account',
      entities: [Ciphor],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
  ],
  controllers: [CiphorController],
  providers: [CiphorService],
})
export class CiphorModule {}
