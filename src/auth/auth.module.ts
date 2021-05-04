import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/blog/blog.entity';
import { User, UserSchema } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthorGuard } from './guards/author.guard';
import { JwtAuthGuard } from './guards/guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserIsUser } from './guards/userIsUser.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' }
      })
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, UserIsUser, AuthorGuard],
  exports: [AuthService]
})
export class AuthModule { }
