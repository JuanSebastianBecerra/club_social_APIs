import { SocioEntity } from "src/socio/socio.entity/socio.entity";
export declare class ClubEntity {
    id: string;
    nombre: string;
    fecha_fundacion: Date;
    url_imagen: string;
    descripcion: string;
    socios: SocioEntity[];
}
