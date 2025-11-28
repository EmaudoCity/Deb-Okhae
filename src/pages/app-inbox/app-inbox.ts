import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { EmailService, Email } from '../../services/email-service';
import { resolveRouterPath } from '../../router';
import { styles as sharedStyles } from '../../styles/shared-styles';
import { formatTime, getEmailPreview } from '../../utils/email-utils';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('app-inbox')
export class AppInbox extends LitElement {
  @state() private emails: Email[] = [];
  private unsubscribe?: () => void;

  static styles = [
    sharedStyles,
    css`
      .email-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 800px;
        margin: 0 auto;
      }

      .email-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: var(--sl-color-neutral-0);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid var(--sl-color-neutral-200);
      }

      .email-item:hover {
        background: var(--sl-color-neutral-50);
        border-color: var(--sl-color-primary-500);
      }

      .email-item.unread {
        background: var(--sl-color-primary-50);
        border-left: 4px solid var(--sl-color-primary-500);
      }

      .email-icon {
        margin-right: 12px;
        color: var(--sl-color-neutral-500);
      }

      .email-item.unread .email-icon {
        color: var(--sl-color-primary-600);
      }

      .email-content {
        flex: 1;
        min-width: 0;
        text-decoration: none;
        color: inherit;
      }

      .email-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .email-from {
        font-weight: 600;
        font-size: 14px;
        color: var(--sl-color-neutral-900);
      }

      .email-item.unread .email-from {
        font-weight: 700;
      }

      .email-time {
        font-size: 12px;
        color: var(--sl-color-neutral-500);
        white-space: nowrap;
      }

      .email-subject {
        font-size: 14px;
        color: var(--sl-color-neutral-700);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
      }

      .email-preview {
        font-size: 13px;
        color: var(--sl-color-neutral-500);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .page-title h1 {
        margin: 0;
        font-size: 24px;
      }

      .empty-state {
        text-align: center;
        padding: 48px;
        color: var(--sl-color-neutral-500);
      }

      .empty-state sl-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      @media (prefers-color-scheme: dark) {
        .email-item {
          background: var(--sl-color-neutral-800);
          border-color: var(--sl-color-neutral-700);
        }

        .email-item:hover {
          background: var(--sl-color-neutral-700);
        }

        .email-item.unread {
          background: var(--sl-color-primary-900);
        }

        .email-from,
        .email-subject {
          color: var(--sl-color-neutral-100);
        }
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.loadEmails();
    this.unsubscribe = EmailService.subscribe(() => this.loadEmails());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private loadEmails() {
    this.emails = EmailService.getInbox();
  }

  render() {
    const unreadCount = EmailService.getUnreadCount();

    return html`
      <app-header title="CS50 Mail"></app-header>

      <main>
        <div class="page-header">
          <div class="page-title">
            <h1>Inbox</h1>
            ${unreadCount > 0 ? html`<sl-badge variant="primary">${unreadCount} unread</sl-badge>` : null}
          </div>
          <sl-button variant="primary" href="${resolveRouterPath('compose')}">
            <sl-icon slot="prefix" name="pencil-square"></sl-icon>
            Compose
          </sl-button>
        </div>

        ${this.emails.length === 0
          ? html`
              <div class="empty-state">
                <sl-icon name="inbox"></sl-icon>
                <p>Your inbox is empty</p>
              </div>
            `
          : html`
              <div class="email-list">
                ${this.emails.map(
                  (email) => html`
                    <a
                      class="email-item ${email.read ? '' : 'unread'}"
                      href="${resolveRouterPath(`email/${email.id}`)}"
                    >
                      <sl-icon class="email-icon" name="${email.read ? 'envelope-open' : 'envelope-fill'}"></sl-icon>
                      <div class="email-content">
                        <div class="email-header">
                          <span class="email-from">${email.from}</span>
                          <span class="email-time">${formatTime(email.timestamp)}</span>
                        </div>
                        <div class="email-subject">${email.subject}</div>
                        <div class="email-preview">${getEmailPreview(email.body)}</div>
                      </div>
                    </a>
                  `
                )}
              </div>
            `}
      </main>
    `;
  }
}
