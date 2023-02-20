import { form } from "../lib/dataParser";
import { req } from "../lib/request";
import { signUpRule } from "../schema/userSchema";


export const hello = req(async ({ msg, getQs, req, error, res }) => {
    msg("Hello World!")
})



export const SignUp = req(async ({ send, msg, getQs, req, error, res, getJson }) => {
    send(await getJson())
}, signUpRule)



export const uploadFile = req(async ({ send, msg, getQs, req, error, res, getJson }) => {
    return await form(res, req)
})
