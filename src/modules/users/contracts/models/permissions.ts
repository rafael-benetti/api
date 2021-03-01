interface Permissions {
  createMachines: boolean;

  editMachines: boolean;

  deleteMachines: boolean;

  createProducts: boolean;

  editProducts: boolean;

  deleteProducts: boolean;

  transferProducts: boolean;

  createCategories: boolean;

  editCategories: boolean;

  deleteCategories: boolean;

  generateReports: boolean;

  addRemoteCredit: boolean;

  toggleMaintenanceMode: boolean;

  createGroups: boolean;

  editGroups: boolean;

  deleteGroups: boolean;

  listGroups: boolean;

  createPointsOfSale: boolean;

  editPointsOfSale: boolean;

  deletePointsOfSale: boolean;

  createRoutes: boolean;

  editRoutes: boolean;

  deleteRoutes: boolean;

  createUsers: boolean;

  editUsers: boolean;

  deleteUsers: boolean;

  listUsers: boolean;
}

export const operatorPermissionKeys = [
  'editMachines',
  'deleteMachines',
  'createProducts',
  'editProducts',
  'transferProducts',
  'createCategories',
  'editCategories',
  'generateReports',
  'addRemoteCredit',
  'toggleMaintenanceMode',
];

// TODO: Adicionar permissões de um manager
export const managerPermissionKeys = [
  'editMachines',
  'deleteMachines',
  'createProducts',
  'editProducts',
  'transferProducts',
  'createCategories',
  'editCategories',
  'generateReports',
  'addRemoteCredit',
  'toggleMaintenanceMode',
];

export default Permissions;
