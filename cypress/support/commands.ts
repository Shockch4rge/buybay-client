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

Cypress.Commands.add("login", (email = "john@gmail.com", password = "password123") => {
    cy.visit("/");

    cy.intercept({
        method: "POST",
        url: `/api/auth/login`,
    })
        .as("login");

    cy.contains("Login")
        .click();
    cy.get("input[name=email]")
        .type(email);
    cy.get("input[name=password]")
        .type(password);

    cy.get("button[type=submit]")
        .contains("Login")
        .click();

    cy.wait("@login")
        .its("response.body")
        .should("have.any.keys", "token", "user");
});

Cypress.Commands.add("logout", () => {
    cy.login();
    cy.intercept({
        method: "POST",
        url: `/api/auth/logout`,
    }).as("logout");
    cy.get("button").contains("Account").click();
    cy.get("button").contains("Log out").click();

    cy.wait("@logout")
        .its("response.statusCode")
        .should("eq", 200);

    cy.window()
        .its("store")
        .invoke("getState")
        .its("_auth")
        .its("token")
        .should("be.null");
});

export {};