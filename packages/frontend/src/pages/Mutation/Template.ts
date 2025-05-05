import { gql } from "@apollo/client";

export const SUBMIT_TEMPLATE = gql`
mutation SubmitTemplate($template: TemplateRequestInput!) {
  submitTemplate(template: $template) {
    success
    data
    error
  }
}
`;

export const GET_TEMPLATE_STATUS = gql`
query GetTemplateStatus($templateId: String!) {
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
    category
    id
    status
    templateId
    templateName
  }
}
`