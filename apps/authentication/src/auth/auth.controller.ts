import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Account } from '@authentication/account/entities/account.entity';
import { Response } from '@app/interceptor';
import { Public } from '@authentication/auth/decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signin(
    @Body() account: Pick<Account, 'username' | 'password'>,
  ): Promise<Response<Partial<{ access_token: string }>>> {
    const result = await this.authService.signin(account);
    return {
      data: result,
      status: true,
      message: 'Login success',
    };
  }

  @Get('sign-out')
  async signout(
    @Headers('jwt') jwt: Account & { session_id: string },
  ): Promise<Response<any>> {
    await this.authService.signout(jwt.session_id);
    return {
      data: null,
      status: true,
      message: 'Sign out success',
    };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
