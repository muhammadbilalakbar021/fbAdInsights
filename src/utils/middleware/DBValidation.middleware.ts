import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  mixin,
  Type,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function DBValidationMiddlewareCreator(
  validations: any,
): Type<NestMiddleware> {
  @Injectable()
  class ValidateDBMiddleware implements NestMiddleware {
    constructor() {}
    async use(req: Request & { user: any }, res: Response, next: NextFunction) {
      const {
        query,
        validation,
        exception,
        model,
        attachDataName,
        takeDataFromBody,
      } = validations;
      const dbFunction = validation.includes('undefined') ? 'findOne' : 'find';
      if (takeDataFromBody) {
        let keys = Object.keys(query);

        keys.forEach((key) => {
          query[key] = req.body[key].toLowerCase();
          console.log(req.body[key].toLowerCase());
        });
      }
      const data = await this[model + 'Service'][dbFunction]({
        ...query,
        isDeleted: false,
      });
      if (this.validationFunction(validation, data)) throw exception;
      console.log(data, query, 'error ');
      //attach user with request and proceed
      if (attachDataName != '') req[attachDataName] = data;
      next();
    }

    private validationFunction(type, data) {
      let check = 0;
      if (type == 'undefined' && data == undefined) check = 1;
      else if (type == '!undefined' && data != undefined) check = 1;
      else if (type == 'lengthZero' && data.length == 0) check = 1;
      else if (type == '!lengthZero' && data.length != 0) check = 1;
      return check;
    }
  }

  return mixin(ValidateDBMiddleware);
}
