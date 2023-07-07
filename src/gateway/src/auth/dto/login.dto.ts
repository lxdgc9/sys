import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  k: string;

  @IsNotEmpty()
  @IsString()
  v: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
