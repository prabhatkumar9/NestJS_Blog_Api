import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reg, RegSchema } from './register.model';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';

@Module({
  controllers: [SignupController],
  imports: [MongooseModule.forFeature([{ name: Reg.name, schema: RegSchema }])],
  providers: [SignupService]
})
export class SignupModule { }
