import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blog/blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserIsUser } from './guards/userIsUser.guard';
import { UserIsAuthorGuard } from './guards/userIsAuthor.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity,BlogEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' }
      })
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, UserIsUser, UserIsAuthorGuard],
  exports: [AuthService]
})
export class AuthModule { }
