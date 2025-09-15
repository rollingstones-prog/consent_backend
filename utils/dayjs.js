import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";       // 👈 extension important
import timezone from "dayjs/plugin/timezone.js"; // 👈 extension important

dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
