import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Accessible } from './commons/decorators/accessible.decorator';

@Controller()
export class AppController {
  constructor() { }

  @Get('')
  @ApiExcludeEndpoint()
  @Accessible()
  @Render('note.hbs')
  async home() {
    return { data: "" }
  }

}
