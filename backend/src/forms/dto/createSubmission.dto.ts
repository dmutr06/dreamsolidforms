import {
    IsArray,
    ArrayNotEmpty,
    ValidateNested,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateAnswerDto } from "./createAnswer.dto";

export class CreateSubmissionDto {
    @IsString()
    formId: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerDto)
    answers: CreateAnswerDto[];
}
