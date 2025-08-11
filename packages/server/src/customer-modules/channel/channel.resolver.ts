// import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
// import { Channel } from "./channel.entity";
// import { ChannelService } from "./channel.service";
// import { Message } from "./message.entity";
// import { UseGuards } from "@nestjs/common";
// import { SendMessageInput } from "./dto/SendMessageInputDto";
// import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
// import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
// import { ContactsService } from "src/customer-modules/contacts/contacts.service";
// import { SuccessResponse } from "../whatsapp/dtos/success.dto";
// import { FileService } from "src/modules/file-storage/services/file.service";

// @Resolver(() => Channel)
// export class ChannelResolver {
//   constructor(
//     private readonly channelService: ChannelService,
//     private readonly contactService: ContactsService,
//     private readonly waAccountService: WaAccountService,
//     private fileService: FileService
//   ) { }

//   @Query(() => [Channel])
//   @UseGuards(GqlAuthGuard)
//   async findAllChannel(
//     @Context('req') req): Promise<Channel[]> {
//     return await this.channelService.findAllChannel();
//   }

//   @UseGuards(GqlAuthGuard)
//   @Query(() => [Message])
//   async findMsgByChannelId(@Context('req') req, @Args('channelId') channelId: string): Promise<Message[] | Message> {
//     const messages = await this.channelService.findMsgByChannelId(channelId);
//     await this.channelService.makeUnseenSeen(messages);
//     return messages
//   }

//   @UseGuards(GqlAuthGuard)
//   @Mutation(() => Channel)
//   async findExistingChannelByPhoneNoOrCreateChannel(@Args('phoneNo') phoneNo: string): Promise<Channel | undefined> {
//     const findTrueInstants = await this.waAccountService.FindSelectedInstants()
//     const contact = await this.contactService.findOneContact(Number(phoneNo))
//     const senderId = Number(findTrueInstants?.phoneNumberId)
//     const channelName = contact?.contactName;
//     const memberIds = [Number(phoneNo), senderId]
//     if (!findTrueInstants) throw new Error('findTrueInstants not found');
//     const existingChannel = await this.channelService.findExistingChannelByPhoneNo(memberIds)
//     if (existingChannel && existingChannel?.id) {
//       return existingChannel
//     } else {
//       const createdChannel = await this.channelService.findOrCreateChannel(
//         senderId,
//         memberIds,
//         channelName,
//       );
//       return createdChannel.channel
//     }
//   }


//   @UseGuards(GqlAuthGuard)
//   @Query(() => [Message])
//   async findAllUnseen() {
//     const unseenMessages = await this.channelService.findAllUnseen()
//     return unseenMessages
//   }

//   @UseGuards(GqlAuthGuard)
//   @Mutation(() => SuccessResponse)
//   async makeUnseenMsgSeenByMsgId(@Args('messageId') messageId: string) {
//     const unseenMessages = await this.channelService.makeUnseenSeen(undefined, messageId)
//     return {
//       success: true,
//       message: 'All messages seen'
//     }
//   }




//   @UseGuards(GqlAuthGuard)
//   @Mutation(() => Message)
//   async sendMessage(@Args('sendMessageInput') sendMessageInput: SendMessageInput): Promise<Message[] | []> {
//     const { textMessage, channelName, channelId, attachments } = sendMessageInput;
//     const findTrueInstants = await this.waAccountService.FindSelectedInstants()
//     if (!findTrueInstants) throw new Error('findTrueInstants not found');
//     const senderId = Number(findTrueInstants?.phoneNumberId)

//     const receiverId = sendMessageInput?.receiverId.filter((number: any) => number != senderId)
//     if ((!attachments || attachments.length === 0) && textMessage) {
//       const messageType = 'text'
//       const waMessageIds = await this.channelService.sendWhatsappMessage({
//         receiverId,
//         messageType,
//         textMessage,
//         attachmentId: null,
//       });

//       if (!channelId || channelId === '') {
//         const memberIds = [...receiverId, senderId];
//         const channel: any = await this.channelService.findOrCreateChannel(
//           senderId,
//           memberIds,
//           channelName,
//         );
//         if (!channel.channel.id) throw new Error('Channel not found');
//         return await this.channelService.createMessage(
//           textMessage,
//           channel.channel.id,
//           senderId, messageType,
//           waMessageIds,
//           true
//         );
//       } else {
//         return await this.channelService.createMessage(
//           textMessage,
//           channelId,
//           senderId,
//           messageType,
//           waMessageIds,
//           true
//         );
//       }
//     }

//     if (attachments && attachments.length > 0) {
//       for (const attachemnt of attachments) {
//         const waMessageIds = await this.channelService.sendWhatsappMessage({
//           receiverId,
//           messageType: attachemnt.messageType,
//           textMessage,
//           attachmentId: attachemnt.attachmentId,
//         });
//         if (!waMessageIds) throw Error('message not send to whatsapp')
//         if (!channelId || channelId === '') {
//           const memberIds = [...receiverId, senderId];
//           const channel: any = await this.channelService.findOrCreateChannel(
//             senderId,
//             memberIds,
//             channelName,
//           );
//           if (!channel.channel.id) throw new Error('Channel not found');
//           return await this.channelService.createMessage(
//             textMessage,
//             channel.channel.id,
//             senderId,
//             attachemnt.messageType,
//             waMessageIds, true,
//             attachemnt.attachmentId
//           );
//         } else {
//           return await this.channelService.createMessage(
//             textMessage,
//             channelId,
//             senderId,
//             attachemnt.messageType,
//             waMessageIds,
//             true,
//             attachemnt.attachmentId
//           );
//         }
//       }
//     }

//     return [];
//   }

//   @UseGuards(GqlAuthGuard)
//   @Mutation(() => Channel)
//   async deleteChannelById(@Args('channelId') channelId: string): Promise<Channel | undefined> {
//     return this.channelService.deleteChannelById(channelId)
//   }

//   @UseGuards(GqlAuthGuard)
//   @Mutation(() => Channel)
//   async updateChannelNameById(@Args('channelId') channelId: string, @Args('updatedValue') updatedValue: string): Promise<Channel> {
//     return await this.channelService.updateChannelNameById(channelId, updatedValue)
//   }

//   @UseGuards(GqlAuthGuard)
//   @ResolveField(() => String)
//   async attachmentUrl(@Parent() message: Message, @Context() context): Promise<string> {
//     console.log('..attachmentUrl.............................');

//     const workspaceId = context.req.headers['x-workspace-id']
//     if (message.attachmentUrl) {
//       try {
//         const workspaceLogoToken = this.fileService.encodeFileToken({
//           workspaceId: workspaceId,
//         });

//         return `${message.attachmentUrl}?token=${workspaceLogoToken}`;

//       } catch (e) {
//         return message.attachmentUrl;
//       }
//     }
//     return message.attachmentUrl ?? '';
//   }

// }

