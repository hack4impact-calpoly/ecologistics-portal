/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(`signIn` as any, () => {
  cy.log(`Signing in.`);
  cy.visit("localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F", {
    auth: {
      username: "",
      password: "",
    },
  });

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      // @ts-ignore
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      //@ts-ignore
      await cy.clearCookies({ domain: window.location.domain });
      //@ts-ignore
      const res = await window.Clerk.client.signIn.create({
        identifier: Cypress.env(`test_email`),
        password: Cypress.env(`test_password`),
      });
      //@ts-ignore
      await window.Clerk.setActive({
        session: res.createdSessionId,
      });

      cy.log(`Finished Signing in.`);
    });
});
export {};

Cypress.Commands.add(`signInNewOrg` as any, () => {
  cy.log(`Signing in as new org.`); // logging our event
  cy.visit("localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F", {
    auth: {
      username: "",
      password: "",
    },
  });

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      // @ts-ignore
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      //@ts-ignore
      await cy.clearCookies({ domain: window.location.domain });
      //@ts-ignore
      const res = await window.Clerk.client.signIn.create({
        identifier: Cypress.env(`test_email_fresh`),
        password: Cypress.env(`test_password_fresh`),
      });
      //@ts-ignore
      await window.Clerk.setActive({
        session: res.createdSessionId,
      });
      cy.log(`Finished Signing in as a new org.`);
    });
});
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      signIn(): Chainable<JQuery<HTMLElement>>;
      signInNewOrg(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
