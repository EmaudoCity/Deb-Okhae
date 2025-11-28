import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles } from './about-styles';

import { styles as sharedStyles } from '../../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('app-about')
export class AppAbout extends LitElement {
  static styles = [
    sharedStyles,
    styles
  ]

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>

      <main>
        <h2>About CS50 Mail</h2>

        <sl-card>
          <h2>CS50 Final Project</h2>

          <p>
            <strong>CS50 Mail</strong> is a Progressive Web Application (PWA) that simulates 
            a modern email client. This project was created as a final project for 
            <a href="https://cs50.harvard.edu/">Harvard's CS50</a> course.
          </p>

          <h3>Features</h3>
          <ul>
            <li><strong>Inbox</strong> - View and read incoming emails</li>
            <li><strong>Compose</strong> - Write and send new emails</li>
            <li><strong>Sent</strong> - View emails you've sent</li>
            <li><strong>Archive</strong> - Archive emails for later</li>
            <li><strong>Reply</strong> - Reply to received emails</li>
            <li><strong>Read/Unread</strong> - Mark emails as read or unread</li>
          </ul>

          <h3>Technology Stack</h3>
          <ul>
            <li><a href="https://www.typescriptlang.org/">TypeScript</a> - Type-safe JavaScript</li>
            <li><a href="https://lit.dev">Lit</a> - Web Components library</li>
            <li><a href="https://shoelace.style/">Shoelace</a> - UI component library</li>
            <li><a href="https://vitejs.dev/">Vite</a> - Build tool</li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">PWA</a> - Progressive Web App</li>
          </ul>

          <h3>About CS50</h3>
          <p>
            CS50 is Harvard University's introduction to the intellectual enterprises 
            of computer science and the art of programming. The course teaches students 
            how to think algorithmically and solve problems efficiently.
          </p>

          <p>
            This was CS50!
          </p>
        </sl-card>
      </main>
    `;
  }
}
