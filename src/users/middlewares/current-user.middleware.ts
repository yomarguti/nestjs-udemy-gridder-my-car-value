import { Injectable, NestMiddleware } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
  namespace Express {
    interface Request {
      CurrentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: any, res: any, next: () => void) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}
