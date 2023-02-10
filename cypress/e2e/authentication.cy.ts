import { AppRoutes } from "../../src/util/routes";

describe("authentication", () => {
    before(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("USERS_API")}/auth/reset`,
        });
    });

    it("user attempts to login with invalid credentials", () => {
        cy.visit(AppRoutes.Landing);

        cy.intercept({
            method: "POST",
            url: `/api/auth/login`,
        }).as("login");

        cy.get("button").contains("Login").click();
        cy.get("input[name=email]").type("wrong@gmail.com");
        cy.get("input[name=password]").type("wrongpassword");

        cy.get("form").submit();

        cy.wait("@login")
            .its("response")
            .should(response => {
                expect(response).to.exist;
                expect(response!.statusCode).to.equal(401);
                expect(response!.body).to.have.property("message", "Invalid credentials.");
            });
    });

    it("user can login", () => {
        cy.login();
    });

    it("user can logout", () => {
        cy.logout();
    });

    it("user can update their account", () => {
        cy.login();
        cy.get("button").contains("Account").click();

        cy.intercept({
            method: "POST",
            url: `/api/users/*`,
        }).as("updateUser");

        cy.get("input[name=avatar]").selectFile(
            "cypress/fixtures/images/updated_avatar.jpg",
            { force: true },
        );
        cy.get("input[name=name]").clear().type("John Doe");
        cy.get("input[name=email]").clear().type("john@gmail.com");

        cy.get("button").contains("Save Changes").click();

        cy.wait("@updateUser")
            .its("response.body")
            .should("have.any.keys", "user");
    });

    it("user can delete their account", () => {
        cy.login();
        cy.intercept({
            method: "DELETE",
            url: `/api/auth/destroy`,
        }).as("deleteUser");
        cy.get("button").contains("Account").click();
        cy.get("button").contains("Delete Account").click();
        cy.get("input[type=password]").type("password123");
        cy.get("form[name=deleteAccount]").submit();

        cy.wait("@deleteUser")
            .its("response.statusCode")
            .should("equal", 200);

        cy.window()
            .its("store")
            .invoke("getState")
            .its("_auth")
            .its("token")
            .should("be.null");

    });

    it("user can register for an account", () => {
        cy.visit(AppRoutes.Landing);

        cy.intercept({
            method: "POST",
            url: `/api/auth/register`,
        }).as("registerUser");

        cy.get("button").contains("Login").click();
        cy.contains("Create Account").click();

        cy.get("input[name=avatar]").selectFile("cypress/fixtures/images/avatar.jpg");
        cy.get("input[name=name]").type("John");
        cy.get("input[name=email]").type("john@gmail.com");
        cy.get("input[name=password]").type("password123");
        cy.get("input[name=confirmPassword]").type("password123");

        cy.get("form").submit();

        cy.wait("@registerUser")
            .its("response")
            .should(response => {
                expect(response).to.exist;
                expect(response!.statusCode).to.equal(200);
                expect(response!.body).to.have.property("user");
                expect(response!.body).to.have.property("token");
            });
    });
});

export {};