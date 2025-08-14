import { Inject, Injectable } from "@nestjs/common";
import { Connection, ILike, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppMessage } from "../entities/whatsapp-message.entity";
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService } from "./whatsapp-account.service";
import { Workspace } from 'src/modules/workspace/workspace.entity';

@Injectable()
export class MessageService {
  private messageRepository: Repository<WhatsAppMessage>

  constructor(
    @InjectRepository(Workspace, 'core')
    private usersRepository: Repository<Workspace>,
    // @Inject(CONNECTION) connection: Connection,
    // private readonly waAccountService: WaAccountService,
    // private readonly attachmentService: AttachmentService,

  ) {
    // this.messageRepository = connection.getRepository(WhatsAppMessage);
  }


  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called when the current second is 45');
  }
}