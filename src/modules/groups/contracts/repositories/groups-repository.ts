import CreateGroupDto from '../dtos/create-group-dto';
import FindGroupDto from '../dtos/find-group.dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findOne(data: FindGroupDto): Promise<Group | undefined>;
  find(data: FindGroupDto): Promise<Group[]>;
  save(group: Group): void;
}
