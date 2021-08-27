import httpStatus from "http-status";
import passport from "passport";
import User from "../models/user.model.js";
import APIError from "../utils/APIError.js";
import { promisify } from "util";

export const ADMIN = "admin";
export const LOGGED_USER = "_loggedUser";
