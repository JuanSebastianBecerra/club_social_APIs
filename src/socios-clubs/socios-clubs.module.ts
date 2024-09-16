import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import { ClubService } from '../club/club.service';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { SocioService } from '../socio/socio.service';
import { SociosClubsController } from './socios-clubs.controller';
import { SociosClubsService } from './socios-clubs.service';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity,ClubEntity])],
    providers: [SocioService,SociosClubsService, ClubService],
    controllers: [SociosClubsController],
  })
export class SociosClubsModule {}
