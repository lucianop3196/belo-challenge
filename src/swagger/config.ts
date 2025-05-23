import { DocumentBuilder, type OpenAPIObject } from '@nestjs/swagger';

export function createSwaggerConfig(): Omit<OpenAPIObject, 'paths'> {
  const configSwagger = new DocumentBuilder()
    .setTitle('Belo endpoints')
    .setDescription('Api documentation')
    .setVersion('1.0');


    configSwagger.addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    );
    configSwagger.addSecurityRequirements('apiKey');
    configSwagger.addBearerAuth();
    configSwagger.addSecurityRequirements('bearer');

  return configSwagger.build();
}
