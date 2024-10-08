import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
    private movies: Movie[] = []; // movies는 Movie 객체의 array

    getAll(): Movie[]{
        return this.movies;
    }

    getOne(id: string): Movie {
        const movie = this.movies.find(movie => movie.id === parseInt(id)); // controller에는 string 타입이고, entity에는 number 타입으로 정의했기 때문에 변환해주기
        // parseInt 대신 'movie.id === +id' 라고 써도 똑같음

        if(!movie) {
            throw new NotFoundException(`Movie with Id ${id} not found.`);
        }

        return movie;
    }

    deleteOne(id: string){
        this.getOne(id);
        this.movies = this.movies.filter(movie => movie.id !== +id);
    }

    create(movieData) {
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData,
        })
    }

    update(id: string, updateData) { // id로 movie 가져와서 삭제하고, 새로운 데이터를 넣은 movie 생성
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.movies.push({...movie, ...updateData});
    }
}
