import CounterCollection from './counter-collection';

export default interface BoxCollection {
  boxId: string;
  counterCollections: CounterCollection[];
}
