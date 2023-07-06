import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteUsersDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
