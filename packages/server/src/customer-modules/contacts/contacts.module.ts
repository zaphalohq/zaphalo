import { Module } from "@nestjs/common";
import { Contacts } from "./contacts.entity";
import { ContactsService } from "./contacts.service";
import { ContactsResolver } from "./contacts.resolver";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contacts]),
  ],
  providers: [ContactsService, ContactsResolver],
  exports: [ContactsService],
})

export class ContactsModule { }