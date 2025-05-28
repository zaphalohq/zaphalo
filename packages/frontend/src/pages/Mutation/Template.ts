import { gql } from "@apollo/client";

export const SUBMIT_TEMPLATE = gql`
mutation SubmitTemplate($templateData: TemplateRequestInput!) {
  submitTemplate(templateData: $templateData) {
    success
    data
    error
  }
}
`;

export const GET_TEMPLATE_STATUS = gql`
mutation getTemplateStatus($templateId: String!) {
  getTemplateStatus(templateId: $templateId) {
    success
    data
    error
  }
}
`;


export const Find_ALL_TEMPLATE = gql`
query findAllTemplate {
    findAllTemplate {
      account
      bodyText
      button {
        phone_number
        text
        type
        url
      }
      category
      footerText
      headerType
      header_handle
      id
      language
      status
      templateId
      templateName
      fileUrl
  }
}
`


export const Send_Template_Message = gql`
  mutation sendTemplateMessage {
  sendTemplateToWhatssapp
}
`;

export const SEND_TEMPLATE_TO_WHATSAPP = gql`
  mutation SendTemplateToWhatssapp($broadcastData: TemplateWhatsappReq!) {
    sendTemplateToWhatssapp(broadcastData: $broadcastData)
  }
`;

