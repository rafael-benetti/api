import Counter from '../models/counter';

export default interface CreateBoxDto {
  id?: string;
  counters: Counter[];
  currentMoney?: number;
  numberOfPrizes?: number;
}
