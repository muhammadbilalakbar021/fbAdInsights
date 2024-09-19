import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
// import { ConfigService } from '../../../../config/config.service';
import * as fs from 'fs';

@Injectable()
export class S3Service {
  private s3Instance: S3;
  filePath = 'src/uploads/';
  constructor() {
    this.s3Instance = new S3({
      accessKeyId: '',
      secretAccessKey: 'b2ms8yv2X5/+4fzHqd',
      region: '',
    });
  }

  async uploadPublicFile(filename: string) {
    try {
      const dataBuffer = fs.createReadStream(this.filePath + filename);
      let result = await this.s3Instance
        .upload({
          Bucket: 'audiobucket-chatgp3',
          Body: dataBuffer,
          Key: `public_images/${uuid()}-${filename}`,
          ContentType: 'audio/mpeg',
        })
        .promise();
      return {
        key: result.Key,
        url: result.Location,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
