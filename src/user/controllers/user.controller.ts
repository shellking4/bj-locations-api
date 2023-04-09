import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Accessible } from '../../commons/decorators/accessible.decorator';
import { AuthenticateUserDto, CreateUserDto, UpdateUserDto } from '../dtos/request.dto';

@Controller("users")
@ApiTags("USER & AUTH")
export class UserController {

  constructor(
    public readonly userservice: UserService,
    public readonly authenticationservice: AuthenticationService
  ) { }

  @Get("")
  @Accessible()
  async getUsers() {
    return this.userservice.findAll();
  }

  @Get(":id")
  async getUserById(@Param('id') id: string) {
    return this.userservice.findOneById(id)
  }

  @Post("auth/signup")
  @Accessible()
  async signup(@Body() body: CreateUserDto) {
    const user = await this.userservice.create(body);
    return user
  }

  @Post("auth/signin")
  @Accessible()
  @UseGuards(LocalAuthGuard)
  async signin(
    @Req() request: any,
    @Body() body: AuthenticateUserDto
  ) {
    return this.authenticationservice.login(request.user);
  }


  @Put("update/:id")
  @Accessible()
  async updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateUserDto
  ) {
    return this.userservice.updateUser(body, userId);
  }

}
