import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeletePermissionsDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
