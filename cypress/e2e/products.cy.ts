describe("products", () => {
    before(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("PRODUCTS_API")}/reset`,
        });
    });

    beforeEach(() => {
        cy.login();
    });

    it("user can create a product", () => {
        cy.intercept({
            method: "POST",
            url: `/api/products`,
        }).as("createProduct");

        cy.get("button").contains("Sell").click();

        cy.get("input[name=name]").type("Bread");
        cy.get("textarea[name=description]").type("Freshly baked bread");

        cy.get("#categories")
            .type("Food")
            .get(".react-select__menu")
            .find(".react-select__option")
            .eq(0)
            .click();
        cy.get("#categories")
            .type("Pastry")
            .get(".react-select__menu")
            .find(".react-select__option")
            .eq(0)
            .click();

        cy.get("input[name=price]").type("3");
        cy.get("input[name=quantity]").type("10");

        cy.get("input[name=images]").selectFile([
            "cypress/fixtures/images/bread.jpg",
            "cypress/fixtures/images/bread2.jpg",
        ], { force: true });
        // wait for images to compress
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get("form[name=createProduct]").submit();

        cy.wait("@createProduct")
            .its("response.body")
            .should("have.any.keys", "product");
    });

    it("user can edit products", () => {
        cy.intercept({
            method: "POST",
            url: `/api/products/*`,
        }).as("updateProduct");

        cy.get("button").contains("Account").click();
        cy.contains("Products").click();
        cy.get("button").contains("View Product").click();
        cy.get("button").contains("Edit Details").click();

        cy.get("#edit-product-name")
            .should("contain.value", "Bread")
            .clear()
            .type("Wholegrain Bread");
        cy.get("#edit-product-description")
            .should("contain.value", "Freshly baked bread")
            .clear()
            .type("Freshly baked bread made with wholegrain wheat");

        cy.get("#edit-categories")
            .click()
            .get(".react-select__clear-indicator")
            .click();

        cy.get("#edit-categories")
            .type("Bread")
            .get(".react-select__menu")
            .find(".react-select__option")
            .eq(0)
            .click();
        cy.get("#edit-categories")
            .type("Baking")
            .get(".react-select__menu")
            .find(".react-select__option")
            .eq(0)
            .click();
        cy.get("#edit-categories")
            .type("Food")
            .get(".react-select__menu")
            .find(".react-select__option")
            .eq(0)
            .click();

        cy.get("#edit-product-price")
            .should("contain.value", 3)
            .clear()
            .type("3");
        cy.get("#edit-product-quantity")
            .should("contain.value", 10)
            .clear()
            .type("5");

        cy.get("input[type=file]").selectFile([
            "cypress/fixtures/images/bread.jpg",
            "cypress/fixtures/images/bread2.jpg",
        ], { force: true });

        // wait for images to compress
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get("form[name=updateProduct]").submit();

        cy.wait("@updateProduct")
            .its("response.body")
            .should("have.any.keys", "product");
    });

    it("user can delete products", () => {
        cy.intercept({
            method: "DELETE",
            url: `/api/products/*`,
        }).as("deleteProduct");

        cy.get("button").contains("Account").click();
        cy.contains("Products").click();
        cy.get("button").contains("View Product").click();
        cy.get("button").contains("Edit Details").click();
        cy.get("button").contains("Delete Product").click();

        cy.get("#delete-product-btn").click();

        cy.wait("@deleteProduct")
            .its("response.statusCode")
            .should("eq", 200);
    });
});

export {};