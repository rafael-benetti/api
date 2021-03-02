import MachineCategory from '../models/machine-category';

type FindMachineCategoryDto = {
  [key in keyof MachineCategory]?: string;
};

export default FindMachineCategoryDto;
