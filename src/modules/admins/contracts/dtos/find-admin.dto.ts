interface FindAdminDto {
  by: 'id' | 'email';
  value: string;
}

export default FindAdminDto;
