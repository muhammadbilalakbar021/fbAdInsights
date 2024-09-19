import { Injectable, NestMiddleware } from '@nestjs/common';
import * as Joi from 'joi';
import { ResponseService } from 'src/utils/response/response.service';

@Injectable()
export class AccountMiddleware implements NestMiddleware {
  constructor(private responseService: ResponseService) {}

  use(req: any, res: any, next: () => void) {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().optional(),
        isBlacklisted: Joi.boolean().optional(),
      });
      const { error } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error)
        return this.responseService.badRequestResponse(
          error.details[0].message,
          res,
        );
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
    next();
  }
}
