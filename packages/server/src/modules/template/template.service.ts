import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import axios, { AxiosResponse } from "axios"
import { WorkspaceService } from "../workspace/workspace.service";
import { Template } from "./template.entity";
import cron from 'node-cron';
import { TemplateRequestInput } from "./dto/TemplateRequestInputDto";
import { instantsService } from "../whatsapp/instants.service";
import fs from 'fs/promises';
import { log } from "console";
import { MailingListService } from "../mailingList/mailingList.service";


@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template, 'core')
    private templateRepository: Repository<Template>,
    private workspaceService: WorkspaceService,
    private readonly instantsService: instantsService,
    private readonly mailingListService: MailingListService,

  ) { }

  async submitTemplate(templateData: TemplateRequestInput, workspaceId: string): Promise<any> {
    console.log(templateData);
    const findSelectedInstants = await this.instantsService.findInstantsByInstantsId(templateData.account)
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const businessId = findSelectedInstants?.businessAccountId
    const accessToken = findSelectedInstants?.accessToken
    const variablesValue = templateData.variables.map((variable: any) => variable.value)

    const payload = {
      name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
      category: templateData.category,
      language: templateData.language,
      components: [
        templateData.header_handle && templateData.headerType == 'TEXT' && {
          type: 'HEADER',
          format: 'TEXT',
          text: templateData.header_handle
        },
        templateData.headerType && templateData.headerType == 'IMAGE' && {
          type: 'HEADER',
          format: 'IMAGE',
          example: {
            header_handle: [templateData.header_handle]
          }
        },
        {
          type: 'BODY',
          text: templateData.bodyText,
          example: {
            body_text: [variablesValue]
          }
        },
        templateData.footerText && {
          type: 'FOOTER',
          text: templateData.footerText
        },
        templateData.button && {
          type: 'BUTTONS',
          buttons: templateData.button
          // buttons: [{ type: 'QUICK_REPLY', text: templateData.buttonText }]
        }
      ].filter(Boolean)
    };


    console.log(payload, "..........................................tem................");


    try {
      const response = await axios({
        url: `https://graph.facebook.com/v22.0/${businessId}/message_templates`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ ...payload })
      });

      const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
      if (!workspace) throw new Error("workspace doesnt found")

      const templateAPiResponse = response.data
      console.log(templateAPiResponse, "templateAPiResponsetemplateAPiResponsetemplateAPiResponse");

      if (templateAPiResponse.success || templateAPiResponse.id) {
        const templateCreation = this.templateRepository.create({
          templateId: templateAPiResponse.id,
          status: templateAPiResponse.status.toLowerCase(),
          ...templateData,
          workspace
        })

        await this.templateRepository.save(templateCreation)
        console.log(response.data, "response.dataresponse.dataresponse.data");
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (error) {
      console.log({
        success: false,
        error: error.response?.data || error.message,
      });
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }

  }

  async getTemplateStatusByCron(templateId: string, workspaceId: string) {
    const findSelectedInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const accessToken = findSelectedInstants?.accessToken
    const templateByApi = await this.getTemplateStatusByWhatsappApi(templateId, accessToken);

    console.log(templateByApi, "....................yoee are here..............");
    const templateFromDb = await this.findTemplateByTemplateId(templateId)
    if (!templateFromDb) throw new Error("template error from database")


    if (templateByApi && templateByApi.data.status.toLowerCase() === 'approved') {
      templateFromDb.status = 'approved'
      await this.templateRepository.save(templateFromDb)
      return {
        success: true,
        data: templateByApi.data,
      };
    }

    try {
      if (templateByApi && templateByApi.data.status.toLowerCase() == 'pending') {
        const taskTemplateStatus = cron.schedule('*/10 * * * * *', async () => {
          console.log(`Checking template...................................`);

          if (templateByApi.data.status.toLowerCase() === 'approved') {
            console.log(`Template ${templateId} approved. Stopping cron.`);
            taskTemplateStatus.stop();
            templateFromDb.status = 'approved'
            await this.templateRepository.save(templateFromDb)
            return {
              success: true,
              data: templateByApi.data,
            };
          }
        });

        taskTemplateStatus.start();
      }
    } catch (error) {
      console.error("this error is from Cron", error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getTemplateStatusByWhatsappApi(templateId: string, accessToken: string): Promise<any> {
    try {
      const response = await axios({
        // url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates?template_id=${templateId}`,
        url: `https://graph.facebook.com/v22.0/${templateId}?fields=name,status,category,language,components`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error({
        success: false,
        error: error.response?.data || error.message,
      });

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }





  async getAllTemplates() {
    const url = `https://graph.facebook.com/v22.0/1649375815967023/message_templates`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer EAAao8Mkc6lMBO1O4qgK3Bam1syGPZCTtLmcIXH7f9h4dthJKFI4cABSVjag1DUAlYer4BulPZBzLZAItLlxNaEZA4mXp1fnMCqTejFLieEZA6iWfXXmshbgxZCPedW9kHAZC1KTu77pNKFPQsPZBwQDjM7P2GYVw2qsbm9GZC2iierMlXAuTI1kUzKcP6LTqFkSPNGNaJ5XnfxWHeI0WbDsmmKTSBukTgw4jZAIxwZD`,
        },
      });

      const templates = response.data.data;
      console.log(templates);

      // console.log(`Total Templates Found: ${templates.length}`);
      // templates.forEach((t, i) => {
      //   console.log(
      //     `\n #${i + 1}\n Name: ${t.name}\n Category: ${t.category}\n Language: ${t.language?.code}\n Status: ${t.status}\n ID: ${t.id || 'Not returned'}`
      //   );
      // });
      return "fsds"
    } catch (err) {
      console.error('Error fetching templates:', err.response?.data || err.message);
      return "fsds"
    }

  }



  async findAllTemplate(workspaceId: string): Promise<Template[]> {
    console.log("....................................fsdfsdfdsfds.");

    return await this.templateRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { createdAt: 'ASC' }
    })
  }

  async findTemplateByTemplateId(templateId: string) {
    return await this.templateRepository.findOne({ where: { templateId: templateId } })
  }


  async uploadFile(file, appId, accessToken) {
    const { filename, mimetype, path, size }: any = file;
    const buffer = await fs.readFile(path)
    console.log(buffer, "bufferbufferbufferbufferbufferbuffer");

    const uploadSessionRes = await axios.post(
      `https://graph.facebook.com/v22.0/${appId}/uploads`,
      null,
      {
        params: {
          file_name: filename,
          file_length: size,
          file_type: mimetype,
          access_token: `${accessToken}`,
        },
      }
    );
    console.log(uploadSessionRes.data, uploadSessionRes.data.id, "uploadSessionRes.datauploadSessionRes.datauploadSessionRes.data");
    const response = await axios({
      url: `https://graph.facebook.com/v22.0/${uploadSessionRes.data.id}`,
      method: 'POST',
      headers: {
        Authorization: `OAuth ${accessToken}`,
        file_offset: 0
      },
      data: {
        'data-binary': buffer
      }
    });
    console.log(response, response.data.h);
    return response.data.h
  }










  async sendTemplateToWhatssapp(accessToken, broadcastData) {
    const url = `https://graph.facebook.com/v22.0/565830889949112/messages`;
    console.log(broadcastData, ".........................................................................");

    // const payload = {
    //   messaging_product: 'whatsapp',
    //   // to: 917202031718,
    //   type: 'template',
    //   template: {
    //     name: broadcastData.templateName,
    //     language: { code: 'en_US' },
    //     components: [
    //       {
    //         type: 'header',
    //         parameters: [
    //           {
    //             type: 'image',
    //             image: {
    //               link: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
    //             }
    //           }
    //         ]
    //       },
    //       {
    //         type: 'body',
    //         parameters: [
    //           {
    //             type: 'text',
    //             text: 'Chintan Patel'
    //           },
    //           {
    //             type: 'text',
    //             text: '50'
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // };

    const { templateName, variables = [], URL, headerType, language } = broadcastData;
    const headerComponent =
      headerType === 'IMAGE' && URL
        ? [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: URL,
                },
              },
            ],
          },
        ]
        : headerType === 'VIDEO' && URL
          ? [
            {
              type: 'header',
              parameters: [
                {
                  type: 'video',
                  video: {
                    link: URL,
                  },
                },
              ],
            },
          ]
          : headerType === 'DOCUMENT' && URL
            ? [
              {
                type: 'header',
                parameters: [
                  {
                    type: 'document',
                    document: {
                      link: URL,
                    },
                  },
                ],
              },
            ]
            : [];

    // body component
    const bodyComponent = {
      type: 'body',
      parameters: variables.map((value) => ({
        type: 'text',
        text: value,
      })),
    };




    const allContacts = await this.mailingListService.findAllContactsOfMailingList(broadcastData.mailingListId)
    allContacts.forEach(async (constact) => {
      const payload = {
        messaging_product: 'whatsapp',
        to: constact.contactNo,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components: [...headerComponent, bodyComponent],
        },
      };
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
    })
  }
}



