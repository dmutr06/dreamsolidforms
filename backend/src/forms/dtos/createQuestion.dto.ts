import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateChoiceQuestion {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    options: string[];

    @IsNumber()
    answer: number;
}

export class CreateTextQuestion {
    @IsString()
    @IsNotEmpty()
    answer: string;
}

export class CreateNumberQuestion {
    @IsOptional()
    @IsNumber()
    min?: number;

    @IsOptional()
    @IsNumber()
    max?: number;

    @IsNumber()
    answer: number;
}

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    label: string;

    @IsOptional()
    @IsBoolean()
    required?: boolean;

    @IsString()
    @IsNotEmpty()
    type: string;

    @ValidateNested()
    @Type(obj => {
        switch (obj?.object.type) {
            case "choice":
                return CreateChoiceQuestion;
            case "text":
                return CreateTextQuestion;
            case "number":
                return CreateNumberQuestion;
            default:
                return Object;
        }
    })
    info: CreateChoiceQuestion | CreateTextQuestion | CreateNumberQuestion;
}
