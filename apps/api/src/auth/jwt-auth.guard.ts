import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Apply with @UseGuards(JwtAuthGuard) to require a valid Bearer token.
 * Returns 401 when the token is missing or invalid.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
