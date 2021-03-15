import Prize from '@modules/users/contracts/models/prize';
import Supply from '@modules/users/contracts/models/supply';

interface GroupStock {
  prizes: Prize[];
  supplies: Supply[];
}

export default GroupStock;
