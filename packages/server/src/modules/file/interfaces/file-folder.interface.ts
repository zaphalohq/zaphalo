import { registerEnumType } from '@nestjs/graphql';

import { KebabCase } from 'type-fest';

export enum FileFolder {
  ProfilePicture = 'profile-picture',
  WorkspaceLogo = 'workspace-logo',
  Attachment = 'attachment',
  Template = 'template',
}

registerEnumType(FileFolder, {
  name: 'FileFolder',
});

export type FileFolderConfig = {
  ignoreExpirationToken: boolean;
};

export const fileFolderConfigs: Record<FileFolder, FileFolderConfig> = {
  [FileFolder.ProfilePicture]: {
    ignoreExpirationToken: true,
  },
  [FileFolder.WorkspaceLogo]: {
    ignoreExpirationToken: true,
  },
  [FileFolder.Attachment]: {
    ignoreExpirationToken: false,
  },
  [FileFolder.Template]: {
    ignoreExpirationToken: false,
  },
};

export function toFileFolderType(value: string): FileFolder {
  if (Object.values(FileFolder).includes(value as FileFolder)) {
    return value as FileFolder;
  }
  throw new Error("File folder not supported")
}

export type AllowedFolders = KebabCase<keyof typeof FileFolder>;
