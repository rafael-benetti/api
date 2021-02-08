export default interface ICreateCounterDTO {
  name: string;
  slot: number;
  hasDigital: number;
  hasMechanical: number;
  pin: number;
  pulseValue: number;
  machineId: number;
  typeId: number;
}
