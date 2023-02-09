describe("cart", () => {
    beforeEach(() => {
        cy.login();
    });

    it("user adds a product of quantity 3 to the cart", () => {
        cy.get("button")
            .contains("View Details")
            .first()
            .click();

        cy.get("#increment-quantity-btn")
            .click()
            .click();

        cy.get("button").contains("Add to Cart").click();
        cy.get("button").contains("Cart").click();
    });

    it("user removes a product from the cart", () => {
        cy.get("button")
            .contains("View Details")
            .first()
            .click();

        cy.get("#increment-quantity-btn").click();

        cy.get("button").contains("Add to Cart").click();
        cy.get("button").contains("Cart").click();

        cy.get(".decrement-cart-quantity").first().click();
        cy.get(".remove-from-cart").first().click();
        cy.get("button").contains("Clear").click();
    });
});

export {};