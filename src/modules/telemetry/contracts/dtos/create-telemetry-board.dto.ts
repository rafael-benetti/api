interface CreateTelemetryDto {
  ownerId: string;
  groupId: string;
  machineId?: string;
  lastConnection?: Date;
  connectionStrength?: string;
  connectionType?: string;
}

export default CreateTelemetryDto;
