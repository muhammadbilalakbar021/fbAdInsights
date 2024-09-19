import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { ConfigInterface } from './interface/config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: ConfigInterface;
  constructor() {
    dotenv.config({ path: `env/.env.${process.env.NODE_ENV}` });
    const config: { [name: string]: string } = process.env;
    const parsedConfig = JSON.parse(JSON.stringify(config));
    this.envConfig = this.validateInput(parsedConfig);
  }

  private validateInput = (envConfig): ConfigInterface => {
    const envVarSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .required()
        .valid(
          'development',
          'production',
          'staging',
          'provision',
          'inspection',
        )
        .default('development'),
      PORT: Joi.number().required(),
      MONGO_CLUSTER_URI: Joi.string().required(),
      OPENAI_API_KEY: Joi.string().required(),
      STRPIE_S_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarSchema.validate(
      envConfig,
      {
        abortEarly: false,
        allowUnknown: true,
      },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    console.log('Joi Schema Verified in config.service.ts');
    return validatedEnvConfig;
  };

  get NODE_ENV(): string {
    return this.envConfig.NODE_ENV;
  }

  get PORT(): string {
    return this.envConfig.PORT;
  }

  get MONGO_CLUSTER_URI(): string {
    return this.envConfig.MONGO_CLUSTER_URI;
  }

  get OPENAI_API_KEY(): string {
    return this.envConfig.OPENAI_API_KEY;
  }

  get JWT_TOKEN(): string {
    return this.envConfig.JWT_TOKEN;
  }
  
  get JWT_EXPIRY_TIME(): string {
    return this.envConfig.JWT_EXPIRY_TIME;
  }

  get DOMAIN_NAME(): string {
    return this.envConfig.DOMAIN_NAME;
  }

  get STRPIE_S_KEY(): string {
    return this.envConfig.STRPIE_S_KEY;
  }
}
