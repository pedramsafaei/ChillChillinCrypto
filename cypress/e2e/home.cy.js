describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page', () => {
    cy.contains('Global Cryptocurrency Market Overview').should('be.visible');
  });

  it('should display global stats', () => {
    cy.get('[data-testid="global-stats"]').should('exist');
  });

  it('should display trending cryptocurrencies', () => {
    cy.contains('Trending Cryptocurrencies').should('be.visible');
  });

  it('should display top 10 cryptocurrencies', () => {
    cy.contains('Top 10 Cryptocurrencies').should('be.visible');
  });

  it('should navigate to cryptocurrency details', () => {
    cy.get('[data-testid="crypto-card"]').first().click();
    cy.url().should('include', '/crypto/');
  });
});
