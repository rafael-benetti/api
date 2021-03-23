const isInGroupUniverse = (groups: string[], universe: string[]): boolean => {
  return groups.every(group => universe.includes(group));
};

export default isInGroupUniverse;
