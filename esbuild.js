import esbuild from "esbuild"
import dotenv from "dotenv"
import winston from "winston"
import nodemon from "nodemon"
import { build, createServer } from "vite"


const log = winston.createLogger({
    format: winston.format.prettyPrint({ colorize: true }),
    transports: [new winston.transports.Console()]
})

dotenv.config()
const isDev = process.env.ENV == "dev"
log.info("System Started!")
const start = async () => {
    try {


        if (isDev) {
            (await createServer()).listen(3333)
            log.info("frontend Server started http://localhost:3333")
        } else
            await build({ optimizeDeps: true, esbuild: true, build: { minify: true, outDir: "./dist/client/" } })


        const context = await esbuild.context({
            bundle: true,
            target: "esNext",
            entryPoints: ["./server/server.ts"],
            outdir: './dist',
            external: ["./node_modules/*"],
            platform: "node",
            format: "esm",
        })

        if (isDev)
            await context.watch()

        if (isDev)
            nodemon({ verbose: true, watch: ["./dist/server.js", "./.env"], ext: "js", }).on("restart", (e) => {
                log.info("System restarted!")
            }).on("crash", (e) => {
                log.error(e)
            }).on("log", (e) => {
                log.debug(e)
            })
        if (!isDev)
            process.exit()

    } catch (error) {
        log.info("Server crashed retrying in 5 seconds")
        setTimeout( ()=>{
            return start()
        },5000)
    }
}

await start()