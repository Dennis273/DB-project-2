import dotenv from 'dotenv';
import fs from "fs";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
}

export const SESSION_SECRET = process.env["SESSION_SECRET"];

export const MONGODB_URI = process.env["MONGODB_URI"];

export const PORT = process.env["PORT"];

export const UPLOAD_PATH = process.env["UPLOADS_PATH"]

if (!SESSION_SECRET) {
    console.log('No client secret. Set SESSION_SECRET env variable');
    process.exit(1);
}
if (!MONGODB_URI) {
    console.log('No mongodb connection string. Set MONGODB_URI env variable');
    process.exit(1);
}
if (!UPLOAD_PATH) {
    console.log('No upload path, Set UPLOAD_PATH env variable');
}
