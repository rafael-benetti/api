import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateGroupDto from '../dtos/create-group-dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findOne(data: FindEntityDto<Group>): Promise<Group | undefined>;
  find(data: FindEntityDto<Group>): Promise<Group[]>;
  save(group: Group): void;
}
