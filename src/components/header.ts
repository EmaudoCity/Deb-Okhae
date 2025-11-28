import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';
import { EmailService } from '../services/email-service';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'CS50 Mail';
  @property({ type: Boolean }) enableBack: boolean = false;
  @state() private unreadCount = 0;
  private unsubscribe?: () => void;

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--app-color-primary, #4F46E5);
      color: white;
      padding: 12px 16px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 24px;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    nav a:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    nav a.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .badge-container {
      position: relative;
    }

    sl-badge {
      position: absolute;
      top: -8px;
      right: -8px;
    }

    sl-button::part(base) {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    sl-button::part(base):hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 600px) {
      nav a span {
        display: none;
      }

      nav a sl-icon {
        font-size: 20px;
      }

      header h1 span {
        display: none;
      }
    }

    @media (prefers-color-scheme: light) {
      header {
        background: var(--app-color-primary, #4F46E5);
      }
    }

    @media (prefers-color-scheme: dark) {
      header {
        background: var(--app-color-primary, #312E81);
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.updateUnreadCount();
    this.unsubscribe = EmailService.subscribe(() => this.updateUnreadCount());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private updateUnreadCount() {
    this.unreadCount = EmailService.getUnreadCount();
  }

  render() {
    return html`
      <header>
        <div class="header-left">
          ${this.enableBack
            ? html`
                <sl-button size="small" variant="text" href="${resolveRouterPath()}">
                  <sl-icon name="arrow-left"></sl-icon>
                </sl-button>
              `
            : null}
          <h1>
            <sl-icon class="logo-icon" name="envelope-fill"></sl-icon>
            <span>${this.title}</span>
          </h1>
        </div>

        <nav>
          <a href="${resolveRouterPath()}" class="badge-container">
            <sl-icon name="inbox"></sl-icon>
            <span>Inbox</span>
            ${this.unreadCount > 0
              ? html`<sl-badge variant="danger" pill>${this.unreadCount}</sl-badge>`
              : null}
          </a>
          <a href="${resolveRouterPath('sent')}">
            <sl-icon name="send"></sl-icon>
            <span>Sent</span>
          </a>
          <a href="${resolveRouterPath('archived')}">
            <sl-icon name="archive"></sl-icon>
            <span>Archived</span>
          </a>
          <a href="${resolveRouterPath('compose')}">
            <sl-icon name="pencil-square"></sl-icon>
            <span>Compose</span>
          </a>
        </nav>
      </header>
    `;
  }
}
