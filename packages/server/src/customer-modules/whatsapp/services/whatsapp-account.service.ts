import axios from 'axios';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WaAccountDto } from '../dtos/whatsapp-account-update.dto';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { WhatsAppSDKService } from './whatsapp-api.service';

@Injectable()
export class WaAccountService {
  private waAccountRepository: Repository<WhatsAppAccount>
  private waTemplateRepository: Repository<WhatsAppTemplate>
  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsService: ContactsService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly whatsAppApiService: WhatsAppSDKService,


  ) {
    this.waAccountRepository = connection.getRepository(WhatsAppAccount);
    this.waTemplateRepository = connection.getRepository(WhatsAppTemplate);
  }

  async WaAccountCreate(req, waAccount: WaAccountDto): Promise<WhatsAppAccount> {
    console.log("...........................................1");

    const waAccounts = await this.waAccountRepository.find();
    let defaultWaAccount = false;
    if (waAccounts.length < 1) {
      defaultWaAccount = true
    }
    const whatappInstants = this.waAccountRepository.create({
      name: waAccount.name,
      appId: waAccount.appId,
      phoneNumberId: waAccount.phoneNumberId,
      businessAccountId: waAccount.businessAccountId,
      accessToken: waAccount.accessToken,
      appSecret: waAccount.appSecret,
      defaultSelected: defaultWaAccount,
      waWebhookToken: 'd'
    })
    await this.contactsService.createContacts({
      contactName: waAccount.name,
      phoneNo: Number(waAccount.phoneNumberId),
      defaultContact: true,
    })

    const waAccountSaved = await this.waAccountRepository.save(whatappInstants)
    const waWebhookToken = this.encodeWaWebhookToken({ sub: req.user.userId, workspaceId: req.user.workspace, waAccount })
    waAccountSaved.waWebhookToken = waWebhookToken
    await this.waAccountRepository.save(waAccountSaved)

    return waAccountSaved;
  }



  async findAllAccounts(): Promise<WhatsAppAccount[]> {
    return await this.waAccountRepository.find({
      order: { createdAt: 'ASC' }
    });
  }

  async UpdateInstants(id: string, updatedInstants: WaAccountDto): Promise<WhatsAppAccount | null> {
    const existingInstants = await this.waAccountRepository.findOne({ where: { id } });
    if (!existingInstants) {
      throw new NotFoundException(`Instant with ID ${id} not found`);
    }
    Object.assign(existingInstants, updatedInstants);
    await this.waAccountRepository.save(existingInstants);
    const existingContact = await this.contactsService.findOneContact(Number(existingInstants.phoneNumberId))
    if (!existingContact) throw Error("contact not found")
    await this.contactsService.UpdateContact({
      id: existingContact?.id,
      contactName: existingContact?.contactName,
      phoneNo: Number(updatedInstants?.phoneNumberId)
    })
    return existingInstants
  }

  async DeleteInstants(id: string): Promise<WhatsAppAccount | null> {
    const deleteInstants = await this.waAccountRepository.findOne({ where: { id } });
    if (deleteInstants)
      return await this.waAccountRepository.remove(deleteInstants)
    else
      return null

  }

  async InstantsSelection(instantsId: string) {
    const findSelectedInstants = await this.FindSelectedInstants()

    await this.waAccountRepository.update(
      { id: findSelectedInstants?.id },
      { defaultSelected: false }
    )
    await this.waAccountRepository.update(
      { id: instantsId },
      { defaultSelected: true }
    )
    return await this.findAllAccounts()
  }


  async FindSelectedInstants() {
    return this.waAccountRepository.findOne({
      where: { defaultSelected: true }
    });
  }

  async findInstantsByPhoneNoId(phoneNumberId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { phoneNumberId: phoneNumberId },
    });
  }

  async findInstantsByInstantsId(instantsId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { id: instantsId },
    });
  }

  encodeWaWebhookToken(payloadToEncode: Record<string, any>) {
    const secret = this.jwtWrapperService.generateAppSecret(
      'API_KEY',
      payloadToEncode.workspaceId
    );

    const signedPayload = this.jwtWrapperService.sign(
      {
        ...payloadToEncode,
      },
      {
        secret,
        expiresIn: '100y'
      },
    );

    return signedPayload;
  }


  async getWhatsAppApi(instantsId?: string) {
    if (instantsId) {
      const instants = await this.findInstantsByInstantsId(instantsId)
      if (!instants)
        throw new Error("Not found whatsappaccount")
      return this.whatsAppApiService.getWhatsApp(instants)
    } else {
      const findTrueInstants = await this.FindSelectedInstants()
      if (!findTrueInstants)
        throw new Error("Not found whatsappaccount")

      return this.whatsAppApiService.getWhatsApp(findTrueInstants)
    }
  }


}