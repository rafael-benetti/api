export default interface CreateCounterDto {
  id?: string;

  counterTypeId: string;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin?: string;
}
