export type Mapper<T, E> = (p: T extends Array<T> ? T[] : T) => E;
