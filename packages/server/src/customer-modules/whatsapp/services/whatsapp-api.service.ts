import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import fs from 'fs/promises';
import { join } from 'path';
import { WhatsAppAccount } from "src/customer-modules/whatsapp/entities/whatsapp-account.entity";
import FormData from 'form-data';
import { createReadStream } from "fs";
const DEFAULT_ENDPOINT = "https://graph.facebook.com/v23.0"

@Injectable()
export class WhatsAppSDKService {
  getWhatsApp(whatsAppAccount: WhatsAppAccount) {
    return new WhatsAppApiService(whatsAppAccount);
  }
}

export class WhatsAppApiService {
  private readonly wa_account_id: WhatsAppAccount;
  private readonly phone_uid: String;
  public readonly token: String;
  private readonly httpService: HttpService;
  private readonly is_shared_account: boolean;

  constructor(
    private readonly whatsAppAccount: WhatsAppAccount,
  ) {
    this.wa_account_id = whatsAppAccount
    this.phone_uid = whatsAppAccount.phoneNumberId;
    this.token = whatsAppAccount.accessToken;
    this.httpService = new HttpService();
    this.is_shared_account = false
  }

  async apiRequests(params: {
    request_type: string,
    url: string,
    auth_type?: string,
    params?: {},
    headers?: {},
    data?: {},
    files?: false,
    endpoint_include?: boolean
  }) {

    let headers = params.headers || {}
    let res;
    if (!this.token || !this.phone_uid) {
      throw new Error("To use WhatsApp Configure it first")
    }
    if (params.auth_type == 'oauth') {
      headers = {
        ...headers,
        Authorization: `OAuth ${this.token}`,
      }
    }
    if (params.auth_type == 'bearer') {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.token}`,
      }
    }
    const call_url = !params.endpoint_include ? (DEFAULT_ENDPOINT + params.url) : params.url

    try {
      res = await this.httpService.axiosRef({
        'method': params.request_type,
        'url': call_url,
        'params': params.params,
        'headers': headers,
        'data': params.data,
        'timeout': 30000
      })
    } catch (err) {
      console.error(
        `WhatsApp network failure: ${err?.message}`,
      );
      return err;
    }

    try {
      if ('error' in res)
        throw new Error(JSON.stringify(res.data))
    } catch (err) {
      console.error(
        `WhatsApp network failure: ${err?.message}`,
      );
      throw err;
    }
    return res
  }

  prepare_error_response(response) {
    //
    //  This method is used to prepare error response
    //  :return tuple[str, int]: (error_message, whatsapp_error_code | -1)
    //
    if (response.response.data.error) {
      const error = response.response.data.error;
      let desc = error.message;
      desc += (' - ' + (error.error_user_title ? error.error_user_title : ''));
      desc += ('\n\n' + (error.error_user_msg ? error.error_user_msg : ''));
      let code = error.code || 'Yaari';
      return (desc ? desc : ["Non-descript Error", code]);
    }
    return ["Something went wrong when contacting WhatsApp, please try again later. If this happens frequently, contact support.", -1]
  }

  async getAllTemplate(fetch_all = true) {
    // """
    //     This method is used to get all the template from the WhatsApp Business Account

    //     API Documentation: https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates
    // """
    // if self.is_shared_account:
    //     raise WhatsAppError(failure_type='account')

    let template_url = `/${this.wa_account_id.businessAccountId}/message_templates?fields=name,components,language,status,category,id,quality_score`
    console.info("Sync templates for account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)

    let final_response: any[] = new Array()
    if (fetch_all) {
      template_url = template_url + "&limit=1";
      let endpoint_include = false;
      while (template_url) {
        let response = await this.apiRequests({
          "request_type": "GET",
          "url": template_url,
          "auth_type": "bearer",
          "endpoint_include": endpoint_include
        })
        // response_json = response.data
        if (final_response) {
          // # Add fetched data to existing response
          let response_data = response.data.data
          final_response = [...final_response, ...response_data];
        } else {
          final_response = response.data.data
        }
        // # Fetch the next URL if it exists in response to fetch more templates
        template_url = response.data?.paging?.next
        endpoint_include = template_url !== undefined;
      }
    }
    else {
      let response = await this.apiRequests({
        "request_type": "GET",
        "url": template_url,
        "auth_type": "bearer"
      });
      final_response = response.data
    }

    return final_response
  }

  async getTemplateData(waTemplateId) {
    // """
    //     This method is used to get one template details using template uid from the WhatsApp Business Account

    //     API Documentation: https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates
    // """
    // if self.is_shared_account:
    //     raise WhatsAppError(failure_type='account')

    console.info("Get template details for template uid %s using account %s [%s]", waTemplateId, this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "GET",
      "url": `/${waTemplateId}?fields=name,components,language,status,category,id,quality_score`,
      "auth_type": "bearer"
    })
    return response.data
  }



  async uploadDemoDocument(attachment?: any) {
    // """
    //     This method is used to get a handle to later upload a demo document.
    //     Only use for template registration.

    //     API documentation https://developers.facebook.com/docs/graph-api/guides/upload
    // """
    const { filename, mimetype, path, size }: any = attachment;

    //......................its need if we use 
    const buffer = await fs.readFile(path)
    if (this.is_shared_account)
      throw new Error("Account not properly configured")

    // Open session
    const appId = this.wa_account_id.appId
    const params = {
      'file_length': attachment.file_size,
      'file_type': attachment.mimetype,
      'access_token': this.token,
    }
    console.info("Open template sample document upload session with file size %s Bites of mimetype %s on account %s [%s]", attachment.file_size, attachment.mimetype, this.wa_account_id.name, this.wa_account_id.id)
    const uploads_session_response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${appId}/uploads`,
      "params": params
    })
    const uploads_session_response_json = uploads_session_response.data
    const upload_session_id = uploads_session_response_json.id
    if (!upload_session_id)
      throw new Error("Document upload session open failed, please retry after sometime.")

    // Upload file
    console.info("Upload sample document on the opened session using account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const upload_file_response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${upload_session_id}`,
      "params": params,
      "auth_type": "oauth",
      "headers": { 'file_offset': '0' },
      data: {
        'data-binary': buffer
      }
    })
    const upload_file_response_json = upload_file_response.data
    const file_handle = upload_file_response_json.h
    if (!file_handle)
      throw new Error("Document upload failed, please retry after sometime.")
    return file_handle
  }

  async submitTemplateNew(json_data) {
    // """
    //     This method is used to submit template for approval
    //     If template was submitted before, we have wa_template_uid and we call template update URL

    //     API Documentation: https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates#Creating
    // """
    if (this.is_shared_account) {
      throw new Error("Account not properly configured")
    }

    console.info("Submit new template for account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${this.wa_account_id.businessAccountId}/message_templates`,
      "auth_type": "bearer",
      "headers": { "Content-Type": "application/json" },
      "data": json_data
    })
    const response_data = response.data
    if (response.data?.id) {
      return {
        'success': response.status == 200,
        "data": response.data ? JSON.stringify(response.data) : undefined,
        "error": response.error ? JSON.stringify(response.error) : undefined,
      }
    }
    throw new Error(this.prepare_error_response(response))
  }

  async sendTemplateMsg(json_data) {
    if (this.is_shared_account) {
      throw new Error("Account not properly configured")
    }

    console.info("Submit new template for account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${this.wa_account_id.phoneNumberId}/messages`,
      "auth_type": "bearer",
      "headers": { "Content-Type": "application/json" },
      "data": json_data
    })
    const response_data = response.data

    return response_data
    // throw new Error(this.prepare_error_response(response))
  }

  async submitTemplateUpdate(json_data, waTemplateId) {
    if (this.is_shared_account) {
      throw new Error("Account not properly configured")
    }
    console.info("Update template : %s for account %s [%s]", waTemplateId, this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${waTemplateId}`,
      "auth_type": "bearer",
      "headers": { 'Content-Type': 'application/json' },
      "data": json_data
    })
    const response_data = response.data
    if (response_data?.success)
      return {
        'id': response_data.id,
        'status': response.status,
        'success': response_data.success,
        "data": response.data ? JSON.stringify(response.data) : undefined,
        "error": response.error ? JSON.stringify(response.error) : undefined,
      }
    throw new Error(this.prepare_error_response(response))
  }

  async syncTemplate() {
    if (this.is_shared_account) {
      throw new Error("Account not properly configured")
    }
    const response = await this.apiRequests({
      "request_type": "GET",
      "url": `/${this.wa_account_id.businessAccountId}/message_templates`,
      "auth_type": "bearer"
    })
    if(response.status == 401){
      throw Error(response.response.statusText);
    }
    return response.data.data
  }



  async sendWhatsApp(
    json_data
    // number, 
    // message_type, 
    // send_vals,
    // parent_message_id = false
  ) {
    // """ Send WA messages for all message type using WhatsApp Business Account

    // API Documentation:
    //     Normal        - https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
    //     Template send - https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
    // """



    // let data = [{
    //   'messaging_product': 'whatsapp',
    //   'recipient_type': 'individual',
    //   'to': number
    // }];
    // // if there is parent_message_id then we send message as reply
    // if (parent_message_id) {
    //   data['context'] = { 'message_id': parent_message_id };
    // }
    // if (message_type in ['template', 'text', 'document', 'image', 'audio', 'video']) {
    //   data['type'] = message_type;
    //   data['message_type'] = send_vals;
    // }
    // const json_data = JSON.stringify(data)
    // console.info("Send %s message from account %s [%s]", message_type, this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${this.phone_uid}/messages`,
      "auth_type": "bearer",
      "headers": { 'Content-Type': 'application/json' },
      "data": json_data
    })
    const response_data = response.data
    if (response_data?.messages) {
      let msg_uid = response_data.messages[0].id;
      return msg_uid
    }
    throw new Error(this.prepare_error_response(response))
  }

  async getMediaUrl(mediaId: string) {
    const response = await this.apiRequests({
      "request_type": "GET",
      "url": `/${mediaId}`,
      "auth_type": "bearer",
    })
    const response_data = response.data
    if (response_data) {
      return response_data
    }
    throw new Error(this.prepare_error_response(response))
  }

  async getHeaderDataFromHandle(url) {
    // """ This method is used to get template demo document from url """
    console.info("Get header data for url %s from account %s [%s]", url, this.wa_account_id.name, this.wa_account_id.id);
    const response = await this.apiRequests({
      "request_type": "GET",
      "url": url,
      "endpoint_include": true
    })
    const res = await this.httpService.axiosRef({
      "method": "head", "url": url
    });
    if (!res) {
      throw new Error("Res is null");
    }
    const mimetype = res.headers;
    const data = response.data;
    return [data, mimetype]
  }

  async _get_whatsapp_document(document_id) {
    // """
    //     This method is used to get document from WhatsApp sent by user

    //     API Documentation: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media
    // """
    console.info("Get document url for document uid %s from account %s [%s]", document_id, this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      "request_type": "GET",
      "url": `/${document_id}`,
      "auth_type": "bearer"
    })
    const response_data = response.data
    const file_url = response_data.url
    console.info("Get document from url for account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const file_response = await this.apiRequests({
      "request_type": "GET",
      "url": file_url,
      "auth_type": "bearer",
      "endpoint_include": true
    })
    return file_response.content
  }

  async _upload_whatsapp_document(attachment) {
    // """
    //     This method is used to upload document for sending via WhatsApp

    //     API Documentation: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media
    // """
    const { filename, originalname, mimetype, path, size }: any = attachment;
    console.log(attachment, 'attachmentattachment..............');

    const filePath = join(
      process.cwd(),
      path
    );

    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', createReadStream(filePath), {
      filename: originalname,
      contentType: mimetype,
    });

    console.info("Upload document of mimetype %s for phone uid %s", mimetype, this.phone_uid)
    const response = await this.apiRequests({
      "request_type": "POST",
      "url": `/${this.phone_uid}/media`,
      "auth_type": 'bearer',
      "data": form,
    })
    const response_data = response.data
    if (response_data?.id) {
      return response_data.id
    }
    throw new Error(this.prepare_error_response(response));
  }


  // async testInstants() {
  //   if (this.is_shared_account) {
  //     throw new Error("Account not properly configured")
  //   }
  //   const response = await this.apiRequests({
  //     "request_type": "GET",
  //     "url": `/${this.wa_account_id.phoneNumberId}?access_token=${this.token}`,
  //   })
  //   return response.data
  // }

  async _test_connection() {
    // """ This method is used to test connection of WhatsApp Business Account"""
    // console.info("Test connection: Verify set phone uid is available in account %s [%s]", this.wa_account_id.name, this.wa_account_id.id)
    const response = await this.apiRequests({
      'request_type': "GET",
      'url': `/${this.wa_account_id.businessAccountId}/phone_numbers`,
      'auth_type': 'bearer',
    })
    if(response.status == 401){
      throw Error(this.prepare_error_response(response));
    }
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
      'params': { 'access_token': this.token },
    })
    const upload_session_id = uploads_session_response.data.id
    if (!upload_session_id)
      throw new Error(this.prepare_error_response(uploads_session_response))
    return
  }
}