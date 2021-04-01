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

  static invalidToken = new AppError({
    errorCode: 'INVALID_TOKEN',
    message: 'Your auth token is invalid.',
    statusCode: 401,
  });

  static oldPasswordIsMissing = new AppError({
    errorCode: 'OLD_PASSWoRD_IS_MISSING',
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

  static productNotFound = new AppError({
    errorCode: 'PRODUCT_NOT_FOUND',
    message: "Could not find the 'product'.",
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

  static sellingPointNotFound = new AppError({
    errorCode: 'SELLING_POINT_NOT_FOUND',
    message: "Could not find the 'Selling Point'.",
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
