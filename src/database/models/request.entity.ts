import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RequestDocument = RequestEntity &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class RequestEntity {
  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ required: false, default: new Date() })
  timestamp: string;
}

export const RequestSchema = SchemaFactory.createForClass(RequestEntity);
