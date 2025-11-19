import { useRecoilValue } from 'recoil';
import { useMutation } from '@apollo/client';

import { Attachment } from '@/activities/files/types/Attachment';
import { getFileType } from '@src/modules/chat/utils/getFileType';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import { useApolloCoreClient } from '@src/modules/apollo/hooks/useApolloCoreClient';

import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { isDefined } from '@src/utils/validation/isDefined';
import {
  FileFolder,
  uploadFile,
  useUploadFileMutation,
  CreateOneAttachmentDoc,
} from '@src/generated/graphql';

export const useUploadAttachmentFile = () => {
  const currentWorkspaceMember = useRecoilValue(currentUserWorkspaceState);
  const coreClient = useApolloCoreClient();
  const [uploadFile] = useUploadFileMutation({ client: coreClient });
  const [createOneAttachment] = useMutation(CreateOneAttachmentDoc);

  const uploadAttachmentFile = async (
    file: File,
    targetableObject: ActivityTargetableObject,
  ) => {
    const result = await uploadFile({
      variables: {
        file,
        fileFolder: FileFolder.Attachment,
      },
    });

    const signedFile = result?.data?.uploadFile;

    if (!isDefined(signedFile)) {
      throw new Error("Couldn't upload the attachment.");
    }

    const { path: attachmentPath } = signedFile;

    const createdAttachment = await createOneAttachment({
      variables: {
        name: file.name,
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        path: attachmentPath,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
    return createdAttachment;
  };

  return { uploadAttachmentFile };
};
