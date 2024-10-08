import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() { // bootstrap은 기본 함수 이름. 아무 이름이나 상관없음
  const app = await NestFactory.create(AppModule); // app 생성
  await app.listen(3000);
}
bootstrap();
