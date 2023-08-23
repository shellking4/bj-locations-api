import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ACCESSIBLE } from '../../commons/decorators/accessible.decorator';

@Injectable()
export class AuthNGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector) {
        super();
    }
    
    canActivate(context: ExecutionContext) {
        const isAccessible = this.reflector.get<boolean>(
            ACCESSIBLE,
            context.getHandler()
        );
        return isAccessible ? isAccessible : super.canActivate(context);
    }
}
