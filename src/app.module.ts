import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ormConfig } from './DATABASE/CONFIG/ORMconfig';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true }
    ),
    TypeOrmModule.forRoot(ormConfig()),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: process.env.LOCALDB,
    //   database:process.env.MONGODB_DATABASE,
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   ssl: true,
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true
    // }),
    UserModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


