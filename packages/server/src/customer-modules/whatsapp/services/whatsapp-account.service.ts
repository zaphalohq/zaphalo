import { Inject, Injectable } from "@nestjs/common";
import { Connection, Repository } from 'typeorm';
import axios from "axios";

import { WhatsAppAccount } from "src/customer-modules/whatsapp/entities/whatsapp-account.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';


@Injectable()
export class WhatsAppAccountService {
  private whatsAppAccountRepository: Repository<WhatsAppAccount>
  
  constructor(@Inject(CONNECTION) connection: Connection,) {
      this.whatsAppAccountRepository = connection.getRepository(WhatsAppAccount);
  }

  async findAllAccounts(): Promise<WhatsAppAccount[]> {
      return await this.whatsAppAccountRepository.find({
          order: { createdAt: 'ASC' }
      });
  }
}