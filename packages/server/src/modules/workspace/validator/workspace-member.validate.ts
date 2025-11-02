// import { CustomException } from 'src/utils/custom-exception';
// import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
// import {
//   UserWorkspaceException,
//   UserWorkspaceExceptionCode,
// } from 'src/modules/user-workspace/user-workspace.exception';

// const assertIsDefinedOrThrow = (
//   userWorkspace: UserWorkspace | undefined | null,
//   exceptionToThrow: CustomException = new UserWorkspaceException(
//     'User Workspace not found',
//     UserWorkspaceExceptionCode.USER_WORKSPACE_NOT_FOUND,
//   ),
// ): asserts userWorkspace is WorkspaceMember => {
//   if (!userWorkspace) {
//     throw exceptionToThrow;
//   }
// };

// export const userWorkspaceValidator: {
//   assertIsDefinedOrThrow: typeof assertIsDefinedOrThrow;
// } = {
//   assertIsDefinedOrThrow: assertIsDefinedOrThrow,
// };
