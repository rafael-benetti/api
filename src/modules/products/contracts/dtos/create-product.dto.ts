import ProductType from '../models/product-type';

interface CreateProductDto {
  label: string;
  productType: ProductType;
}

export default CreateProductDto;
