import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { ValidationPipe } from '@nestjs/common';
import { HTTPExceptionFilter } from '@app/exception';
import { ResponseInterceptor } from '@app/interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import process from 'process';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AuthenticationModule,
  );
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     host: '127.0.0.1',
  //     port: 8888,
  //   },
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HTTPExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setBaseViewsDir(
    join(__dirname, '..', '..', '..') + '/apps/authentication/src/views/',
  );
  app.setViewEngine('hbs');

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
