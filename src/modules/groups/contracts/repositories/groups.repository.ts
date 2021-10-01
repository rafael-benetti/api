import CreateGroupDto from '../dtos/create-group.dto';
import FindGroupDto from '../dtos/find-group.dto';
import FindGroupsDto from '../dtos/find-groups.dto';
import Group from '../models/group';

interface GroupsRepository {
  create(data: CreateGroupDto): Group;
  findOne(data: FindGroupDto): Promise<Group | undefined>;
  find(data: FindGroupsDto): Promise<Group[]>;
  groupsInvertoryByProduct({ filters }: FindGroupsDto): Promise<
    {
      prizeId: string;
      prizeLabel: string;
      totalPrizes: string;
    }[]
  >;
  groupsInvertoryBySupplies({ filters }: FindGroupsDto): Promise<
    {
      supplieId: string;
      supplieLabel: string;
      totalSupplies: string;
    }[]
  >;
  save(data: Group): void;
  delete(data: Group): void;
}

export default GroupsRepository;
