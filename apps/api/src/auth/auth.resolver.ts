import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const { token, user } = await this.authService.login(email, password);
    // Set httpOnly cookie
    context.res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return JSON.stringify({ token, user });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any) {
    context.res.clearCookie('auth-token');
    return true;
  }

  @Query(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: any) {
    const user = context.req.user;
    const fullUser = await this.authService.getMe(user.id);
    return JSON.stringify(fullUser);
  }
}
