import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

/** Public-safe view of a user (never exposes the password hash). */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Verifies credentials and returns the signed JWT plus a safe user view.
   * The controller is responsible for placing the token in an httpOnly cookie.
   * Throws 401 on unknown email or wrong password (no user enumeration).
   */
  async login({ email, password }: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user: this.toAuthUser(user.id, user.email, user.name) };
  }

  /** Loads the current user by id; used by GET /auth/me. */
  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.toAuthUser(user.id, user.email, user.name);
  }

  private toAuthUser(id: string, email: string, name: string): AuthUser {
    return { id, email, name };
  }
}
