import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { JwtAuthGuard } from '../core/jwt-auth-guard/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProductDto: Partial<Product>): Promise<ResponseDto<Product>> {
    const product = await this.productService.create(createProductDto);
    return ResponseDto.ok(product);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Returns list of products.' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<ResponseDto<{ products: Product[]; total: number; pages: number }>> {
    const result = await this.productService.findAll(
      page,
      limit,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    );
    return ResponseDto.ok(result);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Returns matching products.' })
  async search(
    @Query('q') searchTerm: string,
  ): Promise<ResponseDto<Product[]>> {
    const products = await this.productService.searchProducts(searchTerm);
    return ResponseDto.ok(products);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Returns a product.' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Product>> {
    const product = await this.productService.findOne(id);
    return ResponseDto.ok(product);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, description: 'Returns product reviews.' })
  async getProductReviews(@Param('id') id: string): Promise<ResponseDto<any[]>> {
    const reviews = await this.productService.getProductReviews(id);
    return ResponseDto.ok(reviews);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
  ): Promise<ResponseDto<Product>> {
    const product = await this.productService.update(id, updateProductDto);
    return ResponseDto.ok(product);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.productService.remove(id);
    return ResponseDto.ok('Product deleted successfully');
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a review to a product' })
  @ApiResponse({ status: 201, description: 'Review added successfully.' })
  async addReview(
    @Param('id') id: string,
    @Request() req,
    @Body() reviewData: { rating: number; comment: string },
  ): Promise<ResponseDto<Product>> {
    try {
      const product = await this.productService.addReview(
        id,
        req.user.userId,
        reviewData.rating,
        reviewData.comment,
      );
      return ResponseDto.ok(product);
    } catch (err) {
      if (err.message && err.message.includes('already added a review')) {
        return ResponseDto.throwBadRequest(err.message, err);
      }
      throw err;
    }
  }

  @Delete(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove my review from a product' })
  @ApiResponse({ status: 200, description: 'Review removed successfully.' })
  async removeReview(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ResponseDto<Product>> {
    const product = await this.productService.removeReview(id, req.user.userId);
    return ResponseDto.ok(product);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully.' })
  async updateStock(
    @Param('id') id: string,
    @Body() data: { quantity: number },
  ): Promise<ResponseDto<Product>> {
    const product = await this.productService.updateStock(id, data.quantity);
    return ResponseDto.ok(product);
  }
} 