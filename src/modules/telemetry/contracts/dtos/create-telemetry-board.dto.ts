interface CreateTelemetryDto {
  ownerId: string;
  groupId: string;
  integratedCircuitCardId?: string;
  machineId?: string;
  lastConnection?: Date;
  connectionStrength?: string;
  connectionType?: string;
}

export default CreateTelemetryDto;
