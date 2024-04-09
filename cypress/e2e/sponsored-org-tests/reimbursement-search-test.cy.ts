describe("Signed in", () => {
  beforeEach(() => {
    cy.session("signed-in", () => {
      cy.signIn();
    });
  });

  it("navigate to the dashboard", () => {
    // open dashboard page
    cy.visit("http://localhost:3000/setup-organization", {
      failOnStatusCode: false,
    });
    cy.get('button[value="bell"]').click();
    // check h1 says signed in
    // cy.get("h1").contains("Signed in");
  });
});
