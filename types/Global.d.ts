import { HttpRequest, HttpResponse } from "uWebSockets.js";


export type IReq = (res: HttpResponse, req:HttpRequest ) => any 