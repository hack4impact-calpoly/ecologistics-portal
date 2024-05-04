describe("Signed in fresh", () => {
  beforeEach(() => {
    cy.session("signed-in", () => {
      // the "" argument is to see if this sesssion has already been defined, if it hasen't it will run the funciton and chache it under that name.
      cy.signInNewOrg();
    });
  });

  it("passes; ensure setup-org is rendered properly", () => {
    // open dashboard page
    cy.visit("http://localhost:3000/setup-organization", {
      failOnStatusCode: false,
    });
    cy.get("Form").should("exist");
    cy.get("[name='description']").should("exist");
    cy.get("[name='name']").should("exist");
    cy.get("[name='website']").should("exist");

    // cy.get('data-testid="cypress-setup-name"')
    //   .should("exist")
    //   .should("have.text", "Organization Name");
    // cy.get('data-testid="cypress-setup-description"')
    //   .should("exist")
    //   .should("have.text", "Description");
  });
});
