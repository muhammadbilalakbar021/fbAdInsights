import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, instanceToPlain } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export type AccountDocument = AccountEntity &
  Document & {
    _id?: any;
  };

@Schema({ timestamps: true })
export class AccountEntity {
  _id?: any;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Prop({ default: 0, required: false })
  isBlacklisted: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false, required: false })
  isDeleted: boolean;

  @Prop({ default: Date.now, required: false })
  deletedAt: Date;

  @Prop({ default: true, required: false })
  isCreated: boolean;

  @Prop({ default: Date.now, required: false })
  createdAt: Date;

  @Prop({ default: false, required: false })
  isUpdated: boolean;

  @Prop({ default: Date.now, required: false })
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(AccountEntity);

AccountSchema.pre('save', async function (next: () => void) {
  try {
    // 'this' refers to the document being saved
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return err;
  }
});
