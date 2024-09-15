import { IsString, IsNotEmpty, IsDateString, Length } from "class-validator";

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha_fundacion: Date;

    @IsString()
    @IsNotEmpty()
    readonly urlImagen: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 100, {message: 'La descripcion no debe tener mas de 100 caracteres'})
    readonly descripcion: string;

}
