import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './authstrategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './authstrategies/jwt.strategy';
import { AddressModule } from 'src/location/address.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ]),
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: configService.get<string>("JWT_TOKEN_EXPIRES_IN") }                   
            }),
            inject: [ConfigService],
        }),
        AddressModule
    ],
    exports: [
        UserService,
        AuthenticationService,
        LocalStrategy,
        JwtStrategy
    ],
    providers: [
        UserService,
        AuthenticationService,
        LocalStrategy,
        JwtStrategy
    ],
    controllers: [
        UserController,
    ],
})
export class UserModule {}
