export type TimeValues = "seconds" | "hours" | "minutes" | "hours" | "weeks" | "days";
/**
 * Getting time in milliseconds
 * @param amount
 * @param type
 */
export default function getTime(amount: number, type: TimeValues): number {
  switch (type) {
    case "seconds":
      return amount * 1000;
    case "minutes":
      return amount * 1000 * 60;
    case "hours":
      return amount * 1000 * 60 * 60;
    case "days":
      return amount * 1000 * 60 * 60 * 24;
    case "weeks":
      return amount * 1000 * 60 * 60 * 24 * 7;
  }
}
