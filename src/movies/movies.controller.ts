import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies') // cli로 만들었으면 기본 라우팅 주소는 'localhost:3000/movies'임
export class MoviesController {

    constructor(private readonly moviesService: MoviesService){} // MovieService의 모든 걸 쓸 수 있음

    @Get()
    getAll(): Movie[] { 
        // 아래 방식(not NestJS)으로 해도 똑같이 동작함. 근데 프레임워크 변경시에 문제가 생김.
        // getAll(@Req() req, @Res() res): Movie[]
        // res.json() 
        // NestJS 방식은 Express와 Fastify 전환시 에러 없이 한 방에 가능!
        return this.moviesService.getAll();
    }

    // @Get("search") // 슬래시 없이 그냥 써도 됨 -> localhost:3000/movies/search?2000
    // search(@Query('year') serachingYear : string){
    //     return `We are searching for a movie made after: ${serachingYear}`;
    // }

    @Get("/:id") // search보다 이게 먼저 오면 search가 아예 안됨 -> id: search가 반환됨
    getOne(@Param('id') movieId: number): Movie{ // 무언가 필요하면 요청해야 함. @Get 값 == @Param 값 명심하기!
        // console.log(typeof movieId);
        return this.moviesService.getOne(movieId);
    }

    @Post()
    create(@Body() movieData: CreateMovieDto){ // 누군가 Movie를 만들고 싶으면 movieData가 CreateMovieDto 타입으로 만들어짐
//        console.log(movieData);
        return this.moviesService.create(movieData);
    }

    @Delete("/:id")
    remove(@Param('id') movieId: number){
        return this.moviesService.deleteOne(movieId);
    }

    @Patch("/:id") 
    patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto){
        // return {
        //     updatedMovie: movieId,
        //     ...updateData, // ... 없이 쓰면 updateData 자체로 보이고, 그냥 쓰면 movieId-name-director 순으로 보임
        // };
        return this.moviesService.update(movieId, updateData);
    }
}
