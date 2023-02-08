import { config } from "dotenv"
import * as url from 'url';

/**
 * set process ENV's from .env
 */
config()

/**
 * 
 */
export var __filename = url.fileURLToPath(import.meta.url);
export var __dirname = url.fileURLToPath(new URL('.', import.meta.url));