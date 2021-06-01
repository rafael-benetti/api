interface FindCategoryDto {
  by: 'id' | 'label' | 'ownerId';
  value: string;
  ownerId?: string;
  populate?: string[];
}

export default FindCategoryDto;
