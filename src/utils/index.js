export {
  FeatureTask,
  getFeatureTaskManager,
  FeatureTaskManager,
  SUCCEED,
  FAILED,
  WAITING,
  RUNNING,
  WARNING,
  IGNORED,
  MERGED,
  FAIL_CONFIRMED,
} from "./featureTasks";

export { verifyDate, getDatetimes, getDateRange, nextDate } from "./dates";

export { getDateFormatPrecision } from "./dates";

export { proxy } from "./proxy";

export {
  editResource,
  getWidth,
  getHeight,
  checkPermission,
  submitForm,
} from "./browser";

export {
  isKbLayer,
  getLayerId,
  getLayerUrl,
  getIndependentLayerId,
  getDetailLayerId,
} from "./layers";
