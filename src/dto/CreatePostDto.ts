/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class CreatePostDto {
  @ApiProperty({ description: "Title" })
  @IsString()
  readonly title: string

  @ApiProperty({ description: "Content" })
  @IsString()
  readonly content: string

  @ApiProperty({ description: "Location" })
  @IsString()
  @IsOptional()
  readonly location: string

  @ApiProperty({ description: "Media file" })
  @IsOptional()
  mediaUrl?: string[]
}
