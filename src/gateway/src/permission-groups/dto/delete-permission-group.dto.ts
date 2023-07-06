import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeletePermissionGroupsDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
