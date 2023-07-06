import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

type Attr = {
  k: string;
  v: string;
};

export class CreateUserDto {
  @IsObject()
  ufields: {
    username: string;
    phone: string;
    email: string;
  };

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsObject()
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
