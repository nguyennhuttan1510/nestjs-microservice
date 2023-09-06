import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as moment from 'moment';
import { join } from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const dateTime = moment().format('DD/MM/YYYY hh:mm:ss');
    console.log('req', req);
    const record = `[${dateTime}] - [${req.hostname} ${req.method} ${
      req.baseUrl
    }] ${req.ip} - ${JSON.stringify(req.body)} \n`;
    fs.writeFile(
      join(__dirname, '..', '..', '..', 'log/request/log-request.log'),
      record,
      { flag: 'a+' },
      (err) => {
        if (err) {
          console.error(err);
        }
      },
    );
    next();
  }
}
