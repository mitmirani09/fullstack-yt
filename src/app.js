import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();

// cors middleware
app.use(cors({
    origin: "*",
    credentials: true,
}))

// middleware for json parsing
app.use(express.json({ limit: "16kb" }))

// middleware for parsing url encoded bodies
app.use(express.urlencoded({ limit: "16kb", extended: true }))

// middleware for serving static files
app.use(express.static("public"))

app.use(cookieParser())

export { app };