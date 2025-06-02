/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req: Express.Request = ctx.switchToHttp().getRequest();
        const user = req.user as User;
        if (!user) {
            throw new InternalServerErrorException(`User not found (request)`);
        }
        if (!data) return user;
        
        return user[data];
    }
)