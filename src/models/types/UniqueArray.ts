import Invalid from "./Invalid";
import Narrowable from "./Narrowable";

export type AsUniqueArray<A extends ReadonlyArray<any>, B extends ReadonlyArray<any>> = {
  [I in keyof A]: unknown extends {
    [J in keyof B]: J extends I ? never : B[J] extends A[I] ? unknown : never;
  }[number]
    ? Invalid<[A[I], "is repeated"]>
    : A[I];
};
export default function asUniqueArray<N extends Narrowable, A extends [] | (ReadonlyArray<N> & AsUniqueArray<A, A>)>(a: A) {
  return a;
}
