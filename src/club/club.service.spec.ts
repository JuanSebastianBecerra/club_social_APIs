import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker/.';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity/club.entity';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.person.firstName(),
        fechaFundacion: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
        urlImagen: faker.image.url(),
        descripcion: faker.lorem.paragraph()
      })
      clubsList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Encontrar todos los clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('Encontrar club por id', async () => {
    const storedclub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedclub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedclub.nombre)
    expect(club.fechaFundacion).toEqual(storedclub.fechaFundacion)
    expect(club.urlImagen).toEqual(storedclub.urlImagen)
    expect(club.descripcion).toEqual(storedclub.descripcion)
  });

  it('Buscar por un id que no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("mensaje", "El id del club no fue encontrado")
  });

  it('Crear un nuevo club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.person.firstName(),
      fechaFundacion: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
      urlImagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: []
    }

    const nuevoclub: ClubEntity = await service.create(club);
    expect(nuevoclub).not.toBeNull();

    const storedclub: ClubEntity = await repository.findOne({ where: { id: nuevoclub.id } })
    expect(storedclub).not.toBeNull();
    expect(storedclub.nombre).toEqual(nuevoclub.nombre)
    expect(storedclub.fechaFundacion).toEqual(nuevoclub.fechaFundacion)
    expect(storedclub.urlImagen).toEqual(nuevoclub.urlImagen)
    expect(storedclub.descripcion).toEqual(nuevoclub.descripcion)
  });

  it('Actualizar un club', async () => {
    const club: ClubEntity = clubsList[0];
    club.nombre = "Nuevo nombre";
    club.descripcion = "Esta es una nueva descripcion";

    const updatedclub: ClubEntity = await service.update(club.id, club);
    expect(updatedclub).not.toBeNull();

    const storedclub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedclub).not.toBeNull();
    expect(storedclub.nombre).toEqual(club.nombre)
    expect(storedclub.descripcion).toEqual(club.descripcion)
  });

  it('Actualiozar un club que no existe', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club, nombre: "Nuevo nombre", descripcion: "Esta es una nueva descripcion"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("mensaje", "El id del club no fue encontrado")
  });

  it('Eliminar un club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);

    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('Eliminar un club que no existe', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("mensaje", "El id del club no fue encontrado")
  });

});
