import { Type } from "class-transformer";
import {
    IsNumber,
    IsString,
    IsNotEmpty,
    ValidateNested,
} from "class-validator";

export class ChoiceAnswer {
    @IsNumber()
    value: number;
}

export class TextAnswer {
    @IsString()
    value: string;
}

export class NumberAnswer {
    @IsNumber()
    value: number;
}

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @ValidateNested()
    @Type((obj) => {
        switch (obj?.object.type) {
            case "choice":
                return ChoiceAnswer;
            case "text":
                return TextAnswer;
            case "number":
                return NumberAnswer;
            default:
                return Object;
        }
    })
    info: ChoiceAnswer | TextAnswer | NumberAnswer;
}

