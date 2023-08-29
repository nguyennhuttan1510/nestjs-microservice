import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { ValidationPipe } from '@nestjs/common';
import { HTTPExceptionFilter } from '@app/exception';
import { ResponseInterceptor } from '@app/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(MailModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HTTPExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(4001);
}
bootstrap();
