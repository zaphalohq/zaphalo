import { Request } from 'express';

import { fileFolderConfigs } from 'src/modules/file/interfaces/file-folder.interface';

import { checkFileFolder } from 'src/modules/file/utils/check-file-folder.utils';
import { checkFilename } from 'src/modules/file/utils/check-file-name.utils';

export const extractFileInfoFromRequest = (request: Request) => {
  const filename = checkFilename(request.params.filename);

  const rawFolder = request.params.path[0];

  const fileSignature = request.params.path[1];

  const fileFolder = checkFileFolder(rawFolder);

  const ignoreExpirationToken =
    fileFolderConfigs[fileFolder].ignoreExpirationToken;

  return {
    filename,
    fileSignature,
    rawFolder,
    fileFolder,
    ignoreExpirationToken,
  };
};
