import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
    private movies: Movie[] = []; // movies는 Movie 객체의 array

    getAll(): Movie[]{
        return this.movies;
    }

    getOne(id: number): Movie {
        console.log(typeof(id));
        // transformer 쓰기 전 -> controller와 entity 타입 일치시켜주려면 직접 변환해줬어야 함
        // const movie = this.movies.find(movie => movie.id === parseInt(id)); // controller에는 string 타입이고, entity에는 number 타입으로 정의했기 때문에 변환해주기
        // parseInt 대신 'movie.id === +id' 라고 써도 똑같음

        // transformer 쓰면
        const movie = this.movies.find(movie => movie.id === id); 

        if(!movie) {
            throw new NotFoundException(`Movie with Id ${id} not found.`);
        }

        return movie;
    }

    deleteOne(id: number){
        this.getOne(id);
        this.movies = this.movies.filter(movie => movie.id !== id); // transformer 사용하면 형 변환 안 해줘도 됨
    }

    create(movieData: CreateMovieDto) {
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData,
        })
    }

    update(id: number, updateData:UpdateMovieDto) { // id로 movie 가져와서 삭제하고, 새로운 데이터를 넣은 movie 생성
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.movies.push({...movie, ...updateData});
    }
}
