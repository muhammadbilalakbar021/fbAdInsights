import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { validate } from 'class-validator';
//import { ResponseService } from '../../../../utils/response/response.service';
import { ResponseService } from '../../../utils/response/response.service';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { Response, Request } from 'express';
import { AccountDto } from '../dto/account.dto';
import { AccountService } from '../service/account.service';
import { Account } from '../interface/user';
import { convertToObject } from 'typescript';
import MongooseClassSerializerInterceptor from 'src/utils/interceptor/mongooseClassSerializer.interceptor';
import { AccountEntity } from '../entity/account.entity';
import { HttpExceptionFilter } from 'src/utils/filter/exception.filter';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { AuthService } from 'src/api/auth/service/auth.service';

@UseFilters(new HttpExceptionFilter())
@Controller('account')
export class AccountController {
  constructor(
    protected accountService: AccountService,
    private readonly authService: AuthService,
    public readonly responseService: ResponseService,
  ) {}

  // Post Add Account
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async addAccount(@Body() account: AccountDto, @Res() res: Response) {
    try {
      const generatedId = await this.accountService.insertAccount(account);
      this.responseService.successResponse(true, generatedId, res);
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      this.responseService.successResponse(
        true,
        await this.accountService.login(body.email, body.password),
        res,
      );
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('all')
  async retrieveAllAccounts(@Res() res: Response) {
    try {
      return this.responseService.successResponse(
        true,
        await this.accountService.getAllAccounts(),
        res,
      );
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  async retrieveSingleAccount(
    @Param('id') accountId: any,
    @Res() res: Response,
    @Req() req: Request | any,
  ) {
    try {
      const User = await this.accountService.getSingleAccount(accountId);
      if (User) {
        return this.responseService.successResponse(true, User, res);
      } else {
        return this.responseService.successResponse(
          false,
          'No Data Found',
          res,
        );
      }
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  //Helper Routes
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('getAccountByEmailPassword')
  async getAccountByEmailPassword(
    @Body() account: LoginDto,
    @Res() res: Response,
  ) {
    try {
      this.responseService.successResponse(
        true,
        await this.accountService.getAccountByEmailPassword(
          account.email,
          account.password,
        ),
        res,
      );
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('verifyAccount')
  async verifyAccount(@Body() account: LoginDto, @Res() res: Response) {
    try {
      const responseToSend = await this.accountService.verifyAccount(
        account.username,
        account.email,
      );
      this.responseService.successResponse(true, responseToSend, res);
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('getJwt')
  async getJwt(@Body() account: any, @Res() res: Response) {
    try {
      const responseToSend = await this.authService.getJwt(
        account.userId,
        account.jwtType,
        account.isValid,
      );
      this.responseService.successResponse(true, responseToSend, res);
    } catch (error) {
      return this.responseService.serverFailureResponse(error.message, res);
    }
  }
}
