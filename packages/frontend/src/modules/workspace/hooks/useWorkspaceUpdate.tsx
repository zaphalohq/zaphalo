import { useCallback } from 'react';
import { UpdateWorkspaceDetails, useCreateOneAttachmentMutation } from '@src/generated/graphql';
import { useMutation } from '@apollo/client';


export const useWorkspaceUpdate = () => {
  const [createOneAttachmentMutation, { loading }] =
    useCreateOneAttachmentMutation();
  const [WorkspaceDetails] = useMutation(UpdateWorkspaceDetails);

  const handleCreateOneAttachment = useCallback(
    (name: string | null) => {
      console.log("................name.........", name);
      
      return async () => {
        const { data } = await createOneAttachmentMutation({
          variables: { name },
        });
      };
    },
    [],
  );

  return { handleCreateOneAttachment, loading };
};
