import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '@authentication/auth/entities/auth.entity';
import { AccountModule } from '@authentication/account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@authentication/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@authentication/auth/auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
      signOptions: {
        expiresIn: process.env.EXPIRRES_IN || '15m',
      },
    }),
    HttpModule.register({
      baseURL: process.env.ENDPOINT_MAILER,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    forwardRef(() => AccountModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
