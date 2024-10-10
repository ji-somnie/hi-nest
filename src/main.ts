import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() { // bootstrap은 기본 함수 이름. 아무 이름이나 상관없음
  const app = await NestFactory.create(AppModule); // app 생성

  // validation pipe (express.js에서의 미들웨어와 윺사)
  app.useGlobalPipes
    (new ValidationPipe({// 이거 없으면 dto에서 validation test한거 안 돌아감
      whitelist: true, // 아무 데코레이터도 없는 어떠한 property의 object를 거름 > Validator에 도달하질 않음
      forbidNonWhitelisted: true, // request 자체를 막아버림
      transform: true, // 유저가 보낸 input을 우리가 원하는 실제 타입으로 변환해줌(in controller)
    })
  ); 

  await app.listen(3000);
}
bootstrap();
