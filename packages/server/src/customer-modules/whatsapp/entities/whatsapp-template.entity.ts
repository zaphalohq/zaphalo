import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation
} from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Attachment } from "src/customer-modules/attachment/attachment.entity";
import { WhatsAppAccount } from "./whatsapp-account.entity";

export enum TemplateHeaderType {
  NONE = 'NONE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export enum TemplateCategory {
  MARKETING = 'MARKETING',
  AUTHENTICATION = 'AUTHENTICATION',
  UTILITY = 'UTILITY'
}

export enum TemplateStatus {
  new = 'New',
  pending = 'Pending',
  inAppeal = 'In Appeal',
  approved = 'Approved',
  paused = 'Paused',
  disabled = 'Disabled',
  rejected =  'Rejected',
  pendingDeletion = 'Pending Deletion',
  deleted = 'Deleted',
  limitExceeded = 'Limit Exceeded',
}

export enum TemplateQuality {
  none = 'None',
  red = 'Red',
  yellow = 'Yellow',
  green = 'Green',
}

export enum TemplateLanguage {
  af = 'af',
  sq = 'sq',
  ar = 'ar',
  az = 'az',
  bn = 'bn',
  bg = 'bg',
  ca = 'ca',
  zh_CN = 'zh_CN',
  zh_HK = 'zh_HK',
  zh_TW = 'zh_TW',
  hr = 'hr',
  cs = 'cs',
  da = 'da',
  nl = 'nl',
  en = 'en',
  en_GB = 'en_GB',
  en_US = 'en_US',
  et = 'et',
  fil = 'fil',
  fi = 'fi',
  fr = 'fr',
  ka = 'ka',
  de = 'de',
  el = 'el',
  gu = 'gu',
  ha = 'ha',
  he = 'he',
  hi = 'hi',
  hu = 'hu',
  id = 'id',
  ga = 'ga',
  it = 'it',
  ja = 'ja',
  kn = 'kn',
  kk = 'kk',
  rw_RW = 'rw_RW',
  ko = 'ko',
  ky_KG = 'ky_KG',
  lo = 'lo',
  lv = 'lv',
  lt = 'lt',
  mk = 'mk',
  ms = 'ms',
  ml = 'ml',
  mr = 'mr',
  nb = 'nb',
  fa = 'fa',
  pl = 'pl',
  pt_BR = 'pt_BR',
  pt_PT = 'pt_PT',
  pa = 'pa',
  ro = 'ro',
  ru = 'ru',
  sr = 'sr',
  sk = 'sk',
  sl = 'sl',
  es = 'es',
  es_AR = 'es_AR',
  es_ES = 'es_ES',
  es_MX = 'es_MX',
  sw = 'sw',
  sv = 'sv',
  ta = 'ta',
  te = 'te',
  th = 'th',
  tr = 'tr',
  uk = 'uk',
  ur = 'ur',
  uz = 'uz',
  vi = 'vi',
  zu = 'zu',
}


registerEnumType(TemplateCategory, {
  name: 'TemplateCategory',
  description: 'The category of the WhatsApp template',
});

registerEnumType(TemplateLanguage, {
  name: 'TemplateLanguage',
  description: 'Supported language codes for WhatsApp templates',
});

registerEnumType(TemplateHeaderType, {
  name: 'TemplateHeaderType',
  description: 'Type of header used in WhatsApp message templates',
});

registerEnumType(TemplateStatus, {
  name: 'TemplateStatus',
  description: 'The status of the WhatsApp template',
});

registerEnumType(TemplateQuality, {
  name: 'TemplateQuality',
  description: 'The quality of the WhatsApp template',
});


@Entity({ name: 'whatsAppTemplate' })
@ObjectType('whatsAppTemplate')
export class WhatsAppTemplate {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WhatsAppAccount, { nullable: true })
  @Field(() => WhatsAppAccount, { nullable: true })
  account: Relation<WhatsAppAccount>;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  templateName: string;

  @Column({ type: 'enum', enum: TemplateQuality, nullable: true, default: TemplateQuality.none })
  @Field(() => TemplateQuality, { nullable: true })
  quality: TemplateQuality;

  @Column({ type: 'enum', enum: TemplateStatus, nullable: true, default: TemplateStatus.new })
  @Field(() => TemplateStatus, { nullable: true })
  status: TemplateStatus;

  @Column({ nullable: true })
  @Field()
  failureReason: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  waTemplateId: string;

  @Column({ type: 'enum', enum: TemplateLanguage })
  @Field(() => TemplateLanguage)
  language: TemplateLanguage;


  @Field(() => TemplateCategory)
  @Column({ type: 'enum', enum: TemplateCategory })
  category: TemplateCategory;


  @Column({ type: 'enum', enum: TemplateHeaderType, nullable: true })
  @Field(() => TemplateHeaderType, { nullable: true })
  headerType: TemplateHeaderType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  headerText: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  bodyText: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  footerText: string;

  @Column('json', { nullable: true })
  @Field(() => [Button], { nullable: true })
  button: {
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }[];

  @Column('json', { nullable: true })
  @Field(() => [Variable], { nullable: true })
  variables: {
    name: string;
    value: string;
  }[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  templateImg: string

  @Field(() => Attachment, { nullable: true })
  @ManyToOne(() => Attachment, attachment => attachment.template, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attachmentId' })
  attachment: Relation<Attachment>;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  @Field()
  updatedAt: Date;
}


@ObjectType()
class Button {
  @Field()
  type: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  phone_number?: string;
}


@ObjectType()
class Variable {
  @Field()
  name: string;

  @Field()
  value: string;
}




