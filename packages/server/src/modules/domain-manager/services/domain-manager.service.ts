import { Injectable } from '@nestjs/common';

@Injectable()
export class DomainManagerService {
  getFrontUrl() {
    const url = process.env.FRONTEND_URL ??
      process.env.SERVER_URL ?? ''
    return new URL(url);
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
    return url;
  }

  getBaseUrl(): URL {
    const baseUrl = this.getFrontUrl();
    return baseUrl;
  }

  private appendSearchParams(
    url: URL,
    searchParams: Record<string, string | number | boolean>,
  ) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });
  }

  buildWorkspaceURL({
    pathname,
    searchParams,
  }: {
    pathname?: string;
    searchParams?: Record<string, string | number | boolean>;
  }) {
    const url = new URL(this.getFrontUrl());
    if (pathname) {
      url.pathname = pathname;
    }
    if (searchParams) {
      this.appendSearchParams(url, searchParams);
    }
    return url;
  }


  getSubdomainAndCustomDomainFromWorkspaceFallbackOnDefaultSubdomain(
  ) {
    return {
      subdomain: process.env.DEFAULT_SUBDOMAIN,
      customDomain: null,
    };
  }

}