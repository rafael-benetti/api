import CreateGroupDto from '../dtos/create-group-dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findByOwnerId(ownerId: string): Promise<Group[]>;
  find(groupIds: string[]): Promise<Group[]>;
}
