export default interface IRepository<T> {
  list(): Promise<Array<T>>;
}
