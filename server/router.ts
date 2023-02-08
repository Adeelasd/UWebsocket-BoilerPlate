import { app as http } from "./app"
import { hello } from "./handler/helloWorldHandler"
import { readJsonAsync } from "./lib/json"
import { makeUser } from "./services/users"



http.post('/', hello)

http.get('/about', async (res, req) => {
    
    res.writeStatus('200').end("Hello About World! ")
})


// http.post('/', async (res, req) => {
//     const body = await readJsonAsync(res)
//     res.writeStatus("200").end(JSON.stringify(body))

// })


export { http }
