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

interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  text?: string;
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL';
    text: string;
    phone_number?: string;
    url?: string;
  }>;
}

interface TemplateRequest {
  name: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  language: string;
  components: TemplateComponent[];
}

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template, 'core')
    private templateRepository: Repository<Template>,
    private workspaceService: WorkspaceService,
    private readonly instantsService: instantsService,

  ) { }

  async submitTemplate(templateData: TemplateRequestInput, workspaceId: string): Promise<any> {
    console.log(templateData);
    const findSelectedInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const businessId = findSelectedInstants?.businessAccountId
    const accessToken = findSelectedInstants?.accessToken
    console.log(templateData, 'templatedtatatatatatattatatatata');

    const payload = {
      template: {
        name: templateData.name.toLowerCase().replace(/\s/g, '_'),
        category: templateData.category,
        language: templateData.language,
        components: [
          templateData.headerText && {
            type: 'HEADER',
            format: 'TEXT',
            text: templateData.headerText
          },
          templateData.headerFormat && {
            type: 'HEADER',
            format: templateData.headerFormat,
            example: {
              header_handle: [templateData.header_handle]
            }
          },
          {
            type: 'BODY',
            text: templateData.bodyText,
            example: {
              body_text: [[templateData.body_text]]
            }
          },
          templateData.footerText && {
            type: 'FOOTER',
            text: templateData.footerText
          },
          // templateData.buttonText && templateData.buttonUrl && {
          //   type: 'BUTTONS',
          //   buttons: [{ type: 'URL', text: templateData.buttonText, url: templateData.buttonUrl }]
          //   // buttons: [{ type: 'QUICK_REPLY', text: templateData.buttonText }]
          // }
        ].filter(Boolean)
      }
    };



    console.log(payload);

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
      // data: JSON.stringify({
      //   ...template,
      //   allow_category_change: true,
      // }),
      const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
      if (!workspace) throw new Error("workspace doesnt found")
      const templateResponse = response.data
      const templateCreation = this.templateRepository.create({
        templateId: templateResponse.id,
        templateName: payload.template.name,
        status: templateResponse.status.toLowerCase(),
        category: templateResponse.category.toLowerCase(),
        workspace
      })
      await this.templateRepository.save(templateCreation)
      console.log(response.data, "response.dataresponse.dataresponse.data");
      return {
        success: true,
        data: "response.data",
      };
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



  async findAllTemplate(workspaceId: string) {
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
}