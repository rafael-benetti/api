interface FindGroupDto {
  by: 'id' | 'ownerId';
  value: string;
  populate?: string[];
}

export default FindGroupDto;
