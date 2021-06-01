import Product from '@modules/users/contracts/models/product';

interface GroupStock {
  prizes: Product[];
  supplies: Product[];
}

export default GroupStock;
