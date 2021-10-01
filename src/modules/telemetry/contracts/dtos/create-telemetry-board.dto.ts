interface CreateTelemetryDto {
  ownerId: string;
  groupId: string;
  integratedCircuitCardId?: string;
  machineId?: string;
  lastConnection?: Date;
  connectionStrength?: number;
  connectionType?: string;
}

export default CreateTelemetryDto;
