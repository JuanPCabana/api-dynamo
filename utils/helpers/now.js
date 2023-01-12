import moment from "moment";

export default function now(date) {
  if (date) {
    return moment(date).format("YYYY-MM-DDTHH:mm:ss");
  }
  return moment().format("YYYY-MM-DDTHH:mm:ss");
}
