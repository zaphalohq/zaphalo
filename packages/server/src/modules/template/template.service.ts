import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ContactsService } from "../contacts/contacts.service";
import { UserService } from "../user/user.service";
import { join } from "path";
import { existsSync, ReadStream, unlinkSync } from "fs";
import axios, { AxiosResponse } from "axios"
import fs from "fs"
import { WorkspaceService } from "../workspace/workspace.service";
import { TemplateRequestInput } from "./dto/TemplateRequestInput";
import { Template } from "./template.entity";
  import cron from 'node-cron';
import { errorMonitor } from "events";

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
        private workspaceService: WorkspaceService

    ) { }

    async submitTemplate(template: TemplateRequestInput, workspaceId : string): Promise<any> {
      console.log(template,".templaet...................");


      const payload = {
        "name": "welcome_message_102",
        "category": "MARKETING",
        "language": "en_US",
        "components": [
          {
            "type": "HEADER",
            "format": "IMAGE",
            "example": {
              "header_handle": ["https://www.kaleyra.com/wp-content/uploads/kaleyra.png"]
            }
          },
          {
            "type": "BODY",
            "text": "\nWelcome to Banastech, {{1}}\n\nThanks for shopping with us! Our team is getting your order ready and we’ll notify you once it has been dispatched. Here are your order details: Order ID: 43223432, Date: 10/08/2020, Shipment status: Preparing for Dispatch, Item Ordered: fsdf, Price: 300. Please feel free to reach out to our customer support team if you have any questions—we’re happy to serve you better!\n\nThank you\n",
            "example": {
              "body_text": [["John"]]
            }
          },
          {
            "type": "FOOTER",
            "text": "Powered by BanasTech"
          },
          {
            "type": "BUTTONS",
            "buttons": [
              {
                "type": "URL",
                "text": "View Order",
                "url": "https://example.com/order/43223432"
              }
            ]
          }
        ]
      }

      try {
        const response = await axios({
          url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates`,
          method: 'POST',
          headers: {
            Authorization: `Bearer EAAao8Mkc6lMBOyOU80TNGkEhCfYAEZBj3C2UVQQ0JZArJGXLTyQG3gfweZBEH2RZABkArevR9dYUvOyrTzZCP9OlHLqtAPvEYu2A36sUEZCVlDaNeUp8IXdEexWasPvO65PP7k6sQww5nwJJSJp6a1Gb2pzyvNDds0ZCnsUSG7YkGDZC002VcZAst6PfbShq6F3JmuZBZCFCT3DKoGxViaZC6QKLjub5mfZBNXLCujvQZD`,
            'Content-Type': 'application/json',
          },
          // data : JSON.stringify({...template})
          data : JSON.stringify(payload)
        });
                  // data: JSON.stringify({
          //   ...template,
          //   allow_category_change: true,
          // }),
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if(!workspace) throw new Error("workspace doesnt found")
        const templateResponse = response.data
        const templateCreation  = this.templateRepository.create({
          templateId : templateResponse.id, 
          templateName: template.name, 
          status: templateResponse.status.toLowerCase(), 
          category: templateResponse.category.toLowerCase(),
          workspace
        })
        await this.templateRepository.save(templateCreation)
        console.log(response.data,"response.dataresponse.dataresponse.data");
        return {
          success: true,
          data: response.data,
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

    async getTemplateStatusByCron (templateId: string) {
      const template = await this.getTemplateStatus(templateId);
      
      console.log(template,"....................yoee are here..............");
      const templateRep = await this.findTemplateByTemplateId(templateId)
      if(!templateRep) throw new Error("template error from database")
   

      if(template && template.data.status.toLowerCase() === 'approved'){
        templateRep.status = 'approved'
        await this.templateRepository.save(templateRep)
        return {
          success: true,
          data: template.data,
        };
      }
      
      try{
        if(template && template.data.status.toLowerCase() == 'pending'){
          const task = cron.schedule('*/10 * * * * *', async () => {
            const template = await this.getTemplateStatus(templateId);
            console.log(`Checking template...................................`);
      
            if (template.data.status.toLowerCase() === 'approved') {
              console.log(`Template ${templateId} approved. Stopping cron.`);
              task.stop();
              templateRep.status = 'approved'
              await this.templateRepository.save(templateRep)
              return {
                success: true,
                data: template.data,
              };
            }
          });

          task.start();
        }
      }catch (error) {
        console.error("this error is from Cron",error);
        return {
          success: false,
          error: error.response?.data || error.message,
        };
      }
    }
  
    async getTemplateStatus(templateId: string): Promise<any> {
      try {
        const response = await axios({
          // url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates?template_id=${templateId}`,
          url : `https://graph.facebook.com/v22.0/${templateId}?fields=name,status,category,language,components`,
          method: 'GET',
          headers: {
            Authorization: `Bearer EAAao8Mkc6lMBOyOU80TNGkEhCfYAEZBj3C2UVQQ0JZArJGXLTyQG3gfweZBEH2RZABkArevR9dYUvOyrTzZCP9OlHLqtAPvEYu2A36sUEZCVlDaNeUp8IXdEexWasPvO65PP7k6sQww5nwJJSJp6a1Gb2pzyvNDds0ZCnsUSG7YkGDZC002VcZAst6PfbShq6F3JmuZBZCFCT3DKoGxViaZC6QKLjub5mfZBNXLCujvQZD`,
            'Content-Type': 'application/json',
          },
        });
  // console.log(response,"....................................................");
  //       console.log({
  //         success: true,
  //         data: response.data,
  //       });
        
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
        Authorization: `Bearer EAAao8Mkc6lMBOyOU80TNGkEhCfYAEZBj3C2UVQQ0JZArJGXLTyQG3gfweZBEH2RZABkArevR9dYUvOyrTzZCP9OlHLqtAPvEYu2A36sUEZCVlDaNeUp8IXdEexWasPvO65PP7k6sQww5nwJJSJp6a1Gb2pzyvNDds0ZCnsUSG7YkGDZC002VcZAst6PfbShq6F3JmuZBZCFCT3DKoGxViaZC6QKLjub5mfZBNXLCujvQZD`,
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



async findAllTemplate(workspaceId : string) {
  console.log("....................................fsdfsdfdsfds.");
  
  return await this.templateRepository.find({
    where : {workspace : {id : workspaceId}},
    order : {createdAt : 'ASC'}
  })
}

async findTemplateByTemplateId(templateId : string){
  return await this.templateRepository.findOne({ where : {templateId : templateId}})
}



// async uploadFile(file: { createReadStream: () => ReadStream; mimetype: string }): Promise<string> {
//   const stream = file.createReadStream();
//   const form = new FormData();
//   form.append('file', stream, { contentType: file.mimetype });
//   form.append('type', file.mimetype);
//   form.append('messaging_product', 'whatsapp');

//   try {
//     const response = await axios({
//       url: this.whatsappApiUrl,
//       method: 'POST',
//       headers: {
//         ...form.getHeaders(),
//         Authorization: `Bearer ${this.accessToken}`,
//         'Content-Type': 'multipart/form-data',
//       },
//       data: form,
//     });

//     return response.data.id;
//   } catch (error) {
//     throw new Error(`Failed to upload file to WhatsApp: ${error.response?.data?.error?.message || error.message}`);
//   }
// }

}