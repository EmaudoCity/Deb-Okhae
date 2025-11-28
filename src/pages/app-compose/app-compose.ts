import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { EmailService, currentUser } from '../../services/email-service';
import { resolveRouterPath, router } from '../../router';
import { styles as sharedStyles } from '../../styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

@customElement('app-compose')
export class AppCompose extends LitElement {
  @state() private to = '';
  @state() private subject = '';
  @state() private body = '';
  @state() private sending = false;
  @state() private error = '';
  @state() private success = false;

  static styles = [
    sharedStyles,
    css`
      .compose-container {
        max-width: 700px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .page-title h1 {
        margin: 0;
        font-size: 24px;
      }

      sl-card {
        width: 100%;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 14px;
        color: var(--sl-color-neutral-700);
      }

      sl-input,
      sl-textarea {
        width: 100%;
      }

      sl-textarea::part(textarea) {
        min-height: 250px;
        font-family: inherit;
      }

      .from-field {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: var(--sl-color-neutral-100);
        border-radius: 4px;
        font-size: 14px;
        color: var(--sl-color-neutral-600);
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }

      sl-alert {
        margin-bottom: 16px;
      }

      @media (prefers-color-scheme: dark) {
        .form-group label {
          color: var(--sl-color-neutral-300);
        }

        .from-field {
          background: var(--sl-color-neutral-700);
          color: var(--sl-color-neutral-300);
        }
      }
    `,
  ];

  private handleSubmit(e: Event) {
    e.preventDefault();

    // Validate fields
    if (!this.to.trim()) {
      this.error = 'Please enter a recipient email address';
      return;
    }

    if (!this.subject.trim()) {
      this.error = 'Please enter a subject';
      return;
    }

    if (!this.body.trim()) {
      this.error = 'Please enter a message body';
      return;
    }

    this.error = '';
    this.sending = true;

    // Simulate sending delay
    setTimeout(() => {
      EmailService.sendEmail(this.to, this.subject, this.body);
      this.success = true;
      this.sending = false;

      // Navigate to sent page after a short delay
      setTimeout(() => {
        router.navigate(resolveRouterPath('sent'));
      }, 1500);
    }, 500);
  }

  private handleInput(field: 'to' | 'subject' | 'body', e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this[field] = target.value;
    this.error = '';
  }

  render() {
    return html`
      <app-header title="CS50 Mail" ?enableBack="${true}"></app-header>

      <main>
        <div class="compose-container">
          <div class="page-header">
            <div class="page-title">
              <h1>Compose Email</h1>
            </div>
          </div>

          ${this.success
            ? html`
                <sl-alert variant="success" open>
                  <sl-icon slot="icon" name="check-circle"></sl-icon>
                  Email sent successfully! Redirecting...
                </sl-alert>
              `
            : null}

          ${this.error
            ? html`
                <sl-alert variant="danger" open>
                  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                  ${this.error}
                </sl-alert>
              `
            : null}

          <sl-card>
            <form @submit="${this.handleSubmit}">
              <div class="form-group">
                <label>From</label>
                <div class="from-field">${currentUser}</div>
              </div>

              <div class="form-group">
                <label for="to">To</label>
                <sl-input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  .value="${this.to}"
                  @sl-input="${(e: Event) => this.handleInput('to', e)}"
                  ?disabled="${this.sending || this.success}"
                ></sl-input>
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <sl-input
                  id="subject"
                  type="text"
                  placeholder="Email subject"
                  .value="${this.subject}"
                  @sl-input="${(e: Event) => this.handleInput('subject', e)}"
                  ?disabled="${this.sending || this.success}"
                ></sl-input>
              </div>

              <div class="form-group">
                <label for="body">Message</label>
                <sl-textarea
                  id="body"
                  placeholder="Write your message here..."
                  .value="${this.body}"
                  @sl-input="${(e: Event) => this.handleInput('body', e)}"
                  ?disabled="${this.sending || this.success}"
                  resize="auto"
                ></sl-textarea>
              </div>

              <div class="actions">
                <sl-button
                  type="submit"
                  variant="primary"
                  ?loading="${this.sending}"
                  ?disabled="${this.success}"
                >
                  <sl-icon slot="prefix" name="send"></sl-icon>
                  Send Email
                </sl-button>
                <sl-button
                  variant="neutral"
                  href="${resolveRouterPath()}"
                  ?disabled="${this.sending || this.success}"
                >
                  Cancel
                </sl-button>
              </div>
            </form>
          </sl-card>
        </div>
      </main>
    `;
  }
}
