interface FindTelemetryBoardsDto {
  filters: {
    groupIds?: string[];
    ownerId?: string;
    id?: number | number[];
  };
  limit?: number;
  offset?: number;
  populate?: string[];
}

export default FindTelemetryBoardsDto;
