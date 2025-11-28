import { css } from 'lit';

// CS50 Final Project - Email Application
// These styles can be imported from any component
export const styles = css`
  @media (min-width: 1000px) {
    sl-card {
      max-width: 70vw;
    }
  }

  main {
    padding: 24px 16px;
    min-height: calc(100vh - 60px);
  }

  h1,
  h2,
  h3 {
    margin-top: 0;
  }

  sl-button::part(base) {
    font-weight: 500;
  }
`;