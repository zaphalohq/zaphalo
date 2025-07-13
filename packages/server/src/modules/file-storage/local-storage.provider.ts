import { Injectable, Req } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';

@Injectable()
export class LocalStorageProvider {
  getMulterStorage(
    @Req() request,
   ) {
    let { workspaceId } = request;
    const isGraphQL = request?.hasOwnProperty('req') && request?.req?.body?.hasOwnProperty('operationName');

    if (isGraphQL) {
      workspaceId = request?.req?.headers['x-workspace-id'];
    } else {
      workspaceId = request?.workspaceId || request?.headers?.['x-workspace-id'];
    }
    const folder = this.getWorkspaceFolderName(workspaceId);

    return diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, callback) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueSuffix);
      },
    });
  }

  private getWorkspaceFolderName(workspaceId: string) {
    return `workspace-${workspaceId}`;
  }
}