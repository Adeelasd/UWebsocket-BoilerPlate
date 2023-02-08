import "./config/config"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGO_DB as string);







export const connection = await client.connect().then(e => {
    console.log("connected to mongoDB!")
    return e
})


export const db = connection.db()