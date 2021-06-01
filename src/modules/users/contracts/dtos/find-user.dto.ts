interface FindUserDto {
  by: 'id' | 'email';
  value: string;
  populate?: string[];
  fields?: string[];
}

export default FindUserDto;
