/**
 * Copied from stackoverflow- https://stackoverflow.com/questions/57016728/is-there-a-way-to-define-type-for-array-with-unique-items-in-typescript
 * Author wrote this:
 * First we come up something that acts like an invalid type,
 * which TypeScript doesn't have.
 * The idea is a type to which no value can be assigned (like never) but which produces a custom error message when the compiler encounters it.
 * The following isn't perfect, but it produces error messages that are possibly reasonable if you squint:
 * @author https://stackoverflow.com/users/2887218/jcalz
 */
type Invalid<T> = Error & { __errorMessage: T };

export default Invalid;
