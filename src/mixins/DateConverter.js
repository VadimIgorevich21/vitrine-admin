import moment from "moment-timezone";

export const DateConverter = {
  methods: {
    datePickerTimeToString(time) {
      return moment()
        .hours(time.hours)
        .minutes(time.minutes)
        .seconds(0)
        .format("HH:mm:ss");
    },
    timeStringToDatePicker(timeString) {
      if (timeString === null) return { hours: 0, minutes: 0 };
      let date = new Date("July 21, 1983 " + timeString);
      return { hours: date.getHours(), minutes: date.getMinutes() };
    },
    datePickerTimeIsNaN(time) {
      return time === null || isNaN(time.hours) || isNaN(time.minutes);
    },
  },
};
