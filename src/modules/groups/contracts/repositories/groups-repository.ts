import CreateGroupDto from '../dtos/create-group-dto';
import FindByLabelDto from '../dtos/find-by-label-dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findByOwnerId(ownerId: string): Promise<Group[]>;
  findById(groupId: string): Promise<Group | undefined>;
  findByLabel(name: FindByLabelDto): Promise<Group | undefined>;
  find(groupIds: string[]): Promise<Group[]>;
  save(group: Group): void;
}
