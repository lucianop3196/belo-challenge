import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isTest = configService.get('NODE_ENV') === 'test';

        if (isTest) {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST_TEST'),
            port: +configService.get('DB_PORT_TEST'),
            username: configService.get('DB_USERNAME_TEST'),
            password: configService.get('DB_PASSWORD_TEST'),
            database: configService.get('DB_NAME_TEST'),
            synchronize: true,
            entities: ['dist/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            retryDelay: 60000,
          };
        } else {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            synchronize: configService.get('DB_SYNC') === 'true',
            entities: ['dist/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            retryDelay: 60000,
            // options: {
            //   trustServerCertificate: true,
            // },
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule { }
