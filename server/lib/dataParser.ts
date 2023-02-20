import uWeb, { HttpRequest } from "uWebSockets.js"
import nodeqs from "node:querystring"
import qs from "qs"
import path from "node:path"
import { __dirname } from "../config/config"
import { nanoid } from "nanoid"
import { IFormData } from "../../types/Upload"
import busyboy from "busboy"
import { getHeaders } from "./request"
import { appendFileSync } from "node:fs"
export const readJson = (res: uWeb.HttpResponse, cb: (json: any) => any, err: () => any) => {
    let buffer: Uint8Array | Buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab);
        if (isLast) {
            let json: any;
            if (buffer) {
                try {
                    //@ts-ignore
                    json = JSON.parse(Buffer.concat([buffer, chunk]));
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            } else {
                try {
                    //@ts-ignore
                    json = JSON.parse(chunk);
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            }
        } else {
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
        }
    });
}

export const readJsonAsync = <T = any>(res: uWeb.HttpResponse) => {
    return new Promise<T>((resolve, reject) => {
        let buffer: Uint8Array | Buffer;
        /* Register data cb */
        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);
            if (isLast) {
                let json: any;
                if (buffer) {
                    try {
                        //@ts-ignore
                        json = JSON.parse(Buffer.concat([buffer, chunk]));
                    } catch (e) {
                        /* res.close calls onAborted */
                        res.close();
                        return;
                    }
                    resolve(json)
                    // cb(json);
                } else {
                    try {
                        //@ts-ignore
                        json = JSON.parse(chunk);
                    } catch (e) {
                        /* res.close calls onAborted */
                        res.close();
                        return;
                    }
                    resolve(json)
                    // cb(json);
                }
            } else {
                if (buffer) {
                    buffer = Buffer.concat([buffer, chunk]);
                } else {
                    buffer = Buffer.concat([chunk]);
                }
            }
        });
    })


    /* Register error cb */
    // res.onAborted(err);
}

// const getKey = (e: string, name: string) => {
//     const keyExists = e.indexOf(name)
//     if (keyExists == -1) return ""
//     const extendsName = e.indexOf(';', keyExists)
//     let val = e.slice(e.indexOf('"', keyExists), extendsName == -1 ? undefined : extendsName)

//     try {
//         return JSON.parse(val)
//     } catch (error) {
//         return val
//     }
// }

export const form = (res: uWeb.HttpResponse, req: HttpRequest) => {

    const header = req.getHeader('content-type')
    const headers = Object.fromEntries(getHeaders(req))
    if (!header.includes('multipart/form-data; '))
        throw new Error('Invalid form type. must be multipart/form-data')

    return new Promise<IFormData>((resolve, reject) => {
        try {
            let data: IFormData = { data: {}, files: {} }
            let newFileName = ""
            let filePath = ""
            const boy = busyboy({ headers }).on("file", (name, stream, info) => {
                let extension = info.filename.split('.').reverse()[0]
                newFileName = nanoid() + '.' + extension
                filePath = path.join(__dirname, '/../uploads/', newFileName)
                stream.on("data", (e) => {
                    appendFileSync(filePath, e)
                })
                data.files[name] = {}
                data.files[name].originalName = info.filename
                data.files[name].path = filePath
                data.files[name].name = newFileName
                data.files[name].type = info.mimeType


            }).on("field", (name, value) => {
                data.data[name] = value
            })
            res.onData((ab, isLast) => {
                const chunk = Buffer.from(ab);
                boy.write(chunk)
                if (isLast) {
                    // fileStream?.close()
                    boy.end(() => {
                        resolve(data)
                    })
                }
            });

            boy.on("error", (error) => {
                reject(error)
            })
        } catch (error) {
            reject(error)
        }

    })


    /* Register error cb */
    // res.onAborted(err);
}

export const parseQs = (req: HttpRequest, extended?: boolean) => {
    const data = req.getQuery();
    return data && !extended ? nodeqs.parse(data) : qs.parse(data)
}