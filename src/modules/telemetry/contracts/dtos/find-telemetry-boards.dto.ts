interface FindTelemetryBoardsDto {
  filters: {
    groupIds?: string[];
    ownerId?: string;
  };
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindTelemetryBoardsDto;
