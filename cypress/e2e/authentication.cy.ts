describe("authentication", () => {
    it("user can register for an account", () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("USERS_API")}/auth/reset`,
        });
        cy.visit("/");

        cy.intercept({
            method: "POST",
            url: `/api/auth/register`,
        }).as("registerResponse");

        cy.get("button").contains("Login").click();
        cy.contains("Create Account").click();

        cy.get("input[name=avatar]").selectFile("cypress/fixtures/images/avatar.jpg");
        cy.get("input[name=name]").type("John");
        cy.get("input[name=email]").type("john@gmail.com");
        cy.get("input[name=password]").type("dddddddd");
        cy.get("input[name=confirmPassword]").type("dddddddd");

        cy.get("form").submit();

        cy.wait("@registerResponse")
            .its("response.body")
            .should("have.any.keys", "token", "user");
    });

    it("user can login", () => {
        cy.login("john@gmail.com", "dddddddd");
    });

    it("user can logout", () => {
        cy.logout();
    });

    it("user can delete their account", () => {
        cy.login("john@gmail.com", "dddddddd");
        cy.get("button").contains("Account").click();
        cy.get("button").contains("Delete Account").click();
        cy.get("input[type=password]").type("dddddddd");
        cy.get("form[name=deleteAccount]").submit();

        cy.window()
            .its("store")
            .invoke("getState")
            .its("_auth")
            .should("be.null");
    });
});

export {};