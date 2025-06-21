import { gql } from "@apollo/client";

export const UpdateWorkspaceDetails = gql`
mutation UpdateWorkspaceDetails(
  $workspaceId: String!,
  $workspaceName: String!,
  $profileImg: String!
) {
  updateWorkspaceDetails(
    WorkspaceUpdateInput: {
      workspaceId: $workspaceId,
      workspaceName: $workspaceName,
      profileImg: $profileImg
    }
  ) {
    id
    name
    profileImg
  }
}
`


