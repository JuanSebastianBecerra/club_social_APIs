import { IsString, IsNotEmpty, IsDateString, IsEmail, IsDate, IsISO8601 } from "class-validator";

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @IsEmail()
    @IsNotEmpty()
    readonly correo: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fechaNacimiento: Date;
}
