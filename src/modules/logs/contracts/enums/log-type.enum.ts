enum LogType {
  CREATE_MACHINE = 'CREATE_MACHINE',
  EDIT_MACHINE = 'EDIT_MACHINE',
  DELETE_MACHINE = 'DELETE_MACHINE',
  TRANSFER_MACHINE_TO_POS = 'TRANSFER_MACHINE_TO_POS',
  TRANSFER_MACHINE_TO_GROUP = 'TRANSFER_MACHINE_TO_GROUP',
  CREATE_POS = 'CREATE_POS',
  EDIT_POS = 'EDIT_POS',
  ADD_POS_TO_ROUTE = 'ADD_POS_TO_ROUTE',
  CREATE_ROUTE = 'CREATE_ROUTE',
  EDIT_ROUTE = 'EDIT_ROUTE',
  CREATE_OPERATOR = 'CREATE_OPERATOR',
  EDIT_OPERATOR = 'EDIT_OPERATOR',
  CREATE_MANAGER = 'CREATE_MANAGER',
  EDIT_MANAGER = 'EDIT_MANAGER',
  CREATE_GROUP = 'CREATE_GROUP',
  EDIT_GROUP = 'EDIT_GROUP',
  CREATE_COLLECTION = 'CREATE_COLLECTION',
  EDIT_COLLECTION = 'EDIT_COLLECTION',
  CREATE_STOCK = 'CREATE_STOCK',
  TRANSFER_STOCK_USER_TO_USER = 'TRANSFER_STOCK_USER_TO_USER',
  TRANSFER_STOCK_USER_TO_MACHINE = 'TRANSFER_STOCK_USER_TO_MACHINE',
  TRANSFER_STOCK_USER_TO_GROUP = 'TRANSFER_STOCK_USER_TO_GROUP',
  TRANSFER_STOCK_GROUP_TO_USER = 'TRANSFER_STOCK_GROUP_TO_USER',
  TRANSFER_STOCK_GROUP_TO_GROUP = 'TRANSFER_STOCK_GROUP_TO_GROUP',
  REMOVE_STOCK_FROM_MACHINE = 'REMOVE_STOCK_FROM_MACHINE',
  REMOVE_STOCK_FROM_GROUP = 'REMOVE_STOCK_FROM_GROUP',
  REMOTE_CREDIT = 'REMOTE_CREDIT',
  ADD_TO_STOCK = 'ADD_TO_STOCK',
}

export default LogType;