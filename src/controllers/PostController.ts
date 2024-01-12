/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Body,
    HttpCode,
    UseGuards,
    Inject,
    Get,
    SetMetadata,
    Req,
    Param,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    Res,
} from "@nestjs/common"
import {
    ApiBadRequestResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger"

import { formatSuccessResponse, CustomLogger } from "src/utils/index"
import { RolesGuard } from "src/guards/RolesGuard"
import { ERROR_BODY } from "src/constants"
import { PostService, UploadService } from "src/services"
import { USER_ROLE_DEFINITIONS, UserRequest, UserRole } from "src/@types"
import { CreatePostDto } from "src/dto"
import { FileInterceptor } from "@nestjs/platform-express";
import { IsOptional } from "class-validator"
import { error } from "console"

@Controller("posts")
@ApiTags("Posts")
@UseGuards(RolesGuard)
export class PostController {
    constructor(
        @Inject(PostService)
        private readonly postService: PostService,
        private readonly uploadService: UploadService,
        private readonly logger: CustomLogger,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "Create a new post" })
    @ApiResponse({
        status: 201,
        description: "Post created successfully",
        schema: {
            properties: {
                data: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        location: { type: "string" },
                        creatorId: { type: "string" },
                        kudos: { type: "number" },
                        mediaURL: { type: "array", items: { type: "string" } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        _id: { type: "string" },
                        __v: { type: "number" },
                    },
                },
            },
        },
    })
    @SetMetadata("roles", [
        {
            name: UserRole.STANDARD_USER,
            priority: USER_ROLE_DEFINITIONS.find(
                (r) => r.name === UserRole.STANDARD_USER,
            )?.priority,
        },
    ])

    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Req() request: UserRequest,
        @UploadedFile()
        file?: Express.Multer.File,
    ) {
        try {
            if (file) {
                if (file.size > 3e+7) {
                    throw error;
                }
                
            }
            const response = await this.postService.createPost(
                createPostDto,
                request.user,
                file
            )

            this.logger.log("Post created successfully")
            return formatSuccessResponse(response)
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    @Get()
    @ApiOperation({ summary: "Get all posts" })
    @ApiResponse({
        status: 200,
        description: "Posts retrieved successfully",
        schema: {
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            content: { type: "string" },
                            location: { type: "string" },
                            creatorId: { type: "string" },
                            kudos: { type: "number" },
                            mediaURL: { type: "array", items: { type: "string" } },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            _id: { type: "string" },
                            __v: { type: "number" },
                        },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            "Invalid request. Please ensure your input is valid and properly formatted.",
        schema: ERROR_BODY,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
        schema: ERROR_BODY,
    })
    @HttpCode(200)
    async getAllPosts() {
        try {
            const response = await this.postService.getAllPosts()
            return formatSuccessResponse(response)
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    @Get(":postId")
    @ApiOperation({ summary: "Get all posts" })
    @ApiResponse({
        status: 200,
        description: "Posts retrieved successfully",
        schema: {
            properties: {
                data: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        creatorId: { type: "string" },
                        kudos: { type: "number" },
                        mediaURL: { type: "array", items: { type: "buffer" } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        _id: { type: "string" },
                        __v: { type: "number" },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            "Invalid request. Please ensure your input is valid and properly formatted.",
        schema: ERROR_BODY,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
        schema: ERROR_BODY,
    })
    @HttpCode(200)
    async getPost(
        @Param("postId") postId: string,
        @Res() res: Response,
        ) {
        try {
            const response = await this.postService.getPost(postId)
            const fileStream = await this.uploadService.getFile(this.extractFileName(response.mediaUrl));

            fileStream.pipe(res);

            return formatSuccessResponse(response)
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    private extractFileName(url: any): string {
        let strUrl = String(url);
        let parts = strUrl.split("/");
        return parts[parts.length - 1];
    }

    @Post(":postId/like")
    @ApiOperation({ summary: "Like or unlike a post" })
    @ApiResponse({
        status: 200,
        description: "Post liked or unliked successfully",
        schema: {
            properties: {
                data: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        creatorId: { type: "string" },
                        kudos: { type: "number" },
                        mediaURL: { type: "array", items: { type: "string" } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        _id: { type: "string" },
                        __v: { type: "number" },
                    },
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            "Invalid request. Please ensure your input is valid and properly formatted.",
        schema: ERROR_BODY,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
        schema: ERROR_BODY,
    })
    @SetMetadata("roles", [
        {
            name: UserRole.STANDARD_USER,
            priority: USER_ROLE_DEFINITIONS.find(
                (r) => r.name === UserRole.STANDARD_USER,
            )?.priority,
        },
    ])
    async togglePostLike(
        @Param("postId") postId: string,
        @Req() request: UserRequest,
    ) {
        try {
            const response = await this.postService.togglePostLike(
                postId,
                request.user.userId,
            )

            return formatSuccessResponse(response)
        } catch (error) {
            throw error
        }
    }
}