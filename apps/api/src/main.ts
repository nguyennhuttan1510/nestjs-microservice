import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/interceptor';
import { HTTPExceptionFilter } from '@app/exception';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HTTPExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(8384);
}
bootstrap();
