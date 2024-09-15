import { SocioEntity } from "src/socio/socio.entity/socio.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fecha_fundacion: Date;

    @Column()
    url_imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    socios: SocioEntity[];
}
