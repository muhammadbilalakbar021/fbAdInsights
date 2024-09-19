import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { print } from '../utils/log';
import { RequestEntity, RequestSchema } from '../models/request.entity';
import {
  InsightsEntity,
  Insightsschema,
} from '../../api/insights/entity/insights.entity';

import { JwtEntity, JwtSchema } from 'src/api/auth/entity/jwt.entity';
import {
  AccountEntity,
  AccountSchema,
} from 'src/api/account/entity/account.entity';

const logger = new Logger();
let MongoDataBaseProvider;
try {
  MongoDataBaseProvider = [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.MONGO_CLUSTER_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: RequestEntity.name, schema: RequestSchema },
      { name: InsightsEntity.name, schema: Insightsschema },
      { name: JwtEntity.name, schema: JwtSchema },
      { name: AccountEntity.name, schema: AccountSchema },
    ]),
  ];
  logger.log('MongoDatabase Connected');
} catch (error) {
  logger.log('Unable to Connect to Mongo');
}
export default MongoDataBaseProvider;
