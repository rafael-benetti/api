import Machine from '../models/machine';

interface FindMachineDto {
  limit?: number;
  offset?: number;
  filters: Partial<Machine>;
  populate?: string[];
}

export default FindMachineDto;
