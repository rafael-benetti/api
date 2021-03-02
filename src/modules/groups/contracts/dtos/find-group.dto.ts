import Group from '../models/group';

type FindGroupDto = {
  [key in keyof Group]?: string;
};

export default FindGroupDto;
