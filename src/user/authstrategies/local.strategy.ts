import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local";
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authservice: AuthenticationService) {
        super({
            usernameField: 'username'
        });
    }
    
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authservice.validateUserWithEmail(username, password);
        return user;
    }
}