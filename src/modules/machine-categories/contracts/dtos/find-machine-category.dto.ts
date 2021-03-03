import MachineCategory from '../models/machine-category';

type FindMachineCategoryDto = {
  limit?: number;
  offset?: number;
  filters: Partial<MachineCategory>;
  populate?: string[];
};

export default FindMachineCategoryDto;
