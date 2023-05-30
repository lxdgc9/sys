import { model } from "mongoose";
import { IUser, schema } from "../schema/user";

export const User = model<IUser>("user", schema);
