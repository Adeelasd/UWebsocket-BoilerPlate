import { http } from "./router"

http.listen("0.0.0.0", 3000, () => {
    console.log("Server Strated!")
})

