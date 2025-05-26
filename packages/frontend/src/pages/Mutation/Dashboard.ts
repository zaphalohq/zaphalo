import { gql } from "@apollo/client"

export const findCountForDash = gql`query findWorkspaceByIdForDash($workspaceId: String!) {
    findWorkspaceByIdForDash(workspaceId: $workspaceId) {
    workspace {
      channels {
        channelName
        messages {
          message
        }
      }
    }
    contacts {
      contactName
    }
  }
  }`