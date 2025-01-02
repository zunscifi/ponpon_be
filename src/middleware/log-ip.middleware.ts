import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogModel } from 'src/models/log.schema';

@Injectable()
export class LogIpMiddleware implements NestMiddleware {
    private readonly sandboxWhitelist = [
        '113.160.92.202',
        '203.205.17.226',
        '103.220.84.4',
    ];

    private readonly productionWhitelist = [
        '113.52.45.78',
        '116.97.245.130',
        '42.118.107.252',
        '113.20.97.250',
        '203.171.19.146',
        '103.220.87.4',
        '103.220.86.4',
        '103.220.86.10',
        '103.220.87.10',
    ];

    use(req: Request, res: Response, next: NextFunction) {
        const clientIp = (req.headers['x-forwarded-for'] || req.ip).toString().split(',')[0].trim();

        const environment = process.env.NODE_ENV || 'sandbox';
        const whitelist = environment === 'production' ? this.productionWhitelist : this.sandboxWhitelist;

        const isWhitelisted = whitelist.includes(clientIp);

        const logData = {
            ip: clientIp,
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            isWhitelisted: isWhitelisted,
            timestamp: new Date().toISOString(),
        };

        const log = new LogModel(logData);
        log.save()
            .then(() => console.log('Log saved to database'))
            .catch((err) => console.error('Error saving log:', err.message));

        next();
    }
}
