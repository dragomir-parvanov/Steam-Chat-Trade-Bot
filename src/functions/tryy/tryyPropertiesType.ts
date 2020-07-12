/**
 * Tryy properties when using
 */
export type tryyPropertiesType<T> = () => T &{
    timeout: () => void;
}