import * as express from 'express';
import TypedRequestBody from '../../types/RequestType';

export const router = express.Router();

router.get('/', function(req: TypedRequestBody<null>, res: express.Response) {
    const isProduction = process.env.API_VERSION == "production" ? "prod" : "dev";
    res.send(`rentalAPI - ${isProduction}`)
});