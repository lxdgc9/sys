import { model } from "mongoose";
import { IActor, schema } from "../schema/actor";

export const Actor = model<IActor>("actor", schema);
