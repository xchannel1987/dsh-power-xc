# Contributing to dsh-power-xc

Thank you for your interest in contributing!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/keyiadiannao/dsh-power-xc.git
cd dsh-power-xc

# Install dependencies
pnpm install
```

## Commands

```bash
# Type checking
pnpm typecheck

# Run tests
pnpm test

# Build
pnpm build
```

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

## Pull Request

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit: `git commit -m 'feat: add feature'`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request
