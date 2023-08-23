import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { createDatabase, dropDatabase } from 'typeorm-extension';
async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
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

  // await (async () => {
  //   await createDatabase({ ifNotExist: true });
  //
  //   await dropDatabase({ ifExist: true });
  //
  //   process.exit(0);
  // })();

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
