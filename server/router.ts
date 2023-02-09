import { app as http } from "./app"
import { hello, SignUp, uploadFile } from "./handler/helloWorldHandler"

http.get('/', hello)
http.post('/signup', SignUp)
http.post('/upload',uploadFile)


export { http }
