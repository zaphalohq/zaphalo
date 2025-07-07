import { Inject, Injectable } from "@nestjs/common";
import { Connection, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import axios from "axios";

import { WhatsappInstants } from "src/customer-modules/instants/Instants.entity";
// import { WhatsAppAccountService } from "./whatsapp-account.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

const DEFAULT_ENDPOINT = "https://graph.facebook.com/v23.0"

@Injectable()
export class WhatsAppSDKService {
  getWhatsApp(whatsAppAccount: WhatsappInstants) {
    return new WhatsAppApiService(whatsAppAccount);
  }
}


export class WhatsAppApiService {
  private readonly wa_account_id: WhatsappInstants;
  private readonly phone_uid: String;
  private readonly token: String;
  private readonly httpService: HttpService;

  constructor(
    private readonly whatsAppAccount: WhatsappInstants,
  ) {
      this.wa_account_id = whatsAppAccount
      this.phone_uid = whatsAppAccount.phoneNumberId;
      this.token = whatsAppAccount.accessToken;
      this.httpService = new HttpService();
      // this.is_shared_account = false
    // this.templateRepository = connection.getRepository(Template);
  }

  async apiRequests(params: {
      request_type: string,
      url: string,
      auth_type?: string,
      params?: {},
      headers?: {},
      data?: {},
      files?: false,
      endpoint_include?: boolean}){

      let headers = params.headers || {}
      // const params = params.params || {}
      let res;
      if (!this.token || !this.phone_uid){
          throw new Error("To use WhatsApp Configure it first")
      }
      if (params.auth_type == 'oauth'){
        headers = {
          ...headers,
          Authorization: `OAuth ${this.token}`,
        }
      }
      if (params.auth_type == 'bearer'){
        headers = {
          ...headers,
          Authorization: `Bearer ${this.token}`,
        }
      }
      const call_url = !params.endpoint_include ? (DEFAULT_ENDPOINT + params.url) : params.url

      try {
          res = await this.httpService.axiosRef({'method': params.request_type, 'url': call_url, 'params': params.params, 'headers': headers, 'data': params.data, 'timeout': 30000})
      }catch(err){
        console.error(
          `WhatsApp network failure: ${err?.message}`,
        );
        return err;
      }

      // raise if json-parseable and 'error' in json
      try{
          if ('error' in res)
            throw new Error(JSON.stringify(res.data))
      }catch(err){
        console.error(
          `WhatsApp network failure: ${err?.message}`,
        );
        throw err;
      }
    return res
  }

  prepare_error_response(response){
      //
      //  This method is used to prepare error response
      //  :return tuple[str, int]: (error_message, whatsapp_error_code | -1)
      // 
      if (response.error){
          const error = response.error;
          let desc = error.message;
          desc += (' - ' + (error.error_user_title ? error.error_user_title : ''));
          desc += ('\n\n' + (error.error_user_msg ? error.error_user_msg : ''));
          let code = error.code || 'Yaari';
          return (desc ? desc : ["Non-descript Error", code]);
      }
      return ["Something went wrong when contacting WhatsApp, please try again later. If this happens frequently, contact support.", -1]
  }

  async getAllTemplate(fetch_all=false){
    // """
    //     This method is used to get all the template from the WhatsApp Business Account

    //     API Documentation: https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates
    // """
    // if self.is_shared_account:
    //     raise WhatsAppError(failure_type='account')

    let template_url = `/${this.wa_account_id.businessAccountId}/message_templates?fields=name,components,language,status,category,id,quality_score`
    console.info("Sync templates for account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    
    let final_response: any[] = new Array()
    if (fetch_all){
      // # Fetch 200 templates at once
      template_url = template_url + "&limit=1";
      let endpoint_include = false;
      while (template_url){
        let response = await this.apiRequests({
          "request_type": "GET",
          "url": template_url,
          "auth_type": "bearer",
          "endpoint_include": endpoint_include})
        // response_json = response.data
        if (final_response){
          // # Add fetched data to existing response
          let response_data = response.data.data
          final_response = [...final_response, ...response_data];
        }else{
          final_response = response.data.data
        }    
        // # Fetch the next URL if it exists in response to fetch more templates
        template_url = response.data?.paging?.next
        endpoint_include = template_url !== undefined;
      }
    }
    else{
      let response = await this.apiRequests({
        "request_type": "GET",
        "url": template_url,
        "auth_type": "bearer"});
      final_response = response.data
    }

    return final_response
  }
  async _test_connection(){
    // """ This method is used to test connection of WhatsApp Business Account"""
    console.info("Test connection: Verify set phone uid is available in account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      'request_type': "GET",
      'url': `/${this.wa_account_id.businessAccountId}/phone_numbers`,
      'auth_type': 'bearer',
    })
    const data = response.data.data
    let phone_values: String[] = new Array();

    for (let key in data) {
      phone_values.push(data[key].id);
    }

    if (!Object.values(phone_values).includes(this.wa_account_id.phoneNumberId))
        throw new Error("Phone number Id is wrong.")
    console.info(`Test connection: check app uid and token set in account ${this.wa_account_id.name} ${this.wa_account_id.id}`);
    const uploads_session_response = await this.apiRequests({
      "request_type": "POST",
      'url': `/${this.wa_account_id.appId}/uploads`,
      'params': {'access_token': this.token}})
    const upload_session_id = uploads_session_response.data.id
    if (!upload_session_id)
        throw new Error(this.prepare_error_response(uploads_session_response))
    return
  }
}