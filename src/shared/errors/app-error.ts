export default class AppError {
  readonly errorCode: string;

  readonly message: string;

  readonly statusCode: number;

  static unknownError = new AppError({
    errorCode: 'UNKNOWN_CODE',
    message: 'An unknown error has occurred.',
    statusCode: 400,
  });

  static emailAlreadyUsed = new AppError({
    errorCode: 'EMAIL_ALREADY_USED',
    message: 'This email is unavailable.',
    statusCode: 409,
  });

  static collectionAlreadyReviewed = new AppError({
    errorCode: 'COLLECTION_ALREADY_REVIEWED',
    message: 'This collections already been reviewed .',
    statusCode: 409,
  });

  static machineHasLocation = new AppError({
    errorCode: 'MACHINE_HAS_POINT_OF_SALE',
    message:
      'You cannot change the group of a machine which has a point of sale.',
    statusCode: 409,
  });

  static machineBelongsToARoute = new AppError({
    errorCode: 'MACHINE_BELONGS_TO_A_ROUTE',
    message:
      'You cannot change the operator of a machine that belongs to a route.',
    statusCode: 400,
  });

  static serialNumberAlreadyUsed = new AppError({
    errorCode: 'SERIAL_NUMBER_ALREADY_USED',
    message: 'This serial number is unavailable.',
    statusCode: 409,
  });

  static tokenIsMissing = new AppError({
    errorCode: 'TOKEN_IS_MISSING',
    message: 'Your request does not have an auth token.',
    statusCode: 401,
  });

  static thisMachineIsOffline = new AppError({
    errorCode: 'THIS_MACHINE_IS_OFFLINE',
    message: "You can't make collectios in machines that are offline",
    statusCode: 401,
  });

  static thisMachineHasTelemetryBoard = new AppError({
    errorCode: 'THIS_MACHINE_HAS_TELEMETRY_BOARD',
    message: "You can't transfer machines that have telemetry board",
    statusCode: 401,
  });

  static invalidToken = new AppError({
    errorCode: 'INVALID_TOKEN',
    message: 'Your auth token is invalid.',
    statusCode: 401,
  });

  static oldPasswordIsMissing = new AppError({
    errorCode: 'OLD_PASSWORD_IS_MISSING',
    message: 'You need to inform the old password to set a new password.',
    statusCode: 401,
  });

  static oldPasswordDoesMatch = new AppError({
    errorCode: 'OLD_PASSWPRD_DOES_MATCH',
    message: 'Old password does not match',
    statusCode: 401,
  });

  static nameAlreadyInUsed = new AppError({
    errorCode: 'NAME_ALREADY_USED',
    message: 'You already used.',
    statusCode: 409,
  });

  static labelAlreadyInUsed = new AppError({
    errorCode: 'LABEL_ALREADY_USED',
    message: "You already used this 'label'.",
    statusCode: 409,
  });

  static incorrectEmailOrPassword = new AppError({
    errorCode: 'INCORRECT_EMAIL_PASSWORD_COMBINATION',
    message: 'Incorrect email/password combination.',
    statusCode: 401,
  });

  static incorrectFilters = new AppError({
    errorCode: 'INCORRECT_FILTERS',
    message: 'Incorrect filters, check the filters.',
    statusCode: 400,
  });

  static incorrectPermissionsForOperator = new AppError({
    errorCode: 'INCORRECT_PERMISSIONS_FOR_OPERATOR',
    message: 'Incorrect permissions for operator.',
    statusCode: 400,
  });

  static incorrectPermissionsForManager = new AppError({
    errorCode: 'INCORRECT_PERMISSIONS_FOR_MANAGER',
    message: 'Incorrect permissions for manager.',
    statusCode: 400,
  });

  static insufficientProducts = new AppError({
    errorCode: 'INSUFFICIENT_PRODUCTS',
    message: "You don't have enough products to transfer.",
    statusCode: 409,
  });

  static noTransfersBetweenOperators = new AppError({
    errorCode: 'NO_TRANSFERS_BETWEEN_OPERATORS',
    message: "You can't transfer to another operator",
    statusCode: 409,
  });

  static noTransfersBetweenMachines = new AppError({
    errorCode: 'NO_TRANSFERS_BETWEEN_MACHINES',
    message: "You can't transfer to another machine",
    statusCode: 409,
  });

  static thisIsNotLastCollection = new AppError({
    errorCode: 'YOU_CAN_ONLY_EDIT_LAST_COLLECTION',
    message: 'You can only edit last collection',
    statusCode: 409,
  });

  static machineInStock = new AppError({
    errorCode: 'MACHINE_IN_STOCK',
    message: 'This machine is still in stock.',
    statusCode: 409,
  });

  static productNotFound = new AppError({
    errorCode: 'PRODUCT_NOT_FOUND',
    message: "Could not find the 'product'.",
    statusCode: 404,
  });

  static collectionNotFound = new AppError({
    errorCode: 'COLLECTION_NOT_FOUND',
    message: "Could not find the 'collection'.",
    statusCode: 404,
  });

  static telemetryBoardNotFound = new AppError({
    errorCode: 'TELEMETRY_BOARD_NOT_FOUND',
    message: 'We could not find this telemetry board',
    statusCode: 404,
  });

  static counterTypeNotFound = new AppError({
    errorCode: 'COUNTER_TYPE_NOT_FOUND',
    message: "Could not find the 'counter type'.",
    statusCode: 404,
  });

  static productInStock = new AppError({
    errorCode: 'PRODUCT_IN_STOCK',
    message:
      'This product is still in stock. Remove all units before deleting the product',
    statusCode: 409,
  });

  static pointOfSaleNotFound = new AppError({
    errorCode: 'POINT_OF_SALE_NOT_FOUND',
    message: "Could not find the 'point of sale'.",
    statusCode: 404,
  });

  static groupNotFound = new AppError({
    errorCode: 'GROUP_NOT_FOUND',
    message: "Could not find the 'group'.",
    statusCode: 404,
  });

  static machineCategoryNotFound = new AppError({
    errorCode: 'MACHINE_CATEGORY_NOT_FOUND',
    message: "Could not find the 'machine category'.",
    statusCode: 404,
  });

  static machineNotFound = new AppError({
    errorCode: 'MACHINE_NOT_FOUND',
    message: "Could not find the 'machine'.",
    statusCode: 404,
  });

  static boxNotFound = new AppError({
    errorCode: 'BOX_NOT_FOUND',
    message: 'We could not find this box',
    statusCode: 404,
  });

  static counterNotFound = new AppError({
    errorCode: 'COUNTER_NOT_FOUND',
    message: 'We could not find this counter',
    statusCode: 404,
  });

  static routeNotFound = new AppError({
    errorCode: 'ROUTE_NOT_FOUND',
    message: "Could not find the 'route'.",
    statusCode: 404,
  });

  static userNotFound = new AppError({
    errorCode: 'USER_NOT_FOUND',
    message: 'Could not find this user',
    statusCode: 404,
  });

  static missingGroupId = new AppError({
    errorCode: 'MISSING_GROUP_ID',
    message: 'Owners need to inform a group id to make transfers',
    statusCode: 400,
  });

  static authorizationError = new AppError({
    errorCode: 'AUTHORIZATION_ERROR',
    message: 'You do not have permission to access this resource.',
    statusCode: 403,
  });

  private constructor(data: AppError) {
    this.errorCode = data.errorCode;
    this.message = data.message;
    this.statusCode = data.statusCode;
  }
}
