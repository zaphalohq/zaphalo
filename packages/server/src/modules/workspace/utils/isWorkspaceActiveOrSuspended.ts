import { WorkspaceActivationStatus } from 'src/modules/workspace/workspace.entity';

export const isWorkspaceActiveOrSuspended = (
  workspace?: {
    activationStatus: WorkspaceActivationStatus;
  } | null,
): boolean => {
  return (
    workspace?.activationStatus === WorkspaceActivationStatus.ACTIVE ||
    workspace?.activationStatus === WorkspaceActivationStatus.SUSPENDED
  );
};
