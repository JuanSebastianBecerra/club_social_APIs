import { ClubEntity } from "../../club/club.entity/club.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    usuario: string;

    @Column()
    correo: string;

    @Column()
    fechaNacimiento: Date;

    @ManyToMany(() => ClubEntity, club => club.socios)
    @JoinTable()
    clubs: ClubEntity[];
}
