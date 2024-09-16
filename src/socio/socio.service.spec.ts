import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity/socio.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../compartido/utilidades/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        usuario: faker.person.firstName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' })
      })
      sociosList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Encontrar todos los socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('Encontrar socio por id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(storedSocio.usuario)
    expect(socio.correo).toEqual(storedSocio.correo)
    expect(socio.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('Buscar por un id que no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("mensaje", "El id del socio no fue encontrado")
  });

  it('Crear un nuevo socio', async () => {
    const socio: SocioEntity = {
      id: "",
      usuario: faker.person.firstName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.between({ from: '2000-01-01', to: '2010-01-01' }),
      clubs: []
    }

    const nuevoSocio: SocioEntity = await service.create(socio);
    expect(nuevoSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: { id: nuevoSocio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(nuevoSocio.usuario)
    expect(storedSocio.correo).toEqual(nuevoSocio.correo)
    expect(storedSocio.fechaNacimiento).toEqual(nuevoSocio.fechaNacimiento)
  });

  it('Actualizar un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.usuario = "Nuevo usuario";
    socio.correo = "correo@cambio.com";

    const updatedsocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedsocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(socio.usuario)
    expect(storedSocio.correo).toEqual(socio.correo)
  });

  it('Actualiozar un socio que no existe', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, usuario: "Nuevo usuario", correo: "correo@cambio.com"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("mensaje", "El id del socio no fue encontrado")
  });

  it('Eliminar un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);

    const deletedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedsocio).toBeNull();
  });

  it('Eliminar un socio que no existe', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("mensaje", "El id del socio no fue encontrado")
  });

});
