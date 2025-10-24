# Project Structure

## Current Organization

```
.
├── .kiro/
│   └── steering/          # AI assistant guidance documents
│       ├── product.md     # Product overview and purpose
│       ├── tech.md        # Technology stack and commands
│       └── structure.md   # Project organization (this file)
└── .vscode/
    └── settings.json      # VSCode workspace configuration
```

## Directory Conventions

### `.kiro/` - Kiro Configuration
- **Purpose**: Contains all Kiro AI assistant configuration and guidance
- **steering/**: Markdown files that provide context and rules for AI assistance
- **settings/**: May contain MCP and other Kiro-specific configurations

### `.vscode/` - VSCode Configuration
- **Purpose**: VSCode workspace settings and extensions configuration
- **settings.json**: Workspace-specific VSCode settings including Kiro integration

## Expansion Guidelines

As the project grows, consider organizing code using these patterns:

### For application development:
```
src/                    # Source code
├── components/         # Reusable components
├── utils/             # Utility functions
├── types/             # Type definitions
└── tests/             # Test files
```

### For library/package development:
```
lib/                   # Library source
docs/                  # Documentation
examples/              # Usage examples
tests/                 # Test suite
```

## Best Practices
- Keep steering documents updated as project evolves
- Maintain clear separation between configuration and source code
- Use descriptive folder names that reflect their purpose
- Document any project-specific conventions in steering files