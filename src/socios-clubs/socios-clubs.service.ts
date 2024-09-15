import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../compartido/errores/errores-de-negocio';

@Injectable()
export class SociosClubsService {

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>

    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>

    async addMemberToClub(socioId: string, clubId: string): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND);
      
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
        if (!club)
          throw new BusinessLogicException("El club con el id dado no fue encontrada", BusinessError.NOT_FOUND);
    
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
      }

      async findMembersFromClub (clubId: string): Promise<SocioEntity[]> {
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
        if (!club)
          throw new BusinessLogicException("El club con el id dado no fue encontrada", BusinessError.NOT_FOUND)
   
        return club.socios;
    }

    async  findMemberFromClub (socioId: string, clubId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
        if (!club)
          throw new BusinessLogicException("El club con el id dado no fue encontrada", BusinessError.NOT_FOUND)
   
        const socioClub: SocioEntity = club.socios.find(currentSocio => currentSocio.id === socio.id);
   
        if (!socioClub)
          throw new BusinessLogicException("El socio con el id dado no esta asociado al club", BusinessError.PRECONDITION_FAILED)
   
        return socioClub;
    }

    async updateMembersFromClub(socios: SocioEntity[] , clubId: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
    
        if (!club)
          throw new BusinessLogicException("El club con el id dado no fue encontrada", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}});
          if (!socio)
            throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        club.socios = socios;
        return await this.clubRepository.save(club);
      }

      async deleteMemberFromClub(socioId: string, clubId: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el id dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const socioClub: SocioEntity = club.socios.find(currentSocio => currentSocio.id === socio.id);
    
        if (!socioClub)
            throw new BusinessLogicException("El socio con el id dado no esta asociado al club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(currentSocio => currentSocio.id !== socioId);
        await this.clubRepository.save(club);
    }  

}
