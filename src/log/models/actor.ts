import { model } from "mongoose";
import schema, { IActor } from "../schemas/actor";

export const Actor = model<IActor>("actor", schema);
