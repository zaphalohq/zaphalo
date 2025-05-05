import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ContactsService } from "../contacts/contacts.service";
import { UserService } from "../user/user.service";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";
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
      try {
        const response = await axios({
          url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates`,
          method: 'POST',
          headers: {
            Authorization: `Bearer EAAao8Mkc6lMBOzWSkoUZCyUApRFfe9L1iX3b1UcOIKFioDR8lEDibs852NZAQCoe3etb0pjNtoIHVLBSidp41ZBUKW1WcpPi6aDwbAvIZCevit9oIGQ44N1a9JKLuxY8OkcrACzbFlRq5BYxZATEm30rKV6jncqsRKR3F7vV0ZA3NZAXEREJ1NvCZBaYSSX6AHRlp9Iq3pcVMeJHK4vJmwjUIn8y6vVJ0IOZAUzpC`,
            'Content-Type': 'application/json',
          },
          data : JSON.stringify({...template})
          // data : JSON.stringify(payload)
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
            Authorization: `Bearer EAAao8Mkc6lMBOzWSkoUZCyUApRFfe9L1iX3b1UcOIKFioDR8lEDibs852NZAQCoe3etb0pjNtoIHVLBSidp41ZBUKW1WcpPi6aDwbAvIZCevit9oIGQ44N1a9JKLuxY8OkcrACzbFlRq5BYxZATEm30rKV6jncqsRKR3F7vV0ZA3NZAXEREJ1NvCZBaYSSX6AHRlp9Iq3pcVMeJHK4vJmwjUIn8y6vVJ0IOZAUzpC`,
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
        Authorization: `Bearer EAAao8Mkc6lMBOzWSkoUZCyUApRFfe9L1iX3b1UcOIKFioDR8lEDibs852NZAQCoe3etb0pjNtoIHVLBSidp41ZBUKW1WcpPi6aDwbAvIZCevit9oIGQ44N1a9JKLuxY8OkcrACzbFlRq5BYxZATEm30rKV6jncqsRKR3F7vV0ZA3NZAXEREJ1NvCZBaYSSX6AHRlp9Iq3pcVMeJHK4vJmwjUIn8y6vVJ0IOZAUzpC`,
      },
    });

    const templates = response.data.data;
    console.log(templates);
    
    // console.log(`📋 Total Templates Found: ${templates.length}`);
    // templates.forEach((t, i) => {
    //   console.log(
    //     `\n🔢 #${i + 1}\n🧾 Name: ${t.name}\n📦 Category: ${t.category}\n🌍 Language: ${t.language?.code}\n📄 Status: ${t.status}\n🆔 ID: ${t.id || 'Not returned'}`
    //   );
    // });
    return "fsds"
  } catch (err) {
    console.error('❌ Error fetching templates:', err.response?.data || err.message);
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

}