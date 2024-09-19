import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { InsightsController } from './controller/insights.controller';
import { InsightsService } from './service/insights.service';
import { ResponseService } from 'src/utils/response/response.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InsightsController],
  providers: [InsightsService, ResponseService],
  exports: [InsightsService],
})
export class InsightsModule {}
