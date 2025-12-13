describe('Portfolio Management', () => {
  beforeEach(() => {
    cy.visit('/portfolio');
  });

  it('should load the portfolio page', () => {
    cy.contains('My Portfolio').should('be.visible');
  });

  it('should display add holdings button', () => {
    cy.contains('Add Holdings').should('be.visible');
  });

  it('should open add holdings modal', () => {
    cy.contains('Add Holdings').click();
    cy.get('.ant-modal').should('be.visible');
    cy.contains('Add Holdings').should('be.visible');
  });

  it('should add a new holding', () => {
    cy.contains('Add Holdings').click();
    
    cy.get('input[id="coinName"]').type('Bitcoin');
    cy.get('input[id="amount"]').type('1');
    cy.get('input[id="purchasePrice"]').type('50000');
    
    cy.contains('button', 'Add').click();
    cy.contains('Bitcoin').should('be.visible');
  });

  it('should display portfolio statistics', () => {
    cy.contains('Total Investment').should('be.visible');
    cy.contains('Current Value').should('be.visible');
    cy.contains('Profit/Loss').should('be.visible');
  });
});
