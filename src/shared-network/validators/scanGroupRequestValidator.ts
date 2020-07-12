import ScanGroupRequestModel from "../models/web/requests/ScanGroupRequestModel";
import Axios from "axios";
import isNullOrUndefined from "../../functions/isNullOrUndefined";

export default function scanGroupRequestValidator(
  request: Partial<ScanGroupRequestModel>,
  isNotValidCallback?: (message: string) => void
): request is ScanGroupRequestModel {
  const { isCSGOGroup, fromPage, toPage, url } = request;

  if (fromPage == null || toPage == null || !url) {
    throw new Error("some argument is null");
  }
  if (fromPage > toPage) {
    isNotValidCallback && isNotValidCallback("From page is bigger than to page");
    return false;
  }

  if (url.includes("/memberslistxml?xml=1&p={page}")) {
    isNotValidCallback && isNotValidCallback("Place it without the memberlist xml part");
    return false;
  }
  if (fromPage < 0) {
    isNotValidCallback && isNotValidCallback("From page cannot be less than zero");
  }
  if (toPage < 1) {
    isNotValidCallback && isNotValidCallback("to page cannot be zero or less than zero");
  }
  return true;
}
