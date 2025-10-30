import { useCallback } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_ROLE, DELETE_WORKSPACE_MEMBER, SUSPEND_WORKSPACE_MEMBER } from '@src/modules/settings/users/graphql/mutations/updateRoleMutation';

export const useUpdateUser = () => {
  const [updateUserRoleMutation] = useMutation(UPDATE_ROLE);
  const [deleteWorkspaceMemberMutation] = useMutation(DELETE_WORKSPACE_MEMBER);
  const [suspendWorkspaceMemberMutation] = useMutation(SUSPEND_WORKSPACE_MEMBER);


  const handleUpdateUserRole = useCallback(
    async (params: {
        userId: String, role: String
      }) => {
    	return updateUserRoleMutation({
        variables: params,
        onCompleted: async (data) => {
        },
        onError: (error) => {
      },
    });
	});

  const handleDeleteWorkspaceMember = useCallback(
    async (params: {
        userId: String
      }) => {
      console.log("....userId..........role...............", params)
      return deleteWorkspaceMemberMutation({
        variables: params,
        onCompleted: async (data) => {
        },
        onError: (error) => {
      },
    });
  });

  const handleSuspendWorkspaceMember = useCallback(
    async (params: {
        userId: String
      }) => {
      console.log("....userId..........role...............", params)
      return suspendWorkspaceMemberMutation({
        variables: params,
        onCompleted: async (data) => {
        },
        onError: (error) => {
      },
    });
  });


	return {
    updateUserRole: handleUpdateUserRole,
    deleteWorkspaceMember: handleDeleteWorkspaceMember,
    suspendWorkspaceMember: handleSuspendWorkspaceMember,
  };

}