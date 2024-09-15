import { ClubEntity } from "src/club/club.entity/club.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    usuario: string;

    @Column()
    correo: string;

    @Column()
    fecha_nacimiento: Date;

    @ManyToMany(() => ClubEntity, club => club.socios)
    clubs: SocioEntity[];
}
