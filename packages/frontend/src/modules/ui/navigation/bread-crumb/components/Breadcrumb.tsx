import { Fragment, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type BreadcrumbProps = {
  className?: string;
  links: { children: string | ReactNode; href?: string }[];
};


export const Breadcrumb = ({ className, links }: BreadcrumbProps) => {
  return (
    <nav className={className}>
      <ol class="flex items-center whitespace-nowrap">
      {links.map((link, index) => {
        const text = typeof link.children === 'string' ? link.children : '';

        return (
          <Fragment key={index}>
              {link.href ? (
                <li class="inline-flex items-center">
                  <Link class="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" title={text} to={link.href}>
                    {link.children}
                  </Link>
                  {index < links.length - 1 && <span><svg class="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg></span>}
                </li>
              ) : (
                <li aria-current="page">
                  <div class="flex items-center">
                    <span class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400" title={text}>{link.children}</span>
                  </div>
                  {index < links.length - 1 && <span><svg class="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg></span>}
                </li>
              )}
          </Fragment>
        );
      })}
      </ol>
    </nav>
  );
};
