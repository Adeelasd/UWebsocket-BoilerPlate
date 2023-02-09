import { config } from "dotenv"
import * as url from 'url';

/**
 * set process ENV's from .env
 */
config()

/**
 * 
 */
export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));