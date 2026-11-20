import moment from "moment";

//verify the user input date string.
//event, the dom event trigger this verification
//inputPattern: the array of input patterns
//pattern: the pattern to normialize the user input
//if correct, format the date with pattern
//if failed, set focus to the date element
//return true if correct;otherwise return false
export function verifyDate(event, inputPattern, pattern) {
  var element = event.target;
  element.value = element.value.trim();
  if (element.value.length > 0) {
    var m = moment(element.value, inputPattern, true);
    if (!m.isValid()) {
      setTimeout(function () {
        element.focus();
      }, 10);
      return false;
    } else {
      element.value = m.format(pattern);
      $(element).trigger("change");
      return true;
    }
  } else {
    return true;
  }
}

//Return a list of moment object whose time is specified in timesInDay array
//timesInDay: specify the time part in format "HH:mm:ss" ,required
//size: the number of the datetimes , required
//stragegy: the way to get the first datetime, default is 2
//  1: The first datetime is consisted with current date and first time in timesInDay
//  2: The first datetime is consisted with current date and the nearest time before current time in timesInDay
//  3: The first datetime is consisted with current date and the nearest time after current time in timesInDay
//startDate: the start datetime of the forecast,if missing, current datetime will be used
export function getDatetimes(timesInDay, size, strategy, startDate) {
  startDate = startDate || moment().tz("Australia/Perth");
  var currentDate = startDate.format("YYYY-MM-DD");
  strategy = strategy || 2;

  var result;
  var timeIndex = -1;
  if (strategy === 2 || strategy === 3) {
    $.each(timesInDay, function (index, time) {
      if (
        strategy === 2 &&
        startDate < moment.tz(currentDate + " " + time, "Australia/Perth")
      ) {
        if (index === 0) {
          timeIndex = timesInDay.length - 1;
          startDate.date(startDate.date() - 1);
        } else {
          timeIndex = index - 1;
        }
        return false;
      } else if (
        strategy === 3 &&
        startDate < moment.tz(currentDate + " " + time, "Australia/Perth")
      ) {
        // Legacy code had "furstIndex" here.
        // Appears to be a typo; timeIndex is used throughout the method.
        timeIndex = index;
        return false;
      }
    });
    if (strategy === 3 && timeIndex === -1) {
      timeIndex = 0;
      startDate.date(startDate.date() + 1);
    }
  } else {
    timeIndex = 0;
  }
  result = [];
  while (result.length < size) {
    result.push(
      moment.tz(
        startDate.format("YYYY-MM-DD") + " " + timesInDay[timeIndex],
        "Australia/Perth",
      ),
    );
    timeIndex += 1;
    if (timeIndex >= timesInDay.length) {
      timeIndex = 0;
      startDate.date(startDate.date() + 1);
    }
  }
  return result;
}

var _precisionMap = {};

export function getDateFormatPrecision(format) {
  var precision = _precisionMap[format];
  if (!precision) {
    var d = moment("2018-02-02 01:01:01.001", "YYYY-MM-DD HH:mm:ss.SSS");
    var d2 = moment(d.format(format), format);
    var diff = d - d2;
    if (diff === 0) {
      precision = "milliseconds";
    } else if (diff === 1) {
      precision = "seconds";
    } else if (diff === 1001) {
      precision = "minutes";
    } else if (diff === 61001) {
      precision = "hours";
    } else if (diff === 3661001) {
      precision = "days";
    } else if (diff === 90061001) {
      precision = "months";
    } else if (diff === 2768461001) {
      precision = "years";
    } else {
      throw "Precision time interval (" + precision + ") Not Support";
    }
    _precisionMap[format] = precision;
  }
  return precision;
}

export function nextDate(d, format) {
  var precision = getDateFormatPrecision(format);
  return moment(d).add(1, precision);
}

//dateRange consists of 5 digits XXXXX or 6 digits XXXXXX
//The sixth digit(optional) is the precision type; 1 : minute; 2: hour; 3: day; 4:week; 5: month; 6: year,7:financial year, 8:seconds, 9 milliseconds
//The fifth digit is the range type; 1 : minute; 2: hour; 3: day; 4:week; 5: month; 6: year,7:financial year
//The fourth digit is the range mode: 0: current ; 1: last
//the first three digit is the range value
//For example last 24 hours; dateRange is 21024
//return an array [startDate(inclusive),endDate(inclusive)], if endDate is current time, set endDate to null
export function getDateRange(range, format) {
  var dateRange = parseInt(range);
  if (dateRange === -1) {
    //customized
    return null;
  } else if (isNaN(dateRange)) {
    throw "Invalid date range '" + range + "'.";
  } else if (dateRange >= 1000000 || dateRange < 10000) {
    throw "Range (" + range + ") Not Support";
  }

  format = format || "YYYY-MM-DD";
  var resultFormat;
  var precision;
  if (dateRange >= 100000) {
    //precision type is specified
    precision = Math.floor(dateRange / 100000);
    dateRange = dateRange % 100000;
    resultFormat = format || null;
    if (precision === 1) {
      precision = "minutes";
      format = "YYYY-MM-DD HH:mm";
    } else if (precision === 2) {
      precision = "hours";
      format = "YYYY-MM-DD HH";
    } else if (precision === 3) {
      precision = "days";
      format = "YYYY-MM-DD";
    } else if (precision === 5) {
      precision = "months";
      format = "YYYY-MM";
    } else if (precision === 6) {
      precision = "years";
      format = "YYYY";
    } else if (precision === 8) {
      precision = "seconds";
      format = "YYYY-MM-DD HH:mm:ss";
    } else if (precision === 9) {
      precision = "milliseconds";
      format = "YYYY-MM-DD HH:mm:ss.SSS";
    } else {
      throw "Precision type (" + precision + ") Not Support";
    }
    if (!resultFormat) {
      resultFormat = format;
    }
  } else {
    format = format || "YYYY-MM-DD";
    resultFormat = format;
    precision = this.getDateFormatPrecision(format);
  }
  var startDate;
  var endDate;
  if (dateRange > 21000 && dateRange <= 21999) {
    //Last XX hours
    endDate = moment(moment().format(format), format);
    if (precision === "hours") {
      startDate = moment(endDate).subtract(dateRange - 21000 - 1, "hours");
    } else if (["milliseconds", "seconds", "minutes"].indexOf(precision) >= 0) {
      startDate = moment(endDate).subtract(dateRange - 21000, "hours");
    } else {
      startDate = moment(endDate).subtract(dateRange - 21000, "hours");
    }
    endDate = null;
  } else if (dateRange === 30001) {
    //today
    startDate = moment().startOf("day");
    endDate = null;
  } else if (dateRange > 31000 && dateRange <= 31999) {
    //last XXX days
    endDate = moment(moment().format(format), format);
    if (precision === "days") {
      startDate = moment(endDate).subtract(dateRange - 31000 - 1, "days");
    } else if (
      ["milliseconds", "seconds", "minutes", "hours"].indexOf(precision) >= 0
    ) {
      startDate = moment(endDate).subtract(dateRange - 31000, "days");
    } else {
      startDate = moment(endDate).subtract(dateRange - 31000, "days");
    }
    endDate = null;
  } else if (dateRange === 40001) {
    //current week
    startDate = moment().startOf("week");
    endDate = null;
  } else if (dateRange > 41000 && dateRange <= 41999) {
    //last XXX weeks
    endDate = moment(moment().format(format), format);
    if (precision === "days") {
      startDate = moment(endDate).subtract((dateRange - 41000) * 7 - 1, "days");
    } else if (
      ["milliseconds", "seconds", "minutes", "hours"].indexOf(precision) >= 0
    ) {
      startDate = moment(endDate).subtract((dateRange - 41000) * 7, "days");
    } else {
      startDate = moment(endDate).subtract((dateRange - 41000) * 7, "days");
    }
    endDate = null;
  } else if (dateRange === 70001) {
    var now = moment();
    if (now.month() >= 6) {
      startDate = moment(`${now.year()}-07-01`);
    } else {
      startDate = moment(`${now.year() - 1}-07-01`);
    }
    endDate = moment(startDate).add(1, "year").subtract(1, "day").endOf("day");
  } else {
    throw "Date range (" + dateRange + ") Not Support";
  }
  return [
    startDate ? startDate.format(resultFormat) : null,
    endDate ? endDate.format(resultFormat) : null,
  ];
}
