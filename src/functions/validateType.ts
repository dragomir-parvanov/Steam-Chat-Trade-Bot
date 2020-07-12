/**
 * Validating the type of the requirement without losing the inteli sense
 */
const validateType = <Requirement>() => <T extends Requirement>(i: T) => i;

export default validateType;
