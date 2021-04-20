import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SignupModule } from './signup/signup.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://prabhat:@1234P@nestapi.ufbol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    TasksModule,
    SignupModule,
    LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


// @1234P
// prabhat
// mongodb+srv://prabhat:<password>@nestapi.ufbol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority