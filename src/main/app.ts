import express from 'express'
import routes from './routes';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export class App {
    public server: express.Application

    constructor() {
        this.server = express()
        // this.server.use(express.json({ limit: '10mb' }))
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(limiter)

        for (let path in routes) {
            const router = express.Router()
            routes[path].register(router)
            this.server.use(path, router)
        }
    }
}
