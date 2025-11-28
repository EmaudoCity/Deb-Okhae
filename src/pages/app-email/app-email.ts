import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { EmailService, Email, currentUser } from '../../services/email-service';
import { resolveRouterPath, router } from '../../router';
import { styles as sharedStyles } from '../../styles/shared-styles';
import { formatFullTimestamp } from '../../utils/email-utils';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';

@customElement('app-email')
export class AppEmail extends LitElement {
  @property({ type: String }) emailId = '';
  @state() private email: Email | undefined;
  @state() private showReply = false;
  @state() private replyBody = '';
  @state() private sending = false;

  static styles = [
    sharedStyles,
    css`
      .email-container {
        max-width: 800px;
        margin: 0 auto;
      }

      .email-header {
        margin-bottom: 24px;
      }

      .email-subject {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: var(--sl-color-neutral-900);
      }

      .email-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 14px;
      }

      .meta-row {
        display: flex;
        gap: 8px;
      }

      .meta-label {
        color: var(--sl-color-neutral-500);
        min-width: 60px;
      }

      .meta-value {
        color: var(--sl-color-neutral-800);
        font-weight: 500;
      }

      .email-timestamp {
        color: var(--sl-color-neutral-500);
        font-size: 13px;
        margin-top: 8px;
      }

      sl-card {
        width: 100%;
      }

      .email-body {
        white-space: pre-wrap;
        line-height: 1.6;
        color: var(--sl-color-neutral-800);
        font-size: 15px;
      }

      .email-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        flex-wrap: wrap;
      }

      .reply-section {
        margin-top: 24px;
      }

      .reply-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .reply-actions {
        display: flex;
        gap: 12px;
      }

      sl-textarea::part(textarea) {
        min-height: 150px;
      }

      .not-found {
        text-align: center;
        padding: 48px;
        color: var(--sl-color-neutral-500);
      }

      .not-found sl-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--sl-color-primary-600);
        text-decoration: none;
        margin-bottom: 16px;
        font-size: 14px;
      }

      .back-link:hover {
        text-decoration: underline;
      }

      @media (prefers-color-scheme: dark) {
        .email-subject {
          color: var(--sl-color-neutral-100);
        }

        .meta-value,
        .email-body {
          color: var(--sl-color-neutral-200);
        }
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.loadEmail();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('emailId')) {
      this.loadEmail();
    }
  }

  private loadEmail() {
    if (this.emailId) {
      this.email = EmailService.getEmailById(this.emailId);
      if (this.email && this.email.to === currentUser && !this.email.read) {
        EmailService.markAsRead(this.emailId);
      }
    }
  }

  private toggleReply() {
    this.showReply = !this.showReply;
    if (this.showReply) {
      this.replyBody = '';
    }
  }

  private handleReplyInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.replyBody = target.value;
  }

  private sendReply() {
    const email = this.email;
    if (!email || !this.replyBody.trim()) return;

    this.sending = true;

    setTimeout(() => {
      EmailService.replyToEmail(email, this.replyBody);
      this.sending = false;
      this.showReply = false;
      this.replyBody = '';
      router.navigate(resolveRouterPath('sent'));
    }, 500);
  }

  private handleArchive() {
    const email = this.email;
    if (!email) return;
    
    if (email.archived) {
      EmailService.unarchiveEmail(email.id);
      router.navigate(resolveRouterPath());
    } else {
      EmailService.archiveEmail(email.id);
      router.navigate(resolveRouterPath('archived'));
    }
  }

  private handleMarkUnread() {
    const email = this.email;
    if (!email) return;
    EmailService.markAsUnread(email.id);
    router.navigate(resolveRouterPath());
  }

  render() {
    if (!this.email) {
      return html`
        <app-header title="CS50 Mail" ?enableBack="${true}"></app-header>
        <main>
          <div class="not-found">
            <sl-icon name="envelope-x"></sl-icon>
            <h2>Email Not Found</h2>
            <p>The email you're looking for doesn't exist or has been deleted.</p>
            <sl-button variant="primary" href="${resolveRouterPath()}">
              <sl-icon slot="prefix" name="arrow-left"></sl-icon>
              Back to Inbox
            </sl-button>
          </div>
        </main>
      `;
    }

    const isSentEmail = this.email.from === currentUser;

    return html`
      <app-header title="CS50 Mail" ?enableBack="${true}"></app-header>

      <main>
        <div class="email-container">
          <a class="back-link" href="${resolveRouterPath(isSentEmail ? 'sent' : '')}">
            <sl-icon name="arrow-left"></sl-icon>
            Back to ${isSentEmail ? 'Sent' : 'Inbox'}
          </a>

          <div class="email-header">
            <h1 class="email-subject">${this.email.subject}</h1>
            <div class="email-meta">
              <div class="meta-row">
                <span class="meta-label">From:</span>
                <span class="meta-value">${this.email.from}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">To:</span>
                <span class="meta-value">${this.email.to}</span>
              </div>
              <div class="email-timestamp">
                ${formatFullTimestamp(this.email.timestamp)}
              </div>
            </div>
          </div>

          <sl-card>
            <div class="email-body">${this.email.body}</div>

            <div class="email-actions">
              ${!isSentEmail
                ? html`
                    <sl-button variant="primary" @click="${this.toggleReply}">
                      <sl-icon slot="prefix" name="reply"></sl-icon>
                      ${this.showReply ? 'Cancel Reply' : 'Reply'}
                    </sl-button>
                    <sl-button variant="neutral" @click="${this.handleArchive}">
                      <sl-icon slot="prefix" name="archive"></sl-icon>
                      ${this.email.archived ? 'Unarchive' : 'Archive'}
                    </sl-button>
                    <sl-button variant="neutral" @click="${this.handleMarkUnread}">
                      <sl-icon slot="prefix" name="envelope"></sl-icon>
                      Mark as Unread
                    </sl-button>
                  `
                : null}
            </div>

            ${this.showReply
              ? html`
                  <sl-divider></sl-divider>
                  <div class="reply-section">
                    <h3>Reply to ${this.email.from}</h3>
                    <div class="reply-form">
                      <sl-textarea
                        placeholder="Write your reply..."
                        .value="${this.replyBody}"
                        @sl-input="${this.handleReplyInput}"
                        ?disabled="${this.sending}"
                        resize="auto"
                      ></sl-textarea>
                      <div class="reply-actions">
                        <sl-button
                          variant="primary"
                          @click="${this.sendReply}"
                          ?loading="${this.sending}"
                          ?disabled="${!this.replyBody.trim()}"
                        >
                          <sl-icon slot="prefix" name="send"></sl-icon>
                          Send Reply
                        </sl-button>
                      </div>
                    </div>
                  </div>
                `
              : null}
          </sl-card>
        </div>
      </main>
    `;
  }
}
