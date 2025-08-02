import { Module } from "@nestjs/common";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { contactsResolver } from "./contacts.resolver";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contacts]),
  ],
  providers: [ContactsService, contactsResolver],
  exports: [ContactsService],
})

export class ContactsModule { }