import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
  {
      transport: Transport.GRPC,
      options: {
        url:"0.0.0.0:50052",
        package: 'products',
        protoPath: join('node_modules/microservicios/proto/product.proto')
      }
  }
  );
  await app.listen();
}
bootstrap();
