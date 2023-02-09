describe("product reviews", () => {
    before(() => {
        cy.request({
            method: "POST",
            url: `${Cypress.env("PRODUCT_REVIEWS_API")}/reset`,
        });
    });

    it("user can create, edit, and delete a product review", () => {
        cy.login();

        cy.intercept({
            method: "POST",
            url: `/api/product-reviews`,
        }).as("createReview");
        cy.intercept({
            method: "PUT",
            url: `/api/product-reviews/*`,
        }).as("editReview");
        cy.intercept({
            method: "DELETE",
            url: "/api/product-reviews/*",
        }).as("deleteReview");

        cy.get("button").contains("View Details").click();
        cy.get("button").contains("Write a review").click();

        cy.get("input[name=title]")
            .type("E2E Review");
        cy.get("textarea[name=description]")
            .type("This is an E2E review written by Cypress");
        cy.get(".review-rating-slider-thumb")
            .should("have.attr", "aria-valuenow", 1)
            .type("{rightArrow}".repeat(2));

        cy.get("form[name=createReview]").submit();
        cy.wait("@createReview")
            .its("response.body")
            .should("have.any.keys", "review");

        cy.get("button").contains("Edit Review").click();

        cy.get("input[name=title]")
            .clear()
            .type("E2E Review Edited");
        cy.get("textarea[name=description]")
            .clear()
            .type("This is an edited E2E review written by Cypress");
        cy.get(".review-rating-slider-thumb")
            .should("have.attr", "aria-valuenow", 3)
            .type("{rightArrow}");

        cy.get("form[name=editReview]").submit();

        cy.wait("@editReview")
            .its("response.body")
            .should("have.any.keys", "review");

        cy.get("button").contains("Edit Review").click();
        cy.get("button").contains("Delete Review").click();
        cy.get("button[name=confirmReviewDelete]").contains("Delete").click();

        cy.wait("@deleteReview");
    });
});

export {};