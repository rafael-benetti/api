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
  createPointsOfSale: boolean;
  editPointsOfSale: boolean;
  deletePointsOfSale: boolean;
  createRoutes: boolean;
  editRoutes: boolean;
  deleteRoutes: boolean;
  createManagers: boolean;
  createOperators: boolean;
  editManagers: boolean;
  editOperators: boolean;
  deleteManagers: boolean;
  deleteOperators: boolean;
  listManagers: boolean;
  listOperators: boolean;
  editCollections: boolean;
  deleteCollections: boolean;
}

export default Permissions;
