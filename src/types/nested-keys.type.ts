export type NestedKeys<T> = {
  [K in Extract<keyof T, string>]: 
    T[K] extends object
      ? K | `${K}.${NestedKeys<T[K]>}`
      : K
}[Extract<keyof T, string>];
