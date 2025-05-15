import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.model';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  favorites: Product[];

  @Prop({
    type: [{
      product: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }],
    default: []
  })
  cart: Array<{ product: Product; quantity: number }>;
}

export const UserSchema = SchemaFactory.createForClass(User); 