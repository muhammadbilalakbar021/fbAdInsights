import { Global, Module } from '@nestjs/common';
import MongoDataBaseProvider from './provider/mongo.provider';

@Global()
@Module({
  imports: [...MongoDataBaseProvider],
  providers: [],
  exports: [...MongoDataBaseProvider],
})
export class DatabaseModule {}
