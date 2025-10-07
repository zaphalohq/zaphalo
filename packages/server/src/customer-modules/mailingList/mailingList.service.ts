import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingContact, MailingListInputDto } from "./DTO/MailingListReqDto";
import { MailingContacts } from "./mailingContacts.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, ILike, Repository } from 'typeorm';
import { FindAllMailingListRes } from "./DTO/FindAllMailingListDto";

@Injectable()
export class MailingListService {
  private mailingListRepository: Repository<MailingList>
  private mailingContactsRepository: Repository<MailingContacts>
  constructor(
    @Inject(CONNECTION) connection: Connection,
  ) {
    this.mailingListRepository = connection.getRepository(MailingList);
    this.mailingContactsRepository = connection.getRepository(MailingContacts);
  }

  async CreateMailingList(mailingListName: string, mailingListData: MailingListInputDto) {
    const totalContacts = mailingListData.mailingContacts.length;

    // 1. Save parent first
    const mailingList = this.mailingListRepository.create({ mailingListName, totalContacts });
    await this.mailingListRepository.save(mailingList);

    // 2. Prepare child entities
    const contacts = mailingListData.mailingContacts.map((mailingContact) =>
      this.mailingContactsRepository.create({
        contactName: mailingContact.contactName,
        contactNo: mailingContact.contactNo,
        mailingList, // pass entity reference
      }),
    );

    // 3. Save all children & wait for completion
    await Promise.all(contacts.map((c) => this.mailingContactsRepository.save(c)));

    return mailingList;
  }

  async findMailingListById(mailingListId: string): Promise<MailingList | null> {
    return await this.mailingListRepository.findOne({
      where: { id: mailingListId },
      relations: ['mailingContacts']
    })
  }


  async searchReadMailingList(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    filter: string = '',
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Search (by name)
    if (search) {
      where.mailingListName = ILike(`%${search}%`);
    }

    const [mailingList, total] = await this.mailingListRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: ['mailingContacts', 'broadcast']
    })

    return {
      mailingList,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async deleteMailingWithContacts(mailingListId: string) {
    const mailingList = await this.mailingListRepository.findOne({ where: { id: mailingListId }, relations: ['mailingContacts'], });

    if (!mailingList) {
      return { success: false, error: `Mailing list with id ${mailingListId} not found` };
    }

    try {
      await this.mailingListRepository.remove(mailingList); // cascade deletes contacts
      return { success: true, message: `Mailing list ${mailingListId} deleted successfully` };
    } catch (err) {
      return { success: false, error: 'Failed to delete mailing list' };
    }
  }



  async findAllContactsOfMailingList(
    mailingListId: string,
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
  ) {

    const skip = (page - 1) * pageSize;

    const where: any = {
      mailingList: { id: mailingListId },
    };

    // Search (by name)
    if (search) {
      where.contactName = ILike(`%${search}%`);
    }
    const [MailingContacts, total] = await this.mailingContactsRepository.findAndCount(
      {
        where,
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
        relations: ['mailingList']
      }
    )
    return {
      MailingContacts,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async findMailingContactByContactId(mailingContactId: string) {
    const contact= await this.mailingContactsRepository.findOne({
      where: {
        id: mailingContactId
      },
      relations: ['mailingList']
    })
    if(!contact){
      throw Error("contact with this ID not found")
    }

    return contact
  }

  async findMailingContactByContactNo(contactNo: string, mailingListId: string) {
    return await this.mailingContactsRepository.findOne({
      where: {
        contactNo,
        mailingList: { id: mailingListId }
      }
    })
  }

  async findAllMailingContactByMailingListId(mailingListId: string) {
    return await this.mailingContactsRepository.find({
      where: { mailingList: { id: mailingListId } },
      order: { createdAt: 'DESC' }
    })
  }

  async findMailingListByName(mailingListName: string) {
    return await this.mailingListRepository.findOne({ where: { mailingListName } })
  }

  async saveMailingContact(saveMailingContact: MailingContact) {
    if (saveMailingContact.id) {
      const mailingContact = await this.mailingContactsRepository.findOne({ where: { id: saveMailingContact.id } })
      if (!mailingContact) throw new Error('Contact List contact doesnt exist');
      mailingContact.contactName = saveMailingContact.contactName;
      mailingContact.contactNo = saveMailingContact.contactNo;
      await this.mailingContactsRepository.save(mailingContact);
    } else {
      const mailingList = await this.mailingListRepository.findOne({
        where: { id: saveMailingContact.mailingListId },
        relations: ['mailingContacts']
      })
      if (!mailingList) throw Error('Contact List doesnt exist')
      mailingList.totalContacts = mailingList?.totalContacts + 1;
      await this.mailingListRepository.save(mailingList);
      const mailingContact = this.mailingContactsRepository.create({
        contactName: saveMailingContact.contactName,
        contactNo: saveMailingContact.contactNo,
        mailingList
      })
      await this.mailingContactsRepository.save(mailingContact);
    }
  }

  async deleteMailingContact(mailingContactId: string) {

    const contact = await this.mailingContactsRepository.findOne({
      where: { id: mailingContactId },
      relations: ['mailingList'],
    });

    if (!contact) {
      throw new Error('Mailing contact not found');
    }

    const mailingList = contact.mailingList

    await this.mailingContactsRepository.delete({ id: mailingContactId })

    const remainingCount = await this.mailingContactsRepository.count({
      where: { mailingList: { id: mailingList.id } },
    });

    await this.mailingListRepository.update(mailingList.id, {
      totalContacts: remainingCount,
    });

    return;

  }

  async searchMailingList(
    searchTerm?: string,
  ) {
    const [mailingList, totalCount] = await this.mailingListRepository.findAndCount({
      where: { mailingListName: ILike(`%${searchTerm}%`) },
      order: { createdAt: 'DESC' },
      relations: ['mailingContacts']
    });
    console.log(mailingList, 'mailingList');

    return { searchedData: mailingList, totalCount };
  }

  async readMailingList(
    searchTerm?: string,
    limit?: number,
  ) {
    const mailingList = await this.mailingListRepository.find({
      where: { mailingListName: ILike(`%${searchTerm}%`) },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return mailingList;
  }

}