import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from '../dtos/response.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  async signup(
    @Body() signupDto: { name: string; email: string; password: string },
  ): Promise<ResponseDto<any>> {
    const result = await this.authService.signup(
      signupDto.name,
      signupDto.email,
      signupDto.password,
    );
    return ResponseDto.ok(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  async login(
    @Body() loginDto: { email: string; password: string },
  ): Promise<ResponseDto<any>> {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return ResponseDto.ok(result);
  }
} 