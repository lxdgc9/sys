import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteRolesDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
