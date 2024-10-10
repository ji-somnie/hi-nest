import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';
import { after } from 'node:test';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  // Unit Test
  describe("getAll", () => {
    // getAll() 실행할 때마다 Movie 배열을 리턴하는데, 배열이 비었는지 안 비었는지 테스트
    it ("should retrun an array", () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("getOne", () => {
    it ("should return a movie", () => {
      service.create({ // Movie를 만들지 않으면 가져올 수가 없으니까 테스트용으로 만듦
        title: "Test Movie",
        genres: ["test"],
        year: 2000,
      }); // 만들어지면 이 Test Movie의 아이디는 1이 됨
      const movie = service.getOne(1); // Test Movie id == 1 (위에서 방금 만듦)
      expect(movie).toBeDefined();
      // expect(movie.id).toEqual(1);
    });

    it ("should throw 404 error",()=> {
      try{
        service.getOne(999); // id == 999인 movice가 지금 없으니까 Service에 따르면에러 떠야함!
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        // expect(e.message).toEqual("Movie with Id 999 not found.")
      }
    });
  });
  
  describe("deleteOne",()=>{
    // movie를 만듦 -> 하나의 movie를 불러오고, id == 1인 movie 삭제 -> 삭제 전후 길이 같은지 확인
    it ("deletes a movie", () => {
      service.create({ // Movie를 만들지 않으면 가져올 수가 없으니까 테스트용으로 만듦
        title: "Test Movie",
        genres: ["test"],
        year: 2000,
      }); 
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      // 삭제 후 개수가 줄어들었는지 테스트
      expect(afterDelete).toBeLessThan(beforeDelete);
    })

    it ("should return a 404", () => {
      try{
        service.deleteOne(999); // 없는 아이디 -> 에러
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  });

  describe("create", () => {
    
    it ("should create a movie", () => {
      const beforeCreate = service.getAll().length;
      service.create({ 
        title: "Test Movie",
        genres: ["test"],
        year: 2000,
      }); 
      const afterCreate = service.getAll().length;

      // 생성 후 개수가 늘어났는지 테스트
      expect(afterCreate).toBeGreaterThan(beforeCreate);    
    })
  })


  describe("update", () => {
    it ("should update a movie", () => {
        service.create({  // 아예 beforeEach에 넣어도 됨
          title: "Test Movie",
          genres: ["test"],
          year: 2000,
        }); 
        service.update(1, {title: "Updated Test"});
        const movie = service.getOne(1);

        expect(movie.title).toEqual('Updated Test');
    })

    it ("should throw a NotFoundException", () => {
      try{
        service.update(999, {}); // 없는 아이디 -> 에러
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })

});
