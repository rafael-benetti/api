export default interface CreateGroupDto {
  label?: string;
  isPersonal?: boolean;
  ownerId: string;
}
