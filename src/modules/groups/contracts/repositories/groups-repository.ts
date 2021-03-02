import CreateGroupDto from '../dtos/create-group-dto';
import FindByNameDto from '../dtos/find-by-name-dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findByOwnerId(ownerId: string): Promise<Group[]>;
  findById(groupId: string): Promise<Group | undefined>;
  findByName(name: FindByNameDto): Promise<Group | undefined>;
  find(groupIds: string[]): Promise<Group[]>;
}
