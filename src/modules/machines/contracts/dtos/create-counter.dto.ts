export default interface CreateCounterDto {
  counterTypeId: string;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;
}
