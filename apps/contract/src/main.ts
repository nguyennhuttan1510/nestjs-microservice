import { NestFactory } from '@nestjs/core';
import { ContractModule } from './contract.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { createDatabase, dropDatabase } from 'typeorm-extension';

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
  //
  // await (async () => {
  //   await createDatabase({ ifNotExist: true });
  //
  //   await dropDatabase({ ifExist: true });
  //
  //   process.exit(0);
  // })();

  await app.startAllMicroservices();
  await app.listen(4002);
}
bootstrap();
