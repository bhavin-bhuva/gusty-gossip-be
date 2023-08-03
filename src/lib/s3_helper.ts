import path from 'path';
import constants from '../common/constants';
import fs from 'fs';
import utility from './utility';
import os from 'os';
import { S3Client, GetObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../common/logger';
const tmpdir = os.tmpdir();

class s3Helper {
  public s3Client(): S3Client {
    const s3 = new S3Client({
      region: 'nyc3',
      endpoint: process.env.SPACES_ENDPOINT as string,
      credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
      },
    });
    return s3;
  }

  public async uploadToS3(file: any, pathToFile: string) {
    const extensionType = path.extname(pathToFile);
    const uploadParams: PutObjectCommandInput = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: pathToFile,
      Body: file,
      ContentType:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG
          ? constants.ENUMS.MIME_TYPE.IMAGE.PNG
          : constants.ENUMS.MIME_TYPE.IMAGE.SVG,
      ACL:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG
          ? constants.ENUMS.ACL_TYPE.PUBLIC
          : constants.ENUMS.ACL_TYPE.PRIVATE,
    };
    const s3 = this.s3Client();
    const upload: Upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    // start upload
    const metaData = await upload.done();
    return metaData['Location'];
  }

  public async downloadS3Media(url: string, folder: string): Promise<any> {
    const filename = path.basename(url);
    const localPath = path.join(tmpdir, filename);
    const s3 = this.s3Client();
    let keyName = filename;

    if (!utility.isEmpty(folder)) {
      keyName = `${folder}/${filename}`;
    }

    var bucketParams = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: keyName,
    };

    let writeStream = fs.createWriteStream(localPath);
    var fileStream = await s3.send(new GetObjectCommand(bucketParams));
    logger.info(`~ file: s3_helper.ts:60 ~ s3Helper ~ downloadS3Media ~ ${localPath}`);
    fileStream.Body.pipe(writeStream);
    return localPath;
  }
  public async getS3File(url: string, folder: string): Promise<any> {
    try {
      logger.info('~ file: s3_helper.ts:69 ~ s3Helper ~ getS3File ~ getS3File');
      const filename = path.basename(url);
      const s3 = this.s3Client();
      let keyName = filename;

      if (!utility.isEmpty(folder)) {
        keyName = `${folder}/${filename}`;
      }

      var bucketParams = {
        Bucket: constants.AWS_BUCKET_NAME,
        Key: keyName,
      };
      const getObject = await s3.send(new GetObjectCommand(bucketParams));
      return {
        filename: path.basename(getObject.Body.req.path, '.svg?x-id=GetObject'),
        buffer: getObject.Body._readableState.buffer.head.data,
      };
    } catch (err) {
      logger.error(JSON.stringify(err));
      return err;
    }
  }

  public async downlaodPrivateFile(url: string, folder: string): Promise<any> {
    const filename = path.basename(url);
    logger.info(`~ file: s3_helper.ts:97 ~ s3Helper ~ downlaodPrivateFile ~ filename - ${filename}`);
    const localPath = path.join(tmpdir, filename);
    logger.info(`~ file: s3_helper.ts:99 ~ s3Helper ~ downlaodPrivateFile ~ localPath - ${localPath}`);
    const s3 = this.s3Client();
    let keyName = filename;

    if (!utility.isEmpty(folder)) {
      keyName = `${folder}/${filename}`;
    }

    var bucketParams = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: keyName,
      ResponseContentType: constants.ENUMS.MIME_TYPE.IMAGE.SVG,
      ACL: 'public-read',
    };
    const command = new GetObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    logger.info(`~ file: s3_helper.ts:113 ~ s3Helper ~ downlaodPrivateFile ~ signedUrl - ${signedUrl}`);
    const state = await utility.mediaDownload(signedUrl, localPath);
    logger.info(`~ file: s3_helper.ts:115 ~ s3Helper ~ downlaodPrivateFile ~ state - ${state}`);
    if (state === true) {
      logger.info(`~ file: s3_helper.ts:117 ~ s3Helper ~ downlaodPrivateFile ~ returned ~ localPath - ${localPath}`);
      return localPath;
    }
  }
}

export default new s3Helper();
