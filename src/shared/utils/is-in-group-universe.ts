interface Params {
  groups: string[];
  universe: string[];
  method: 'INTERSECTION' | 'UNION';
}

const isInGroupUniverse = (data: Params): boolean => {
  if (data.method === 'INTERSECTION') {
    return data.groups.some(group => data.universe.includes(group));
  }

  return data.groups.every(group => data.universe.includes(group));
};

export default isInGroupUniverse;
