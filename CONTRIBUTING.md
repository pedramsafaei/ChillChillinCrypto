# Contributing to ChillChillin Crypto

First off, thank you for considering contributing to ChillChillin Crypto! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for any new functionality
5. **Ensure tests pass**: `npm test`
6. **Lint your code**: `npm run lint:fix`
7. **Format your code**: `npm run format`
8. **Commit your changes** using clear commit messages
9. **Push to your fork** and submit a pull request

## Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ChillChillinCrypto.git
cd ChillChillinCrypto

# Add upstream remote
git remote add upstream https://github.com/pedramsafaei/ChillChillinCrypto.git

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

### Branch Naming Convention

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions or updates

Example: `feature/add-news-section`

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(portfolio): add export to CSV functionality

Implement CSV export for portfolio holdings to allow users
to download their data for external analysis.

Closes #123
```

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow the existing code structure and patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use PropTypes or TypeScript for type checking

### File Organization

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── store/            # Redux store and slices
│   └── slices/       # Redux slices
├── services/         # API services
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── __tests__/        # Test files
```

### CSS/Styling

- Use Ant Design components when possible
- Follow the existing CSS structure
- Use CSS-in-JS for component-specific styles
- Support both light and dark themes
- Ensure responsive design

### Testing Requirements

- Write unit tests for all new components
- Write integration tests for Redux actions/reducers
- Maintain minimum 80% code coverage
- Test edge cases and error scenarios
- Use React Testing Library for component tests

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MyComponent from './MyComponent';

test('renders component correctly', () => {
  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Code Review Process

1. All pull requests require at least one review
2. Reviewers will check:
   - Code quality and standards
   - Test coverage
   - Documentation updates
   - Performance implications
   - Security considerations
3. Address review feedback promptly
4. Once approved, maintainers will merge

## Release Process

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Getting Help

- Check existing [documentation](./docs)
- Search [existing issues](https://github.com/pedramsafaei/ChillChillinCrypto/issues)
- Ask questions in issue discussions
- Join our community channels

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for your contributions! 🎉
