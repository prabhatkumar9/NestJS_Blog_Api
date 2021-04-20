import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { SignupModule } from './signup/signup.module';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true }
    ),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    // MongooseModule.forRoot(),
    TasksModule,
    SignupModule,
    LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


