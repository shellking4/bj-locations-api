import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ACCESSIBLE } from "../../commons/decorators/accessible.decorator";


@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext) {
    const isAccessible = this.reflector.get<boolean>(
      ACCESSIBLE,
      context.getHandler()
    );
    return isAccessible;
  }
}