import { NestFactory } from '@nestjs/core';
import { ContractModule } from './contract.module';
import { ValidationPipe } from '@nestjs/common';
import { HTTPExceptionFilter } from '@app/exception';
import { ResponseInterceptor } from '@app/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ContractModule);
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

  await app.startAllMicroservices();
  await app.listen(4002);
}
bootstrap();
