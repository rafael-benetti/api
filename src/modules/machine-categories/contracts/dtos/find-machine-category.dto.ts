import MachineCategory from '../models/machine-category';

type FindMachineCategoryDto = {
  limit?: number;
  offset?: number;
  filters: {
    [key in keyof MachineCategory]?: string;
  };
  populate?: string[];
};

export default FindMachineCategoryDto;
