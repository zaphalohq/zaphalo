import { Inject, Injectable } from "@nestjs/common";
import { Attachment } from "./attachment.entity";
import { CreateAttachmentDto } from "./dto/createAttachmentDto";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class AttachmentService {
    private attachmentRepository: Repository<Attachment>

    constructor(
         @Inject(CONNECTION) connection: Connection,
    ) { 
        this.attachmentRepository = connection.getRepository(Attachment);
    }

    async createOneAttachment(createAttachmentDto: CreateAttachmentDto) {
        const attachment = this.attachmentRepository.create({
            name : createAttachmentDto.name,
            originalname : createAttachmentDto.originalname,
            size : createAttachmentDto.size,
            mimetype : createAttachmentDto.mimetype,
            path : createAttachmentDto.path,
        });        
        await this.attachmentRepository.save(attachment);
        return attachment
    }

    async findOneAttachmentById(attachmentId : string) {
        return await this.attachmentRepository.findOne({ where : { id : attachmentId }})
    }

}