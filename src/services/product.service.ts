import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../models/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    brand?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ products: Product[]; total: number; pages: number }> {
    const query: any = {};
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const skip = (pageNumber - 1) * limitNumber;
    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limitNumber),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return this.productModel
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } },
        ],
      })
      .exec();
  }

  async addReview(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // Prevent duplicate review
    if (product.reviews.some(r => r.userId.toString() === userId.toString())) {
      throw new Error('You have already added a review for this product');
    }
    product.reviews.push({
      userId : userId as any,
      rating,
      comment,
      date: new Date(),
    });

    // Update rating and reviews count
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    return product.save();
  }

  async removeReview(productId: string, userId: string): Promise<Product> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const initialLength = product.reviews.length;
    product.reviews = product.reviews.filter(r => r.userId.toString() !== userId.toString());
    if (product.reviews.length === initialLength) {
      throw new NotFoundException('Review not found');
    }
    // Update rating and reviews count
    product.reviewsCount = product.reviews.length;
    product.rating = product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0;
    return product.save();
  }

  async getProductReviews(productId: string): Promise<any[]> {
    const product = await this.productModel
      .findById(productId)
      .populate({
        path: 'reviews.userId',
        select: 'name email',
        model: 'User'
      })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product.reviews;
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.stock += quantity;
    return product.save();
  }
} 