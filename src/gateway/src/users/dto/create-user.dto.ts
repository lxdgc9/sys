import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

class Attr {
  @IsString()
  k: string;

  @IsString()
  v: string;
}

class UniqFields {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsObject()
  ufields: UniqFields;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsArray()
  profile: Attr[];

  @IsNotEmpty()
  @IsMongoId()
  role_id: string;

  @IsOptional()
  @IsMongoId({ each: true })
  spec_permission_ids: string[];

  @IsOptional()
  is_active: boolean;
}
