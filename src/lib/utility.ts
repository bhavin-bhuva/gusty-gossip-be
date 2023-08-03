import { Pagination } from '../types/common';
import { mkdir, readdir } from 'fs/promises';
import { http } from 'follow-redirects';
import { logger } from '../common/logger';
import fs from 'fs';
import crypto from 'crypto';
class Utility {
  public isEmpty(val: string | any): boolean {
    return val == null || val === null || val.length === 0 || Object.keys(val).length === 0;
  }

  public pagination(page: number, limit: number): Pagination {
    return { offset: (page - 1) * limit, limit: limit };
  }
  public hash(noOfBytes: number) {
    return crypto.randomBytes(noOfBytes).toString('hex');
  }
  public generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  public async mediaDownload(url: string, path: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      http.get(url.replace('https', 'http'), (response) => {
        const statusCode = response.statusCode;
        logger.info(`~ file: utility.ts:24 ~ Utility ~ http.get ~ statusCode - ${statusCode}`);

        if (statusCode === 302) {
          const resp = JSON.stringify(response);
          logger.error(
            `~ file: utility.ts:27 ~ Utility ~ http.get ~ response - ${resp}, url - ${url}, statusCode - ${statusCode}`
          );
          return reject('Redirect error!');
        }

        if (statusCode !== 200) {
          const resp = JSON.stringify(response.headers);
          logger.error(
            `~ file: utility.ts:35 ~ Utility ~ http.get ~ response-header - ${resp}, url - ${url}, statusCode - ${statusCode}, msg - ${response.statusMessage}`
          );
          return reject('Download error!');
        }

        const writeStream = fs.createWriteStream(path);
        logger.info('~ file: utility.ts:37 ~ Utility ~ http.get ~ writeStream');
        response.pipe(writeStream);

        writeStream.on('error', (error) => {
          logger.error(`~ file: utility.ts:41 ~ Utility ~ writeStream.on ~ error - ${JSON.stringify(error)}`);
          reject('Error writing to file!' + error);
        });
        writeStream.on('finish', () => {
          writeStream.close();
          logger.info('~ file: utility.ts:45 ~ Utility ~ writeStream.on ~ writeStream ~ finished');
          resolve(true);
        });
      });
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      logger.error(`~ file: utility.ts:51 ~ Utility ~ returnnewPromise<any> ~ error - ${JSON.stringify(error)}`);
    });
  }
  public async tmpDir(): Promise<string> {
    const path = `${__dirname}/../tmp`;
    try {
      await readdir(path);
    } catch (err) {
      await mkdir(path, { recursive: true });
    }
    return path as string;
  }
}

export default new Utility();
