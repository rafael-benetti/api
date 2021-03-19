interface FindCategoryDto {
  by: 'id' | 'label' | 'ownerId';
  value: string;
  populate?: string[];
}

export default FindCategoryDto;
