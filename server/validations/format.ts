import { TypeSystem } from "@sinclair/typebox/system"
import { CustomFormats } from "../../global/formats"


TypeSystem.CreateFormat(CustomFormats.email, (val) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)
})