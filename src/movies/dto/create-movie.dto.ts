import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMovieDto { // 사람들이 보내야하는 정보

    @IsString()
    readonly title: string;

    @IsNumber()
    readonly year: number;

    @IsOptional() 
    @IsString({each: true})
    readonly genres: string[];
}