import { model } from "mongoose";
import { IActor, schema } from "../schemas/actor";

export const Actor = model<IActor>("actor", schema);
