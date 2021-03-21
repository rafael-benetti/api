const isInGroupUniverse = (groups: string[], universe: string[]): boolean => {
  return groups.some(group => !universe.includes(group));
};

export default isInGroupUniverse;
