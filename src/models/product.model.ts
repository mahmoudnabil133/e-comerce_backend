import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop([String])
  additionalImages: string[];

  @Prop({ type: Object })
  specifications: {
    [key: string]: string;
  };

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop({
    type: [{
      userId: { type: Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      date: Date
    }],
    default: []
  })
  reviews: Array<{
    userId: User;
    rating: number;
    comment: string;
    date: Date;
  }>;

  @Prop()
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
