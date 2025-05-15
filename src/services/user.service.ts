import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { Product } from '../models/product.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId as any, quantity });
    }

    return user.save();
  }

  async addToFavorites(userId: string, productId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.favorites.includes(productId as any)) {
      user.favorites.push(productId as any);
    }

    return user.save();
  }

  async getMyFavorites(userId: string): Promise<Product[]> {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'favorites',
        model: 'Product'
      })
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.favorites;
  }

  async getMyCart(userId: string): Promise<Array<{ product: Product; quantity: number }>> {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'cart.product',
        model: 'Product'
      })
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    return user.save();
  }

  async removeFromFavorites(userId: string, productId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    return user.save();
  }
} 