import uWeb, { HttpRequest } from "uWebSockets.js"
import nodeqs from "node:querystring"
import qs from "qs"
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


export const readPartsAsync = <T = any>(res: uWeb.HttpResponse,req:HttpRequest) => {
    return new Promise<T>((resolve, reject) => {
        let buffer: Uint8Array | Buffer;
        /* Register data cb */
        res.onData((ab, isLast) => {
            console.log('Got chunk of data with length ' + ab.byteLength + ', isLast: ' + isLast);

            let chunk = Buffer.from(ab);
            if (isLast) {
                let json: any;
                if (buffer) {
                    try {
                        //@ts-ignore
                        json = uWeb.getParts(chunk, "form-data");
                        console.log("res  ",uWeb.getParts(ab,"multipart/form-data"))
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
                        json = uWeb.getParts(chunk, "multipart/form-data");
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



export const parseQs = (req: HttpRequest, extended?: boolean) => {
    const data = req.getQuery();
    return data && !extended ? nodeqs.parse(data) : qs.parse(data)
}