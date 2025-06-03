import { IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 50, { message: "Name length must be between 3 and 50 charaters" })
    name!: string;

    @IsString()
    password!: string;
}
