import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { EmailService, Email } from '../../services/email-service';
import { resolveRouterPath } from '../../router';
import { styles as sharedStyles } from '../../styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('app-archived')
export class AppArchived extends LitElement {
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
        text-decoration: none;
        color: inherit;
      }

      .email-item:hover {
        background: var(--sl-color-neutral-50);
        border-color: var(--sl-color-primary-500);
      }

      .email-icon {
        margin-right: 12px;
        color: var(--sl-color-neutral-500);
      }

      .email-content {
        flex: 1;
        min-width: 0;
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
    this.emails = EmailService.getArchived();
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  private getPreview(body: string): string {
    return body.split('\n').filter((line) => line.trim())[0]?.substring(0, 100) || '';
  }

  render() {
    return html`
      <app-header title="CS50 Mail" ?enableBack="${true}"></app-header>

      <main>
        <div class="page-header">
          <div class="page-title">
            <h1>Archived</h1>
            <sl-badge variant="neutral">${this.emails.length} emails</sl-badge>
          </div>
          <sl-button variant="primary" href="${resolveRouterPath('compose')}">
            <sl-icon slot="prefix" name="pencil-square"></sl-icon>
            Compose
          </sl-button>
        </div>

        ${this.emails.length === 0
          ? html`
              <div class="empty-state">
                <sl-icon name="archive"></sl-icon>
                <p>No archived emails</p>
              </div>
            `
          : html`
              <div class="email-list">
                ${this.emails.map(
                  (email) => html`
                    <a class="email-item" href="${resolveRouterPath(`email/${email.id}`)}">
                      <sl-icon class="email-icon" name="archive"></sl-icon>
                      <div class="email-content">
                        <div class="email-header">
                          <span class="email-from">${email.from}</span>
                          <span class="email-time">${this.formatTime(email.timestamp)}</span>
                        </div>
                        <div class="email-subject">${email.subject}</div>
                        <div class="email-preview">${this.getPreview(email.body)}</div>
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
