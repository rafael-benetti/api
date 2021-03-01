interface FindAdminDto {
  by: '_id' | 'email';
  value: string;
}

export default FindAdminDto;
