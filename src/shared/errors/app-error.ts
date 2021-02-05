export default class AppError {
  readonly errorCode: string;

  readonly message: string;

  readonly statusCode: number;

  static unknownError = new AppError({
    errorCode: 'UNKNOWN_CODE',
    message: 'An unknown error has occurred',
    statusCode: 400,
  });

  static emailAlreadyUsed = new AppError({
    errorCode: 'EMAIL_ALREADY_USED',
    message: 'This email is unavailable.',
    statusCode: 409,
  });

  static jwtTokenIsMissing = new AppError({
    errorCode: 'JWT_TOKEN_IS_MISSING',
    message: 'Your request does have a JWT Token.',
    statusCode: 401,
  });

  static invalidJWTToken = new AppError({
    errorCode: 'INVALID_JWT_TOKEN',
    message: 'Your json web token is invalid.',
    statusCode: 401,
  });

  static nameAlreadyInUsed = new AppError({
    errorCode: 'NAME_ALREADY_USED',
    message: 'You already have a company with this name.',
    statusCode: 409,
  });

  static incorrectEmailOrPassword = new AppError({
    errorCode: 'INCORRECT_EMAIL_PASSWORD_COMBINATION',
    message: 'Incorrect email/password combination.',
    statusCode: 401,
  });

  static incorrectFilters = new AppError({
    errorCode: 'INCORRECT_FILTERS',
    message: 'Incorrect filters, check the filters',
    statusCode: 400,
  });

  static insufficientProducts = new AppError({
    errorCode: 'INSUFFICIENT_PRODUCTS',
    message: "You don't have enough products to transfer.",
    statusCode: 409,
  });

  static productNotFound = new AppError({
    errorCode: 'PRODUCT_NOT_FOUND',
    message: "Could not find the 'product'.",
    statusCode: 404,
  });

  static machineCategoryNotFound = new AppError({
    errorCode: 'MACHINE_CATEGORY_NOT_FOUND',
    message: "Could not find the 'machine category'.",
    statusCode: 404,
  });

  static userNotFound = new AppError({
    errorCode: 'USER_NOT_FOUND',
    message: "Could not find the 'user'.",
    statusCode: 404,
  });

  static authorizationError = new AppError({
    errorCode: 'AUTHORIZATION_ERROR',
    message: "You don't have permission for access this resource",
    statusCode: 403,
  });

  private constructor(data: AppError) {
    this.errorCode = data.errorCode;
    this.message = data.message;
    this.statusCode = data.statusCode;
  }
}
