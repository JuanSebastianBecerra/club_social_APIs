import { Test, TestingModule } from '@nestjs/testing';
import { SociosClubsService } from './socios-clubs.service';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { ClubEntity } from '../club/club.entity/club.entity';
import { Repository } from 'typeorm';
import { SocioService } from '../socio/socio.service';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('SociosClubsService', () => {
  let serviceSocioClub: SociosClubsService;
  let repositoryClub: Repository<ClubEntity>;
  let serviceSocio: SocioService;
  let repositorySocio: Repository<SocioEntity>;
  let sociosList: SocioEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SociosClubsService, SocioService],
    }).compile();

    serviceSocioClub = module.get<SociosClubsService>(SociosClubsService);
    serviceSocio = module.get<SocioService>(SocioService);

    repositoryClub = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    repositorySocio = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(serviceSocioClub).toBeDefined();
  });

  const seedDatabase = async () => {
    repositorySocio.clear();
    repositoryClub.clear();

    sociosList = []
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repositorySocio.save({
        usuario: faker.person.firstName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
      });
      sociosList.push(socio);
    }

    club = await repositoryClub.save({
      nombre: faker.person.firstName(),
      fechaFundacion: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
      urlImagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: sociosList
    });
  }

  it('addMemberToClub debe  agregar un socio a un club', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });

    const club: ClubEntity = await repositoryClub.save({
      nombre: faker.person.firstName(),
      fechaFundacion: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
      urlImagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: []
    });

    const result: ClubEntity = await serviceSocioClub.addMemberToClub(socio.id, club.id);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].usuario).toBe(socio.usuario)
    expect(result.socios[0].correo).toEqual(socio.correo);
    expect(result.socios[0].fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('addMemberToClub debe lanzar una exception por un socio no existente', async () => {
    const club: ClubEntity = await repositoryClub.save({
      nombre: faker.person.firstName(),
      fechaFundacion: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
      urlImagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: []
    });

    await expect(() => serviceSocioClub.addMemberToClub( "0", club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no fue encontrado");
  });

  it('addMemberToClub debe lanzar una exception por un club no existente', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });


    await expect(() => serviceSocioClub.addMemberToClub(socio.id,  "0")).rejects.toHaveProperty("mensaje", "El club con el id dado no fue encontrada");
  });

  it('findMembersFromClub debe retornar los socios de un club', async () => {
    const socios: SocioEntity[] = await serviceSocioClub.findMembersFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findMembersFromClub debe lanzar una exception por cultura no encontrada', async () => {
    await expect(() => serviceSocioClub.findMembersFromClub("0")).rejects.toHaveProperty("mensaje", "El club con el id dado no fue encontrada");
  });

  it('findMemberFromClub debe retornar el socio del club dado', async () => {
    const socio: SocioEntity = sociosList[0];
    const socioExistente: SocioEntity = await serviceSocioClub.findMemberFromClub(socio.id, club.id)
    expect(socioExistente).not.toBeNull();
    expect(socioExistente.usuario).toBe(socio.usuario);
    expect(socioExistente.correo).toEqual(socio.correo);
    expect(socioExistente.fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('findMemberFromClub debe lanzar una exception para un socio no encontrado', async () => {
    await expect(() => serviceSocioClub.findMemberFromClub("0", club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no fue encontrado");
  });

  it('findMemberFromClub debe lanzar una exception para una club no encontrado', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => serviceSocioClub.findMemberFromClub(socio.id, "0")).rejects.toHaveProperty("mensaje", "El club con el id dado no fue encontrada");
  });

  it('findMemberFromClub debe lanzar una exception para un socio que no esta asociado a un club', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });

    await expect(() => serviceSocioClub.findMemberFromClub(socio.id, club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no esta asociado al club");
  });

  it('updateMembersFromClub debe actualizar la lista de socios de un club', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });

    const clubUpdated: ClubEntity = await serviceSocioClub.updateMembersFromClub([socio], club.id);
    expect(clubUpdated.socios.length).toBe(1);

    expect(clubUpdated.socios[0].usuario).toBe(socio.usuario);
    expect(clubUpdated.socios[0].correo).toEqual(socio.correo);
    expect(clubUpdated.socios[0].fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('updateMembersFromClub debe lanzar una exception para una club no encontrado', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });

    await expect(() => serviceSocioClub.updateMembersFromClub([socio], "0")).rejects.toHaveProperty("mensaje", "El club con el id dado no fue encontrada");
  });

  it('updateMembersFromClub debe lanzar una exception para un socio no encontrado invalido', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.id = "0";

    await expect(() => serviceSocioClub.updateMembersFromClub([socio], club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no fue encontrado");
  });

  it('deleteMemberFromClub debe eliminar un socio del club', async () => {
    const socio: SocioEntity = sociosList[0];

    await serviceSocioClub.deleteMemberFromClub(socio.id, club.id);

    const clubExistente: ClubEntity = await repositoryClub.findOne({ where: { id: club.id }, relations: ["socios"] });
    const socioDeleted: SocioEntity = clubExistente.socios.find(a => a.id === socio.id);

    expect(socioDeleted).toBeUndefined();
  });

  it('deleteMemberFromClub debe lanzar una exception para un socio no encontrado', async () => {
    await expect(() => serviceSocioClub.deleteMemberFromClub("0", club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no fue encontrado");
  });

  it('deleteMemberFromClub debe lanzar una exception para una club no encontrado', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => serviceSocioClub.deleteMemberFromClub(socio.id, "0")).rejects.toHaveProperty("mensaje", "El club con el id dado no fue encontrada");
  });

  it('deleteMemberFromClub debe lanzar una exception para un socio no asociado al club', async () => {
    const socio: SocioEntity = await repositorySocio.save({
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
    });
    await expect(() => serviceSocioClub.deleteMemberFromClub(socio.id, club.id)).rejects.toHaveProperty("mensaje", "El socio con el id dado no esta asociado al club");
  });



});
