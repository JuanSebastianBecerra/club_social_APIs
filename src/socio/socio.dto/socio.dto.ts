import { IsString, IsNotEmpty, IsDateString, IsEmail } from "class-validator";

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @IsEmail()
    @IsNotEmpty()
    readonly correo: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha_nacimineto: Date;
}
