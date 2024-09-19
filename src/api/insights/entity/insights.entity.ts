import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, instanceToPlain } from 'class-transformer';

export type InsightsDocument = InsightsEntity &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class InsightsEntity {
  _id?: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  userId: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: Date })
  date: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  description: string;

  // HELPERS

  @Prop({ default: Date.now, required: false })
  lastPayed: Date;

  @Prop({ default: Date.now, required: false })
  createdAt: Date;

  @Prop({ default: false, required: false })
  isDeleted: boolean;

  @Prop({ default: Date.now, required: false })
  deletedAt: Date;

  @Prop({ default: false, required: false })
  isUpdated: boolean;

  @Prop({ default: Date.now, required: false })
  updatedAt: Date;
}

export const Insightsschema = SchemaFactory.createForClass(InsightsEntity);
