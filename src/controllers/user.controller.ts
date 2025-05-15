import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../core/jwt-auth-guard/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';

@ApiTags('Users')
@Controller('api/v1/users')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 201, description: 'Product added to cart successfully.' })
  async addToCart(
    @Request() req,
    @Body() data: { productId: string; quantity?: number },
  ) {
    const result = await this.userService.addToCart(
      req.user.userId,
      data.productId,
      data.quantity,
    );
    return ResponseDto.ok(result);
  }

  @Post('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add product to favorites' })
  @ApiResponse({ status: 201, description: 'Product added to favorites successfully.' })
  async addToFavorites(
    @Request() req,
    @Body() data: { productId: string },
  ) {
    const result = await this.userService.addToFavorites(
      req.user.userId,
      data.productId,
    );
    return ResponseDto.ok(result);
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({ status: 200, description: 'Returns user favorites.' })
  async getMyFavorites(@Request() req) {
    const result = await this.userService.getMyFavorites(req.user.userId);
    return ResponseDto.ok(result);
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Returns user cart.' })
  async getMyCart(@Request() req) {
    const result = await this.userService.getMyCart(req.user.userId);
    return ResponseDto.ok(result);
  }

  @Post('cart/remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart successfully.' })
  async removeFromCart(
    @Request() req,
    @Body() data: { productId: string },
  ) {
    const result = await this.userService.removeFromCart(
      req.user.userId,
      data.productId,
    );
    return ResponseDto.ok(result);
  }

  @Post('favorites/remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove product from favorites' })
  @ApiResponse({ status: 200, description: 'Product removed from favorites successfully.' })
  async removeFromFavorites(
    @Request() req,
    @Body() data: { productId: string },
  ) {
    const result = await this.userService.removeFromFavorites(
      req.user.userId,
      data.productId,
    );
    return ResponseDto.ok(result);
  }
} 