import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DomainManagerService {

  getFrontUrl() {
    console.log (".............. process.env.FRONTEND_URL..........",  process.env.FRONTEND_URL);
    return new URL(''
      // process.env.FRONTEND_URL ??
      //   process.env.SERVER_URL
    );
  }

  buildBaseUrl({
    pathname,
    searchParams,
  }: {
    pathname?: string;
    searchParams?: Record<string, string | number>;
  }) {
    const url = this.getBaseUrl();

    if (pathname) {
      url.pathname = pathname;
    }

    // if (searchParams) {
    //   this.appendSearchParams(url, searchParams);
    // }

    return url;
  }

  getBaseUrl(): URL {
    const baseUrl = this.getFrontUrl();

    // if (
    //   this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') &&
    //   this.twentyConfigService.get('DEFAULT_SUBDOMAIN')
    // ) {
    //   baseUrl.hostname = `${this.twentyConfigService.get('DEFAULT_SUBDOMAIN')}.${baseUrl.hostname}`;
    // }

    return baseUrl;
  }

  buildWorkspaceURL({
    // workspace,
    pathname,
    // searchParams,
  }: {
    // workspace: WorkspaceSubdomainCustomDomainAndIsCustomDomainEnabledType;
    pathname?: string;
    // searchParams?: Record<string, string | number | boolean>;
  }) {
    // const workspaceUrls = this.getWorkspaceUrls(workspace);

    // const url = new URL(workspaceUrls.customUrl ?? workspaceUrls.subdomainUrl);
    const url = new URL('http://localhost:5173');

    if (pathname) {
      url.pathname = pathname;
    }

    // if (searchParams) {
    //   this.appendSearchParams(url, searchParams);
    // }

    return url;
  }

}