export default interface OrmProvider {
  save(data: unknown[]): Promise<unknown[]>;
}
