export default interface CreateCounterDto {
  label: string;

  counterTypeId: string;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;
}
