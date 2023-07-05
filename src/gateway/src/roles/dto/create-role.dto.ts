import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  level: number;

  @IsMongoId({ each: true })
  permission_ids: string[];
}
