import Permissions from '../contracts/models/permissions';
import managerPermissions from './manager-permissions';
import operatorPermissions from './operator-permissions';

interface ValidatePermissions {
  permissions: Permissions;
  for: 'OPERATOR' | 'MANAGER';
}

const validatePermissions = (data: ValidatePermissions): boolean => {
  if (data.for === 'OPERATOR') {
    return Object.keys(data.permissions).some(key =>
      managerPermissions.includes(key),
    );
  }

  return Object.keys(data.permissions).some(key =>
    operatorPermissions.includes(key),
  );
};

export default validatePermissions;
