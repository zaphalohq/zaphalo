import { gql } from '@apollo/client';


export const UPDATE_WORKSPACE_DETAIL = gql`
mutation UpdateWorkspaceDetails(
  $workspaceName: String!,
  $profileImg: String
) {
  updateWorkspaceDetails(
    WorkspaceUpdateInput: {
      workspaceName: $workspaceName,
      profileImg: $profileImg
    }
  ) {
    id
    name
    profileImg
  }
}`