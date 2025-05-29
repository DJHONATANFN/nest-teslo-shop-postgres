import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService)=>({
        url: configService.get('postgres.postgresuri'),
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ProductsModule,
    CommonModule


    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: +process.env.DB_PORT!,
    //   database: process.env.DB_NAME,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   autoLoadEntities: true,
    //   synchronize: true
    // })
  ],
})
export class AppModule { }

