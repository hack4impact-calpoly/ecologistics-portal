describe("Signed in", () => {
  beforeEach(() => {
    cy.session("signed-in", () => {
      cy.signIn();
    });
  });

  it("navigate to the sponsored orgs", () => {
    // open dashboard page
    cy.visit("http://localhost:3000/setup-organization", {
      failOnStatusCode: false,
    });
    cy.get(".cursor-pointer").click();
    cy.contains("Sponsored Organizations").click();
    cy.url().should("include", "/sponsored-organizations");
  });
});
