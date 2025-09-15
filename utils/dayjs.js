// utils/dayjs.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Default timezone set karna ho to (optional)
// dayjs.tz.setDefault("Asia/Karachi");

export default dayjs;
