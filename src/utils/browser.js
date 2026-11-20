import env from "@/config/env";

export function checkPermission(url, method, callback) {
  url = "/";
  //return false
  method = method || "GET";
  var pos = url.indexOf("?");
  if (pos >= 0) {
    if (pos === url.length - 1) {
      url = url + "checkpermission=true";
    } else {
      url = url + "&checkpermission=true";
    }
  } else {
    url = url + "?checkpermission=true";
  }
  var parameters = null;
  if (arguments.length > 3) {
    parameters = [];
    for (var index = 3; index < arguments.length; index++) {
      parameters.push(arguments[index]);
    }
  }
  var ajaxSetting = {
    xhrFields: {
      withCredentials: false,
    },
    method: method,
    success: function () {
      if (parameters) {
        parameters.splice(0, 0, true);
        callback.apply(null, parameters);
      } else {
        callback(true);
      }
    },
    error: function (jqXHR) {
      if (parameters) {
        if (jqXHR.status === 401) {
          parameters.splice(0, 0, false);
        } else if (jqXHR.status >= 500) {
          parameters.splice(0, 0, false);
        } else {
          parameters.splice(0, 0, true);
        }
        callback.apply(null, parameters);
      } else {
        if (jqXHR.status === 401) {
          callback(false);
        } else if (jqXHR.status >= 500) {
          callback(false);
        } else {
          callback(true);
        }
      }
    },
  };
  if (["POST", "PATCH", "PUT"].indexOf(method) >= 0) {
    ajaxSetting["contentType"] = "application/json";
    ajaxSetting["data"] = JSON.stringify({});
  }
  $.ajax(url, ajaxSetting);
}
var defaultWinOptions = [
  ["scrollbars", "yes"],
  ["locationbar", "no"],
  ["menubar", "no"],
  ["statusbar", "yes"],
  ["toolbar", "no"],
  ["personalbar", "no"],
  ["centerscreen", "yes"],
  [
    "width",
    function () {
      return Math.floor(window.innerWidth * 0.95);
    },
  ],
  [
    "height",
    function () {
      return Math.floor(window.innerHeight * 0.95);
    },
  ],
];

export function editResource(event, options, url, target, reopen) {
  if (!url) {
    var targetElement =
      event.target.nodeName == "A" ? event.target : event.target.parentNode;
    url = targetElement.href;
    target = targetElement.target;
  }
  if (!target) {
    target = "_blank";
  }
  if (env.appType == "cordova") {
    window.open(url, "_system");
  } else {
    options = options || {};
    var winOptions = defaultWinOptions
      .map(function (option) {
        return (
          option[0] +
          "=" +
          (options[option[0]] ||
            (typeof option[1] === "function" ? option[1]() : option[1]))
        );
      })
      .join(",");
    if (reopen) {
      var win = window.open("", target, winOptions);
      try {
        if (win.location.href !== "about:blank") {
          //already opened before, close it first
          win.close();
        }
      } catch {
        //already opened before, close it first
        win.close();
      }
      window.open(url, target, winOptions);
    } else {
      win = window.open(url, target, winOptions);
      setTimeout(function () {
        win.focus();
      }, 500);
    }
  }
}

export function submitForm(formid, options, reopen) {
  var form = $("#" + formid);

  if (env.appType == "cordova") {
    form.submit();
  } else {
    var target = form.attr("target") || "_blank";
    options = options || {};
    var winOptions = defaultWinOptions
      .map(function (option) {
        return (
          option[0] +
          "=" +
          (options[option[0]] ||
            (typeof option[1] === "function" ? option[1]() : option[1]))
        );
      })
      .join(",");
    var win = window.open("", target, winOptions);
    if (reopen) {
      try {
        if (win.location.href !== "about:blank") {
          //already opened before, close it first
          win.close();
          win = null;
        }
      } catch {
        //already opened before, close it first
        win.close();
        win = null;
      }
      if (win === null) {
        win = window.open("", target, winOptions);
      }
    }
    form.submit();
    if (target === "_blank" || !reopen) {
      setTimeout(function () {
        win.focus();
      }, 500);
    }
  }
}

export function getWindowTarget(target) {
  return env.appType === "cordova" ? "_system" : target;
}

function toInt(str) {
  try {
    var result = parseInt(str);
    return Number.isNaN(result) ? 0 : result;
  } catch {
    return 0;
  }
}

export function getWidth(element) {
  return (
    element.width() +
    toInt(element.css("padding-left")) +
    toInt(element.css("padding-right")) +
    toInt(element.css("margin-left")) +
    toInt(element.css("margin-right")) +
    toInt(element.css("border-width"))
  );
}

export function getHeight(element) {
  return (
    element.height() +
    toInt(element.css("padding-top")) +
    toInt(element.css("padding-bottom")) +
    toInt(element.css("margin-top")) +
    toInt(element.css("margin-bottom")) +
    toInt(element.css("border-width"))
  );
}
