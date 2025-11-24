import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';

@Catch() // catch all exceptions, then handle based on type
export class FileExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'File upload failed';

    if (exception instanceof MulterError) {
      status = HttpStatus.BAD_REQUEST;
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File too large';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field';
          break;
        default:
          message = `Upload error: ${exception.message}`;
      }
    }

    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message || 'Upload error';
    }

    else if (exception?.code === 'AccessDenied') {
      status = HttpStatus.FORBIDDEN;
      message = 'Access denied to storage bucket';
    } else if (exception?.code === 'NetworkingError') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Storage service not reachable';
    } else if (exception?.message?.includes('Unsupported storage driver')) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
