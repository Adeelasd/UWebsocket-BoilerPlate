import { form } from "../lib/json";
import { getHeaders, req } from "../lib/request";
import { signUpRule } from "../schema/userSchema";
import body from "busboy"

export const hello = req(async ({ msg, getQs, req, error, res }) => {
    msg("Hello World!")
})




export const SignUp = req(async ({ send, msg, getQs, req, error, res, getJson }) => {
    send(await getJson())
}, signUpRule)



export const uploadFile = req(async ({ send, msg, getQs, req, error, res, getJson }) => {
    // msg("Test")
    // console.log(Object.fromEntries(getHeaders(req)))
    // body({ headers: Object.fromEntries(getHeaders(req)) }).on("file", (name,stream,info) => {
    //     console.log(name)
    // })

    await form(res, req)

    // console.log("GG")

})
