import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // beforeEach -> test마다 애플리케이션을 생성 (브라우저에서 실행할 수 있는 애플리케이션(insomnia로 실행)이랑 구분됨)
    // beforeAll -> 모든 테스트하기 전에 한 번만 생성. movieId == 1인 하나로 계속 테스트
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 이거 넣어줘야 같은 애플리케이션이 실행됨 => 실제 서버(insomnia) == 테스팅 서버 
    app.useGlobalPipes
    (new ValidationPipe({// 이거 없으면 dto에서 validation test한거 안 돌아감
      whitelist: true, // 아무 데코레이터도 없는 어떠한 property의 object를 거름 > Validator에 도달하질 않음
      forbidNonWhitelisted: true, // request 자체를 막아버림
      transform: true, // 유저가 보낸 input을 우리가 원하는 실제 타입으로 변환해줌(in controller)
      })
    ); 

    await app.init();
  });

  // url에 대한 request testing => controller, service, pipe의 결과에 대해 모든 테스트를 한다는 뜻
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  // testing movies
  describe("/movies", () => {

    // 모든 영화를 가져옴
    it('GET', () => {
      return request(app.getHttpServer())
      .get('/movies')
      .expect(200)
      .expect([]);
    })

    // 영화 생성
    it('POST 201', () => {
      return request(app.getHttpServer())
      .post('/movies')
      .send({
        title: "Test",
        year: 2000,
        genres: ['test'],
      })
      .expect(201);
    })

    // 잘못된 정보로 영화 생성
    it('POST 400', () => {
      return request(app.getHttpServer())
      .post('/movies')
      .send({
        title: "Test",
        year: 2000,
        genres: ['test'],
        other: "thing"
      })
      .expect(400);
    })

    // 모든 영화 삭제 시도 -> 404 에러
    it('DELETE', () => {
      return request(app.getHttpServer())
      .delete('/movies')
      .expect(404)
    })
  })


  describe('/movies/:id', () => {

    // 아이디가 1인 영화 조회
    it("GET 200", () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200);
    });
    it("GET 404", () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404);
    });

    // 아이디가 1인 영화 업데이트
    it("PATCH 200", () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({title: "Updated Test"})
        .expect(200);
    });

    // 아이디가 1인 영화 삭제
    it("DELETE 200", () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    });
  })
  
});
