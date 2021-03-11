interface FindUserDto {
  by: 'id' | 'email';
  value: string;
  populate?: string[];
}

export default FindUserDto;
