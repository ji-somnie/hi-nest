import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies') // cli로 만들었으면 기본 라우팅 주소는 'localhost:3000/movies'임
export class MoviesController {

    constructor(private readonly moviesService: MoviesService){} // MovieService의 모든 걸 쓸 수 있음

    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll();
    }

    // @Get("search") // 슬래시 없이 그냥 써도 됨 -> localhost:3000/movies/search?2000
    // search(@Query('year') serachingYear : string){
    //     return `We are searching for a movie made after: ${serachingYear}`;
    // }

    @Get("/:id") // search보다 이게 먼저 오면 search가 아예 안됨 -> id: search가 반환됨
    getOne(@Param('id') movieId: string): Movie{ // 무언가 필요하면 요청해야 함. @Get 값 == @Param 값 명심하기!
        return this.moviesService.getOne(movieId);
    }

    @Post()
    create(@Body() movieData){
//        console.log(movieData);
        return this.moviesService.create(movieData);
    }

    @Delete("/:id")
    remove(@Param('id') movieId: string){
        return this.moviesService.deleteOne(movieId);
    }

    @Patch("/:id") 
    patch(@Param('id') movieId: string, @Body() updateData){
        // return {
        //     updatedMovie: movieId,
        //     ...updateData, // ... 없이 쓰면 updateData 자체로 보이고, 그냥 쓰면 movieId-name-director 순으로 보임
        // };
        return this.moviesService.update(movieId, updateData);
    }
}
