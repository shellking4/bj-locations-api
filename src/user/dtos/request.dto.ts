import { IsEmail, IsOptional, IsString } from "class-validator";

export class AuthenticateUserDto {
    username: string;
    password: string;
}

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    password?: string;
}

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password?: string;
}



