import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { hashString } from 'src/commons/helpers/utils.helper';
import { Logger } from '@nestjs/common';
import { GetUserDto } from '../dtos/response.dto';
import { CreateUserDto, UpdateUserDto } from '../dtos/request.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersrepository: Repository<User>
  ) { }


  private logger: Logger = new Logger()

  afterInit() {
    this.logger.log("Users WebSocketGateway Initialized")
  }

  async findAll(): Promise<GetUserDto[]> {
    let users = await this.usersrepository.find();
    const usersData = users.map(user => {
      const { id, email, createdAt, ...rest } = user;
      return { id, email, createdAt }
    });
    return usersData;
  } 

  async findOneById(userId: string): Promise<GetUserDto> {
    const user = await this.usersrepository.findOneOrFail({
      where: { id: userId }
    }).catch((error) => {
        throw new NotFoundException(`User with id ${id} is not found`);
      });
    const { id, email, createdAt, ...rest } = user;
    return { id, email, createdAt }
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersrepository.findOneOrFail({
      where: { id: id }
    }).catch((error) => {
        throw new NotFoundException(`User with id ${id} is not found`);
      });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersrepository.findOneOrFail({ 
      where: { email: email } })
      .catch((error) => {
        throw new NotFoundException(`User with email ${email} is not found`);
      });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    let password = createUserDto.password;
    createUserDto.password = await hashString(password);
    let user: User = new User();
    Object.keys(createUserDto).forEach(
      attribute => user[attribute] = createUserDto[attribute]
    );
    const newUser = this.usersrepository.create(user);
    let userData: any;
    try {
      user = await this.usersrepository.save(newUser);
      await user.reload();
      userData = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
      return userData;
    } catch (error) {
      throw new BadRequestException(
        `Account with this email already exists. Stack trace ${error}`,
      );
    }
  }

  async createSystemDefaultGuru() {
    let defaultGuru = (await this.findAll()).find(user => user.email === "guru@sys.com")
    if (defaultGuru === null) {
      let guru = this.usersrepository.create({
        email: "guru@sys.com",
        password: "gurupass",
      });
      await guru.save();
      await guru.reload();
    }
  }


  async updateUser(updateUserDto: UpdateUserDto, userId: string): Promise<GetUserDto> {
    let user = await this.findUserById(userId)
    let password = updateUserDto.password;
    updateUserDto.password = await hashString(password);
    Object.keys(updateUserDto).forEach(
      attribute => user[attribute] = updateUserDto[attribute] ? updateUserDto[attribute] : user[attribute]
    );
    let userData: any;
    try {
      user = await this.usersrepository.save(user);
      await user.reload();
      userData = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      }
      return userData;
    } catch (error) {
      throw new BadRequestException(
        `An error occured. Stack trace ${error}`,
      );
    }
  }

}
