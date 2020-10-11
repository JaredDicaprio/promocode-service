const path = require('path');
const { fork } = require('child_process');
import { Injectable, Logger } from '@nestjs/common';

import { Promocode } from './interfaces/promocode.interface';

@Injectable()
export class PromocodesService {
  private logger = new Logger('PromoLogger');

  async generatePromoCodes(
    evoucherId: number,
    qty: number,
  ): Promise<Promocode[]> {
    return new Promise((resolve, reject) => {
      const forkedProcess = fork(
        path.join(__dirname, '../utils/generateCodes.js'),
      );

      forkedProcess.send({ status: 'start', data: { qty, evoucherId } });

      forkedProcess.on('message', msg => {
        if (msg.status === 'done') {
          resolve(msg.data.codes);

          forkedProcess.kill();
        } else if (msg.status === 'error') {
          reject();
          forkedProcess.kill();
        }
      });

      forkedProcess.on('exit', code => {
        if (code && code !== 0) {
          this.logger.warn(
            `Forked Process ${forkedProcess.pid} unexpectedly exited with code ${code}`,
          );
        } else {
          this.logger.log(
            `Forked Process ${forkedProcess.pid} has quitted. ${code}`,
          );
        }
      });
    });
  }
}
