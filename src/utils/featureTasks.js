let FeatureTask = function (
  manager,
  scope,
  taskId,
  description,
  status,
  message,
) {
  this.manager = manager;
  this.scope = scope;
  this.taskId = taskId;
  this.description = description;
  this.icon = "";
  this.statusText = "";
  this.message = "";
  this.setStatus(status, message);
};

FeatureTask.FAILED = -1;
FeatureTask.FAIL_CONFIRMED = -2;
FeatureTask.WAITING = 1;
FeatureTask.RUNNING = 2;
FeatureTask.SUCCEED = 3;
FeatureTask.WARNING = 4;
FeatureTask.IGNORED = 5;
FeatureTask.MERGED = 6;

export function getFeatureTaskManager(changeCallback) {
  return new FeatureTaskManager(changeCallback);
}

FeatureTask.prototype._getIcon = function () {
  if (
    this.status === FeatureTask.FAILED ||
    this.status === FeatureTask.FAIL_CONFIRMED
  ) {
    return "fa-close";
  } else if (this.status === FeatureTask.WAITING) {
    return "fa-pause";
  } else if (this.status === FeatureTask.RUNNING) {
    return "fa-spinner";
  } else if (this.status === FeatureTask.SUCCEED) {
    return "fa-check";
  } else if (this.status === FeatureTask.WARNING) {
    return "fa-warning";
  } else if (this.status === FeatureTask.IGNORED) {
    return "fa-minus";
  } else if (this.status === FeatureTask.MERGED) {
    return "fa-link";
  } else {
    return "fa-spinner";
  }
};

FeatureTask.prototype._getStatusText = function () {
  if (this.status === FeatureTask.FAILED) {
    return "Failed";
  } else if (this.status === FeatureTask.WAITING) {
    return "Waiting";
  } else if (this.status === FeatureTask.RUNNING) {
    return "Running";
  } else if (this.status === FeatureTask.SUCCEED) {
    return "OK";
  } else if (this.status === FeatureTask.WARNING) {
    return "Warning";
  } else if (this.status === FeatureTask.IGNORED) {
    return "Ignored";
  } else if (this.status === FeatureTask.MERGED) {
    return "Merged";
  } else if (this.status === FeatureTask.FAIL_CONFIRMED) {
    return "Failed";
  } else {
    return "Running";
  }
};

FeatureTask.prototype.setStatus = function (status, message) {
  this.status = status;
  this.message = message || "";
  this.statusText = this._getStatusText();
  this.icon = this._getIcon();
  if (this.manager && this.manager.changeCallback)
    this.manager.changeCallback();
};

let FeatureTaskManager = function (changeCallback) {
  //call when feature's tasks changed.
  this.changeCallback = changeCallback;
};

//return true if init succeed; otherwise return false
FeatureTaskManager.prototype.initTasks = function (feat) {
  if (this.changeCallback) this.changeCallback();
  if (feat.tasks && feat.tasks.length > 0) {
    if (
      feat.tasks.find(function (t) {
        return (
          t.status === FeatureTask.WAITING || t.status === FeatureTask.RUNNING
        );
      })
    ) {
      alert("Feature still has running jobs.");
      return false;
    }
  }
  feat.tasks = [];
  return true;
};
FeatureTaskManager.prototype.clearTasks = function (feat) {
  var vm = this;
  var tasks = feat.tasks;
  if (!tasks || tasks.length === 0) {
    return;
  }
  var delay;
  if (this.allTasksSucceed(feat)) {
    delay = 1000;
  } else if (this.allTasksNotFailed(feat)) {
    delay = 10000;
  } else {
    delay = 60000;
  }
  setTimeout(function () {
    if (vm.changeCallback) vm.changeCallback();
    if (tasks) {
      tasks.length = 0;
    }
  }, delay);
};
FeatureTaskManager.prototype.getTasks = function (feat) {
  return feat.tasks || [];
};
FeatureTaskManager.prototype.getTask = function (feat, scope, taskId) {
  return feat.tasks
    ? feat.tasks.find(function (t) {
        return t.id === taskId && t.scope === scope;
      })
    : null;
};
//status should be "waiting","running","succeed","failed"
FeatureTaskManager.prototype.addTask = function (
  feat,
  scope,
  taskId,
  description,
  status,
) {
  var task = new FeatureTask(this, scope, taskId, description, status);

  feat.tasks.push(task);
  if (this.changeCallback) this.changeCallback();
  return task;
};

FeatureTaskManager.prototype.allTasksSucceed = function (feat, scope) {
  return feat.tasks.find(function (t) {
    return (
      (!scope || t.scope === scope) &&
      [FeatureTask.SUCCEED, FeatureTask.IGNORED, FeatureTask.MERGED].indexOf(
        t.status,
      ) === -1
    );
  })
    ? false
    : true;
};

FeatureTaskManager.prototype.allTasksNotFailed = function (feat, scope) {
  return feat.tasks.find(function (t) {
    return (
      (!scope || t.scope === scope) &&
      [
        FeatureTask.SUCCEED,
        FeatureTask.IGNORED,
        FeatureTask.MERGED,
        FeatureTask.WARNING,
      ].indexOf(t.status) === -1
    );
  })
    ? false
    : true;
};

FeatureTaskManager.prototype.allTasksFinished = function (feat, scope) {
  return feat.tasks.find(function (t) {
    return (
      (!scope || t.scope === scope) &&
      [FeatureTask.RUNNING, FeatureTask.WAITING].indexOf(t.status) >= 0
    );
  })
    ? false
    : true;
};

FeatureTaskManager.prototype.errorMessages = function (feat, scope) {
  return feat.tasks
    .filter(function (t) {
      return (
        (!scope || t.scope === scope) &&
        [FeatureTask.FAILED, FeatureTask.WARNING].indexOf(t.status) >= 0 &&
        t.message
      );
    })
    .map(function (t) {
      return t.message;
    });
};

export { FeatureTask, FeatureTaskManager };

export const FAILED = FeatureTask.FAILED;
export const FAIL_CONFIRMED = FeatureTask.FAIL_CONFIRMED;
export const WAITING = FeatureTask.WAITING;
export const RUNNING = FeatureTask.RUNNING;
export const SUCCEED = FeatureTask.SUCCEED;
export const WARNING = FeatureTask.WARNING;
export const IGNORED = FeatureTask.IGNORED;
export const MERGED = FeatureTask.MERGED;
