import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import {
  RequestDocument,
  RequestEntity,
} from 'src/database/models/request.entity';

@Injectable()
export class RequestLog {
  constructor(
    @InjectModel(RequestEntity.name)
    private readonly requestModel: Model<RequestDocument>,
  ) {}

  async add(request: any): Promise<void> {
    try {
      await this.requestModel.create(request);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
