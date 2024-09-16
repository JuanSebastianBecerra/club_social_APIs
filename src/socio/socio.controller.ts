import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { SocioService } from './socio.service';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from './socio.dto/socio.dto';
import { SocioEntity } from './socio.entity/socio.entity';

@Controller('members')
export class SocioController {

    constructor(private readonly socioService: SocioService) { }

    @Get()
    async findAll() {
      return await this.socioService.findAll();
    }
  
    @Get(':socioId')
    async findOne(@Param('socioId', ParseUUIDPipe) socioId: string) {
      return await this.socioService.findOne(socioId);
    }
  
    @Post()
    async create(@Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.create(socio);
    }
  
    @Put(':socioId')
    async update(@Param('socioId', ParseUUIDPipe) socioId: string, @Body() socioDto: SocioDto) {
      const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
      return await this.socioService.update(socioId, socio);
    }
  
    @Delete(':socioId')
    @HttpCode(204)
    async delete(@Param('socioId', ParseUUIDPipe) socioId: string) {
      return await this.socioService.delete(socioId);
    }

}
