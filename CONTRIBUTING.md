# Contributing to OneHandle

First off, thank you for considering contributing to OneHandle! It's people like you that make OneHandle such a great tool. This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Chrome browser for testing

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Onehandle.git
   cd Onehandle
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/brusooo/Onehandle.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (Chrome version, OS, extension version)

### Suggesting Features

Feature suggestions are welcome! Please:

- **Use a clear title** describing the feature
- **Provide detailed explanation** of the feature and its benefits
- **Explain why this feature would be useful** to most users
- **Consider privacy implications** (OneHandle is privacy-first!)

### Code Contributions

We love code contributions! Here are areas where you can help:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance improvements
- ♿ Accessibility improvements

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch first
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feat/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features (e.g., `feature/tab-groups`)
- `fix/` - Bug fixes (e.g., `fix/search-crash`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/storage-utils`)
- `style/` - UI/styling changes (e.g., `style/dark-mode-improvements`)

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep commits focused and atomic

### 3. Test Your Changes

**Build and test the extension:**

```bash
# Build the extension
npm run build

# Load the dist folder in Chrome (chrome://extensions/)
# Test all affected functionality
# Test in both light and dark modes
# Verify privacy - no external calls!
```

**Test checklist:**
- [ ] Extension loads without errors
- [ ] New feature/fix works as expected
- [ ] No console errors or warnings
- [ ] Existing features still work
- [ ] UI looks good in light/dark mode
- [ ] No performance regressions

### 4. Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# If there are conflicts, resolve them and continue
git rebase --continue
```

## 📐 Style Guidelines

### TypeScript/React

- Use **TypeScript** for all new code
- Use **functional components** with hooks
- Prefer **const** over let, avoid var
- Use **meaningful variable names**
- Add **type annotations** for function parameters and returns

**Example:**
```typescript
// Good ✅
const getFavoriteTabs = async (): Promise<ChromeTab[]> => {
  const { favorites = [] } = await chrome.storage.local.get('favorites');
  return favorites;
};

// Avoid ❌
async function getTabs() {
  let data = await chrome.storage.local.get('favorites');
  return data.favorites || [];
}
```

### CSS

- Use **CSS variables** for colors and spacing
- Follow **existing naming conventions**
- Keep styles **modular** (component-specific)
- Support **both light and dark modes**

### Code Organization

- Keep components **small and focused**
- Extract **reusable logic** into utils
- Use **descriptive file names**
- Group related files together

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
feat: add PDF export functionality
fix: resolve case-sensitive search issue
docs: update installation instructions
style: improve button hover animations
refactor: simplify favorites management
```

**Commit message best practices:**
- Use present tense ("add feature" not "added feature")
- Keep subject line under 72 characters
- Capitalize the subject line
- Don't end subject with a period
- Use body to explain *what* and *why*, not *how*

## 🔄 Pull Request Process

### Before Submitting

1. **Test thoroughly** - Ensure everything works
2. **Update documentation** - If you changed functionality
3. **Run the build** - Make sure `npm run build` succeeds
4. **Rebase on main** - Keep your PR up to date

### Submitting

1. **Push your branch** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Open a Pull Request** on GitHub with:
   - **Clear title** following commit conventions
   - **Description** of changes made
   - **Screenshots/GIFs** for UI changes
   - **Related issues** (if any) - use "Fixes #123" or "Closes #123"

**PR Template:**
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing Done
- [ ] Tested in Chrome
- [ ] Checked light/dark modes
- [ ] Verified no console errors
- [ ] Tested affected features

## Related Issues
Fixes #(issue number)

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have tested my changes thoroughly
- [ ] I have updated documentation if needed
- [ ] My commits follow the commit message guidelines
- [ ] No new warnings or errors are introduced
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged!

**Response to feedback:**
- Be open to suggestions
- Ask questions if unclear
- Make requested changes promptly
- Keep discussions respectful and constructive

## ❓ Questions?

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing issues and discussions


---

Thank you for contributing to OneHandle! Your efforts help make tab management better for everyone. 🎉
