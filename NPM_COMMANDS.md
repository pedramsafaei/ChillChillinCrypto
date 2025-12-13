# NPM Commands Reference

## 📋 Available Commands

### Development Commands

#### Start Development Server
```bash
npm start
```
- Starts the development server
- Opens browser at http://localhost:3000
- Hot reload enabled
- Source maps enabled

#### Build for Production
```bash
npm run build
```
- Creates optimized production build
- Output in `build/` directory
- Minified and optimized
- Source maps generated

### Testing Commands

#### Run All Tests
```bash
npm test
```
- Runs all unit tests
- Interactive watch mode
- Shows test results

#### Run Tests with Coverage
```bash
npm test -- --coverage
```
- Generates coverage report
- Coverage threshold: 80%
- Output in `coverage/` directory

#### Run Tests Once (CI Mode)
```bash
npm test -- --watchAll=false
```
- Single test run
- No watch mode
- Good for CI/CD

#### Watch Mode for Tests
```bash
npm run test:watch
```
- Interactive watch mode
- Re-runs on file changes

### Code Quality Commands

#### Run ESLint
```bash
npm run lint
```
- Checks all .js and .jsx files
- Reports errors and warnings

#### Fix ESLint Issues
```bash
npm run lint:fix
```
- Automatically fixes fixable issues
- Reports remaining issues

#### Format Code with Prettier
```bash
npm run format
```
- Formats all code files
- Applies consistent style

### Cypress E2E Testing

#### Open Cypress (Interactive)
```bash
npm run cypress:open
```
- Opens Cypress UI
- Run tests interactively
- Debugging tools available

#### Run Cypress (Headless)
```bash
npm run cypress:run
```
- Runs tests in headless mode
- Good for CI/CD
- Generates screenshots/videos

### Git Hooks

#### Prepare Husky
```bash
npm run prepare
```
- Initializes Husky
- Sets up git hooks
- Runs automatically after install

### Build Analysis

#### Analyze Bundle Size
```bash
npm run build
# Then check build/static/js/*.js sizes
```

## 🔍 Command Details

### npm start

**What it does:**
- Starts webpack dev server
- Compiles React code
- Enables hot module replacement
- Opens default browser

**Environment:**
- NODE_ENV=development
- Source maps enabled
- Verbose error messages

**Port:**
- Default: 3000
- Custom: `PORT=3001 npm start`

### npm run build

**What it does:**
- Creates production bundle
- Minifies JavaScript
- Optimizes CSS
- Generates source maps
- Creates asset manifest

**Output:**
```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
├── manifest.json
└── ...
```

**Environment Variables:**
- CI=false (ignore warnings)
- NODE_ENV=production

### npm test

**Features:**
- Jest test runner
- React Testing Library
- Coverage collection
- Watch mode

**Options:**
```bash
# Run specific test file
npm test -- CryptoCard

# Update snapshots
npm test -- -u

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run without watch
npm test -- --watchAll=false
```

### npm run lint

**Checks:**
- ESLint rules
- React best practices
- JSX accessibility
- Prettier formatting

**Exit Codes:**
- 0: No issues
- 1: Issues found

### npm run cypress:open

**Features:**
- Interactive test runner
- Visual debugging
- Time travel debugging
- Network inspection

**Usage:**
1. Run `npm start` first
2. Run `npm run cypress:open`
3. Select test to run

### npm run cypress:run

**Features:**
- Headless browser
- Video recording
- Screenshot capture
- CI/CD friendly

**Output:**
```
cypress/
├── videos/
│   └── *.mp4
└── screenshots/
    └── *.png
```

## 🎯 Common Workflows

### Starting Development
```bash
# Install dependencies (first time)
npm install

# Start development server
npm start
```

### Before Committing
```bash
# Run linter
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Git add and commit (hooks run automatically)
git add .
git commit -m "Your message"
```

### Running Tests
```bash
# Watch mode (during development)
npm test

# Coverage check (before PR)
npm test -- --coverage

# E2E tests (after UI changes)
npm run cypress:open
```

### Building for Production
```bash
# Create production build
npm run build

# Test production build locally
npx serve -s build
```

### CI/CD Pipeline
```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Build application
npm run build
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Test Issues
```bash
# Clear Jest cache
npm test -- --clearCache

# Update snapshots
npm test -- -u
```

### Build Issues
```bash
# Clean build directory
rm -rf build

# Rebuild
npm run build
```

## 📊 Performance Tips

### Development
- Keep DevTools open for monitoring
- Use React DevTools extension
- Check bundle size regularly

### Production
- Analyze build output
- Check network waterfall
- Monitor bundle sizes

## 🎨 Custom Scripts

You can add custom scripts to package.json:

```json
{
  "scripts": {
    "analyze": "source-map-explorer 'build/static/js/*.js'",
    "start:prod": "npm run build && serve -s build",
    "test:ci": "npm test -- --coverage --watchAll=false",
    "deploy": "npm run build && echo 'Deploy to server'"
  }
}
```

## 📚 Script Combinations

### Full Check
```bash
npm run lint && npm test -- --coverage && npm run build
```

### Quick Check
```bash
npm run lint:fix && npm test
```

### CI Pipeline
```bash
npm ci && npm run lint && npm test -- --coverage && npm run build
```

## 💡 Tips

1. **Use npm ci in CI/CD** - Faster and more reliable
2. **Run tests before committing** - Catch issues early
3. **Use lint:fix regularly** - Keep code clean
4. **Check coverage reports** - Maintain quality
5. **Build locally before deploying** - Verify production builds

## 🆘 Help Commands

```bash
# Show npm help
npm help

# Show script help
npm run

# Show package info
npm info <package-name>

# Check outdated packages
npm outdated

# Update packages
npm update
```

---

For more information, see [package.json](./package.json) for all available scripts.
