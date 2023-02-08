import { HttpRequest, HttpResponse } from "uWebSockets.js"
import { Code } from "../../global/statusCodes"
import { IReq } from "../../types/Global"
import { signUpRule } from "../schema/userSchema"
import { parseQs, readJsonAsync } from "./json"

type ISuccess = (data: any, msg?: string, statusCode?: Code) => any
type IMessage = (msg: string, statusCode?: Code) => any
type IError = (error: any, statusCode?: Code, data?: any) => any
type IQs<T> = (extended?: boolean) => T
type IJson<T> = () => Promise<T>


type IHandler<T> = (ctx: {
    send: ISuccess,
    msg: IMessage,
    error: IError,
    getQs: IQs<T>,
    getJson: IJson<T>
    res: HttpResponse,
    req: HttpRequest
}) => any

/**
 * 
 * @param msg 
 * @returns 
 * for only sending message response!
 */
const msgRes = (msg: string) => `
{
    "data":{},
    "msg":"${msg}"
}
`

export const req = <T = any>(fn: IHandler<T>, validator?: (data: T) => boolean) => {

    return (async (res, req) => {
        res.onAborted(() => headerSent())

        const headerSent = () => res.headerSent = true
        const sendable = () => !res.headerSent

        const error: IError = (error, statusCode = Code.unprocessable, data = {}) => {
            try {
                if (sendable()) {
                    res.writeStatus(statusCode).end(msgRes(error.message ?? error))
                    headerSent()
                }

            } catch (error) {
                res.writeStatus(statusCode).end("Internal Server Error")
            }

        }

        try {



            const send: ISuccess = (data, msg = "Success!", statusCode = Code.success) => {
                if (sendable()) {
                    res.cork(() => {
                        res.writeStatus(statusCode).end(
                            writeRes({
                                data, msg
                            })
                        )
                    })
                    headerSent()
                }

            }
            const msg: IMessage = (msg = "Success!", statusCode = Code.success) => {
                if (sendable()) {
                    res.cork(() => {
                        res.writeStatus(statusCode).end(msgRes(msg))
                    })
                    headerSent()
                }

            }

            const getJson = async <T>() => readJsonAsync(res) as T

            const getQs = <T>(extended?: boolean) => {
                return parseQs(req, extended) as T
            }

            const data = await fn({ send, error, msg, req, res, getQs, getJson })
            data ? send(data) : msg("Not Found!", Code.notFound)

        } catch (er) {
            error(er, Code.serverError)
        }



    }) as IReq
}



const writeRes = (data: any) => {
    try {
        return JSON.stringify(data)
    } catch (error) {
        throw new Error("Invalid Json / String !")
    }
}

const getHeaders = (req: HttpRequest) => {
    const ctx = new Map()
    req.forEach((key, val) => {
        ctx.set(key, val)
    })
    return ctx
}
