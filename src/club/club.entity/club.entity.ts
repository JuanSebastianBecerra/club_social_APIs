import { SocioEntity } from "../../socio/socio.entity/socio.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fecha_fundacion: Date;

    @Column()
    urlImagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
    @JoinTable()
    socios: SocioEntity[];
}
