import { ObjectId } from "mongodb";


export const Id = (id: string | ObjectId) => {
    if (id instanceof ObjectId)
        return id
    return new ObjectId(id)
}

export const getDefaultTimeStamp = () => ({
    createdAt: new Date(),
    updatedAt: new Date()
})