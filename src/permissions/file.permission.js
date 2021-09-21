import { PERMISSIONS } from "../config/permissions.js";

export default {
  upload: PERMISSIONS.CAN_UPLOAD_FILES,
  update: PERMISSIONS.CAN_UPDATE_FILES,
  delete: PERMISSIONS.CAN_DELETE_ALL_FILES,
};
