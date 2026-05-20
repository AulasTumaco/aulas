import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSalonDto {
  @IsString() @IsNotEmpty()
  codigo: string;

  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  edificio: string;

  @IsInt() @Min(1)
  capacidad: number;

  @IsBoolean() @IsOptional()
  tieneProyector?: boolean;

  @IsBoolean() @IsOptional()
  tieneAC?: boolean;

  @IsBoolean() @IsOptional()
  tieneTablero?: boolean;
}