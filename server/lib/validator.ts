import { Static, TSchema } from "@sinclair/typebox"
import { TypeCompiler } from "@sinclair/typebox/compiler"

export const compile = <T extends TSchema>(schema: T) => {
    return TypeCompiler.Compile(schema).Errors as (data: Static<T>) => any
}