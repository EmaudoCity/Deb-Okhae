// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md
// CS50 Final Project - Email Application

import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/app-inbox/app-inbox.js';

const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
    routes: [
      {
        path: resolveRouterPath(),
        title: 'Inbox - CS50 Mail',
        render: () => html`<app-inbox></app-inbox>`
      },
      {
        path: resolveRouterPath('compose'),
        title: 'Compose - CS50 Mail',
        plugins: [
          lazy(() => import('./pages/app-compose/app-compose.js')),
        ],
        render: () => html`<app-compose></app-compose>`
      },
      {
        path: resolveRouterPath('sent'),
        title: 'Sent - CS50 Mail',
        plugins: [
          lazy(() => import('./pages/app-sent/app-sent.js')),
        ],
        render: () => html`<app-sent></app-sent>`
      },
      {
        path: resolveRouterPath('archived'),
        title: 'Archived - CS50 Mail',
        plugins: [
          lazy(() => import('./pages/app-archived/app-archived.js')),
        ],
        render: () => html`<app-archived></app-archived>`
      },
      {
        path: resolveRouterPath('email/:id'),
        title: 'Email - CS50 Mail',
        plugins: [
          lazy(() => import('./pages/app-email/app-email.js')),
        ],
        render: ({ params }) => html`<app-email .emailId="${params.id}"></app-email>`
      },
      {
        path: resolveRouterPath('about'),
        title: 'About - CS50 Mail',
        plugins: [
          lazy(() => import('./pages/app-about/app-about.js')),
        ],
        render: () => html`<app-about></app-about>`
      }
    ]
  });

  // This function will resolve a path with whatever Base URL was passed to the vite build process.
  // Use of this function throughout the starter is not required, but highly recommended, especially if you plan to use GitHub Pages to deploy.
  // If no arg is passed to this function, it will return the base URL.

  export function resolveRouterPath(unresolvedPath?: string) {
    var resolvedPath = baseURL;
    if(unresolvedPath) {
      resolvedPath = resolvedPath + unresolvedPath;
    }

    return resolvedPath;
  }
