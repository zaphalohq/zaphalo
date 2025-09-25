import { CustomException } from 'src/utils/custom-exception';

export class BroadcastException extends CustomException {
  declare code: BroadcastExceptionCode;
  constructor(
    message: string,
    code: BroadcastExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: string } = {},
  ) {
    super(message, code, userFriendlyMessage);
  }
}

export enum BroadcastExceptionCode {
  INVALID_WHATSAPP_ACCOUNT = "INVALID_WHATSAPP_ACCOUNT",
}