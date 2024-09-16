import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { SociosClubsService } from './socios-clubs.service';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from '../socio/socio.dto/socio.dto';
import { SocioEntity } from '../socio/socio.entity/socio.entity';

@Controller('clubs')
export class SociosClubsController {

    constructor(private readonly sociosClubsService: SociosClubsService){}

    @Post(':clubId/members/:socioId')
    async agregarRecetaACultutaGastronomica(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.sociosClubsService.addMemberToClub(socioId, clubId);
    }

    @Get(':clubId/members/:socioId')
    async obtenerRecetaPorclubId(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.sociosClubsService.findMemberFromClub(socioId, clubId);
    }

    @Get(':clubId/members')
    async obtenermembersPorclubId(@Param('clubId') clubId: string) {
        return await this.sociosClubsService.findMembersFromClub(clubId);
    }

   
    @Put(':clubId/members')
    async associatemembersMuseum(@Body() socioDto: SocioDto[], @Param('clubId') clubId: string) {
        const socios = plainToInstance(SocioEntity, socioDto)
        return await this.sociosClubsService.updateMembersFromClub(socios, clubId);
    }

    @Delete(':clubId/members/:socioId')
    @HttpCode(204)
    async deleteArtworkMuseum(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.sociosClubsService.deleteMemberFromClub(socioId, clubId);
    }

}
