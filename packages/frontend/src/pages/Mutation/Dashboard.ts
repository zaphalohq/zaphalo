import { gql } from "@apollo/client"

export const findCountForDash = gql`query findWorkspaceByIdForDash($workspaceId: String!) {
    findWorkspaceByIdForDash(workspaceId: $workspaceId) {
    contacts {
      contactName
    }
    workspace {
      channels {
        channelName
        messages {
          textMessage
        }
      }
    }
  }
  }`