import { CustomException } from 'src/utils/custom-exception';

export class WhatsAppException extends CustomException {
  declare code: WhatsAppExceptionCode;
  constructor(
    message: string,
    code: WhatsAppExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: string } = {},
  ) {
    super(message, code, userFriendlyMessage);
  }
}

export enum WhatsAppExceptionCode {
  WA_ACCOUNT_INVALID = "WA_ACCOUNT_INVALID",
  INVALID_API_CALL = "INVALID_API_CALL",
  MOBILE_NUMBER_NOT_VALID = 'MOBILE_NUMBER_NOT_VALID',
  TEMPLATE_NOT_SUBMITED = 'TEMPLATE_NOT_SUBMITED',
  TEMPLATE_NOT_APPROVED = 'TEMPLATE_NOT_APPROVED',
}