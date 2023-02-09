import { Static, Type ,} from "@sinclair/typebox";
import { TypeCompiler,TypeCheck } from "@sinclair/typebox/compiler";
import { compile } from "../lib/validator";
import "../validations/format"

const signUpSchema = Type.Object({
    name: Type.String(),
    password: Type.String({ minLength: 6 }),
    email: Type.String({ format: "email" }),
    remember:Type.String()
})

export const signUpRule = compile(signUpSchema);
export type ISignUpSchema =  Static<typeof signUpSchema>