import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@api/user/user.module';

@Module({
  imports: [
    UserModule,
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '172.18.64.1',
    //   port: 3306,
    //   username: 'root',
    //   password: 'o0i9u8y7',
    //   database: 'insurance',
    //   entities: [],
    //   // synchronize: true,
    // }),
  ],
  // imports: [
  //   TypeOrmModule.forRoot({
  //     type: 'mysql',
  //     host: 'localhost',
  //     port: 3306,
  //     username: 'root',
  //     password: 'o0i9u8y7',
  //     database: 'backoffice',
  //     entities: [],
  //     // synchronize: true,
  //   }),
  // ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
