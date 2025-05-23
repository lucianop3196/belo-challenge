import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';

export function createSwaggerConfig() {
  const config = new DocumentBuilder()
    .setTitle('Belo Endpoints')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    ).addSecurity('x-api-key', {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      })
    .build();

  return config;
}
