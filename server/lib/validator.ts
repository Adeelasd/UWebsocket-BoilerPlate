import { Static, TSchema } from "@sinclair/typebox"
import { TypeCheck, TypeCompiler, ValueError } from "@sinclair/typebox/compiler"

export const compile = <T extends TSchema>(schema: T) => {
    return TypeCompiler.Compile(schema) as TypeCheck<T>
}