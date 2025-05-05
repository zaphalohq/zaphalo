import { Args, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Request, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import axios from 'axios'
import { instantsService } from "../whatsapp/instants.service";
import { throwError } from "rxjs";
import { error, log } from "console";
import { TemplateResponseDto } from "./dto/TemplateResponseDto";
import { TemplateRequestInput } from "./dto/TemplateRequestInput";
import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
import { AuthGuard } from "@nestjs/passport";
import { workerData } from "worker_threads";

@Resolver(() => Template)
export class TemplateResolver {
    constructor(
        @InjectRepository(Template, 'core')
        private readonly templateRepository: Repository<Template>,

        private readonly templateService: TemplateService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TemplateResponseDto)
    async submitTemplate(
        @Context('req') req, @Args('template') template: TemplateRequestInput,
    ): Promise<TemplateResponseDto> {
        const workspaceId = req.user.workspaceIds[0];
        const result = await this.templateService.submitTemplate(template, workspaceId);
        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };
    }


    @Query(() => TemplateResponseDto)
    async getTemplateStatus(
        @Args('templateId') templateId: string,
    ): Promise<TemplateResponseDto> {
        const result = await this.templateService.getTemplateStatusByCron(templateId);
        if(!result) throw new Error ("result doesnt found in resolver templateResolver")

        return {
            success: result.success,
            data: result.data ? JSON.stringify(result.data) : undefined,
            error: result.error ? JSON.stringify(result.error) : undefined,
        };
    }

    @Query(() => String)
    async getAllTemplatesFromApi() {
        await this.templateService.getAllTemplates()
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Template])
    async findAllTemplate(@Context('req') req): Promise<Template[]> {
        const workspaceId = req.user.workspaceIds[0];
        return await this.templateService.findAllTemplate(workspaceId)
    }




}

