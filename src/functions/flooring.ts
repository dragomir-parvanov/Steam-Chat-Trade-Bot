export default function flooring(number: number) {
  return Math.floor((number + Number.EPSILON) * 100) / 100;
}
