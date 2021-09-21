import { PERMISSIONS } from "../config/permissions.js";

export default {
  create: PERMISSIONS.CAN_CREATE_COURSES,
  list: PERMISSIONS.CAN_READ_ALL_COURSES,
  update: PERMISSIONS.CAN_UPDATE_ALL_COURSES,
  delete: PERMISSIONS.CAN_DELETE_ALL_COURSES,
};
