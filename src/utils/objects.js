//like jquery.extend, but is a deep extend version
export function extend() {
  if (arguments.length === 0) {
    return {};
  } else if (arguments.length === 1) {
    return arguments[0];
  } else {
    var o = arguments[0];
    var _arguments = arguments;
    var index = 1;
    var vm = this;
    while (index < arguments.length) {
      $.each(arguments[index], function (key, value) {
        if (value === undefined) {
          return;
        }
        if (key in o) {
          //key exist in the result object
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            //is a json object
            if (
              o[key] !== null &&
              o[key] !== undefined &&
              typeof o[key] === "object" &&
              !Array.isArray(o[key])
            ) {
              //the same key in result object is a json object
              o[key] = vm.extend(o[key], value);
            } else {
              //the same key in result object is not a json object,overrite it
              o[key] = value;
            }
          } else {
            //is not a json object
            //overrite it
            o[key] = value;
          }
        } else {
          //key does not exist in the result object
          o[key] = value;
        }
      });
      index += 1;
    }
    return o;
  }
}
//extract the property value from a json object and set to json object template
//if a property in json object template does not exist in json object, the property's value will be removed from the result
//if a property in json object template has a undefined value in json object, the property will be removed from the result
//if a property whose value is a non empty json object in json object template, recusive call extract method with property value in json object template and json object.
export function extract(jsonTemplate, obj) {
  var result = {};
  var vm = this;
  $.each(jsonTemplate, function (key, value) {
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      //is a json object
      if (obj[key] === undefined) {
        return;
      } else if (obj[key] === null) {
        result[key] = null;
      } else if (Object.keys(value).length === 0) {
        //is a empty json object, use the value from obj
        result[key] = obj[key];
      } else {
        //contain some properties in json object template, only extract the predefined property's value
        result[key] = vm.extract(jsonTemplate[key], obj[key]);
      }
    } else if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
}
