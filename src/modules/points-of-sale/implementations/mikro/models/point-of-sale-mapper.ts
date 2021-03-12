import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import MikroPointOfSale from './mikro-point-of-sale';

abstract class PointOfSaleMapper {
  static toApi(data: MikroPointOfSale): PointOfSale {
    const pointOfSale = new PointOfSale();
    Object.assign(pointOfSale, data);
    return pointOfSale;
  }

  static toOrm(data: PointOfSale): MikroPointOfSale {
    const pointOfSale = new MikroPointOfSale();
    Object.assign(pointOfSale, data);
    return pointOfSale;
  }
}

export default PointOfSaleMapper;
