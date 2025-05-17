import { IsString, Length } from "class-validator"

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    name!: string;

    @IsString()
    password!: string;
}
