import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { PRODUCTION_STAGE } from 'src/common/constants/environment.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const stage = configService.get<string>('STAGE');

  if (stage === PRODUCTION_STAGE) {
    const allowedOrigins = configService
      .get<string>('CORS_ORIGINS')
      .split(',')
      .map((domain) => domain.trim());

    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  if (stage !== PRODUCTION_STAGE) {
    const config = new DocumentBuilder()
      .setTitle('App API documentation')
      .setDescription('API for User Sign-Up and Sign-In')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.use(helmet());
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => {
    console.log('Server started on port: ' + port);
  });
}
bootstrap();
