import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { ErroresDeNegocioInterceptor } from '../compartido/interceptores/errores-de-negocio.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity/club.entity';
import { ClubDto } from './club.dto/club.dto';

@Controller('clubs')
@UseInterceptors(ErroresDeNegocioInterceptor)
export class ClubController {

    constructor(private readonly clubService: ClubService) { }

    @Get()
    async findAll() {
      return await this.clubService.findAll();
    }
  
    @Get(':clubId')
    async findOne(@Param('clubId', ParseUUIDPipe) clubId: string) {
      return await this.clubService.findOne(clubId);
    }
  
    @Post()
    async create(@Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
      return await this.clubService.create(club);
    }
  
    @Put(':clubId')
    async update(@Param('clubId', ParseUUIDPipe) clubId: string, @Body() clubDto: ClubDto) {
      const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
      return await this.clubService.update(clubId, club);
    }
  
    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param('clubId', ParseUUIDPipe) clubId: string) {
      return await this.clubService.delete(clubId);
    }

}
