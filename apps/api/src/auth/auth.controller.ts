import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AUTH_COOKIE, authCookieOptions } from './auth.constants';
import { CurrentUser, RequestUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { parseDurationToMs } from './duration.util';

@Controller('auth')
export class AuthController {
  private readonly cookieMaxAgeMs: number;

  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    this.cookieMaxAgeMs = parseDurationToMs(config.get<string>('JWT_EXPIRES_IN', '1d'));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);
    res.cookie(AUTH_COOKIE, accessToken, authCookieOptions(this.cookieMaxAgeMs));
    // Token lives only in the httpOnly cookie; the body returns the user view.
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE, authCookieOptions(0));
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: RequestUser) {
    return this.authService.getProfile(user.id);
  }
}
