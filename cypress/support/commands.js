// Custom commands for Cypress

// Login command example
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Clear localStorage
Cypress.Commands.add('clearStorage', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Wait for API response
Cypress.Commands.add('waitForApiResponse', (alias) => {
  cy.wait(alias);
});

// Add to favorites
Cypress.Commands.add('addToFavorites', (coinId) => {
  cy.get(`[data-coin-id="${coinId}"]`).find('[data-testid="favorite-button"]').click();
});
