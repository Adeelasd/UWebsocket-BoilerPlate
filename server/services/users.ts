import { DB } from "../../global/dbModels";
import { IUser } from "../../types/User";
import { db } from "../db";
import type { PipelineStage } from "mongoose"
import { hash } from "argon2"
import { getDefaultTimeStamp } from "../lib/mongo";
export const user = db.collection(DB.Users)

// user.aggregate([{}] as PipelineStage[])
// user.
export const makeUser = async (data: IUser) => {
    data.password = await hash(data.password)
    return user.insertOne({ ...data, ...getDefaultTimeStamp() })
}

// export const getUser=