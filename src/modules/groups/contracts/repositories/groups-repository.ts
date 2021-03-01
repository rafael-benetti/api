import CreateGroupDto from '../dtos/create-group-dto';
import Group from '../models/group';

export default interface GroupsRepository {
  create(data: CreateGroupDto): Promise<Group>;
}
