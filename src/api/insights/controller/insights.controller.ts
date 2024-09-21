import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseService } from 'src/utils/response/response.service';
import { InsightsService } from '../service/insights.service';
import { Response } from 'express';
import { InsightsDto } from '../dto/insights.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('insights')
export class InsightsController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly responseService: ResponseService,
  ) {}

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('get_insights')
  async getInsights(
    @Req() req,
    @Body() get_insights_dto: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.insightsService.getInsights(
        req,
        get_insights_dto,
      );
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('scrape_fb_ad')
  async scrapeFbAd(
    @Req() req,
    @Body() get_insights_dto: any,
    @Res() res: Response,
  ) {
    try {
      const result = await this.insightsService.scrapeTextFromEUAdAudience(
        get_insights_dto.url,
      );
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Req() req,
    @Body() createPlanDto: InsightsDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.insightsService.create(req, createPlanDto);
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: InsightsDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.insightsService.findByIdAndUpdate(
        id,
        updatePlanDto,
      );
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error, res);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.insightsService.findByIdAndDelete(id);
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error, res);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.insightsService.findOne(id);
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error, res);
    }
  }

  @Public()
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.insightsService.findAll();
      if (result) {
        this.responseService.successResponse(true, result, res);
        return;
      } else {
        this.responseService.badRequestResponse('Not data found', res);
      }
    } catch (error) {
      this.responseService.serverFailureResponse(error, res);
    }
  }
}
