import { req } from "../lib/request";
import { signUpRule } from "../schema/userSchema";

export const hello = req(async ({ msg, getQs, req, error, res }) => {
    msg("Hello")
}, signUpRule)




export const SignUp = req(async ({ msg, getQs, req, error, res,getJson }) => {

}, signUpRule)
