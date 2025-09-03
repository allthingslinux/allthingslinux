# Design Document

## Overview

This design outlines the migration from npm to pnpm for the AllThingsLinux project. The migration will replace npm as the package manager while maintaining all existing functionality, scripts, and workflows. The design focuses on a safe, incremental approach that preserves the current development experience while leveraging pnpm's benefits.

## Architecture

### Current State
- Package manager: npm
- Lock file: package-lock.json (31,696 lines)
- Configuration: .npmrc with specific registry and retry settings
- Scripts: All package.json scripts use npm commands
- Documentation: README.md and NPM_SCRIPTS.md reference npm

### Target State
- Package manager: pnpm
- Lock file: pnpm-lock.yaml
- Configuration: .npmrc settings migrated to pnpm equivalents
- Scripts: All package.json scripts updated to use pnpm commands
- Documentation: Updated to reference pnpm instead of npm

## Components and Interfaces

### Package Manager Configuration
- **Current**: .npmrc with npm-specific settings
- **Target**: .npmrc with pnpm-compatible settings + potential .pnpmrc
- **Migration Strategy**: Preserve compatible settings, add pnpm-specific optimizations

### Lock File Management
- **Current**: package-lock.json (npm v3 lockfile format)
- **Target**: pnpm-lock.yaml (pnpm's lockfile format)
- **Migration Strategy**: Generate new lock file from package.json, preserve original as backup

### Script Commands
- **Current**: Scripts use `npm run`, `npm install`, `npx` commands
- **Target**: Scripts use `pnpm run`, `pnpm install`, `pnpm exec` commands
- **Migration Strategy**: Update package.json scripts to use pnpm equivalents

### Documentation Updates
- **Current**: README.md and NPM_SCRIPTS.md reference npm commands
- **Target**: Documentation references pnpm commands
- **Migration Strategy**: Find and replace npm commands with pnpm equivalents

## Data Models

### Package Configuration
```json
{
  "packageManager": "pnpm@latest",
  "engines": {
    "node": ">=22.14.0",
    "pnpm": ">=8.0.0"
  }
}
```

### PNPM Configuration (.pnpmrc)
```ini
# Workspace and dependency management
auto-install-peers=true
strict-peer-dependencies=false

# Performance optimizations
prefer-frozen-lockfile=true
enable-pre-post-scripts=true

# Registry settings (inherited from .npmrc where possible)
registry=https://registry.npmjs.org/
```

### Script Mapping
| npm command        | pnpm equivalent       |
| ------------------ | --------------------- |
| `npm install`      | `pnpm install`        |
| `npm run <script>` | `pnpm run <script>`   |
| `npx <command>`    | `pnpm exec <command>` |
| `npm run dev`      | `pnpm run dev`        |

## Error Handling

### Migration Rollback Strategy
1. **Backup Creation**: Preserve original package-lock.json as package-lock.json.backup
2. **Validation Checks**: Verify all scripts work before committing changes
3. **Quick Rollback**: Ability to restore npm setup if critical issues arise

### Dependency Resolution Issues
1. **Peer Dependencies**: Configure pnpm to handle peer dependencies appropriately
2. **Hoisting Issues**: Use pnpm's shamefully-hoist if needed for compatibility
3. **Version Conflicts**: Ensure no unintended version changes during migration

### Script Compatibility
1. **Command Validation**: Test all package.json scripts with pnpm
2. **Path Resolution**: Ensure pnpm exec works for all npx commands
3. **Environment Variables**: Verify pnpm preserves all necessary env vars

## Testing Strategy

### Pre-Migration Testing
1. **Baseline Verification**: Ensure all npm scripts work correctly
2. **Dependency Audit**: Document current dependency tree
3. **Build Verification**: Confirm all build processes complete successfully

### Post-Migration Testing
1. **Script Validation**: Test all package.json scripts with pnpm
2. **Build Process**: Verify complete build chain works with pnpm
3. **Development Workflow**: Test dev server, hot reload, and debugging
4. **Deployment Process**: Ensure deployment scripts work with pnpm

### Compatibility Testing
1. **Node.js Version**: Verify pnpm works with specified Node.js version (>=22.14.0)
2. **CI/CD Compatibility**: Test with Cloudflare's build system
3. **Tool Integration**: Verify compatibility with Contentlayer, Next.js, etc.

### Performance Validation
1. **Install Speed**: Compare pnpm install times vs npm
2. **Build Performance**: Ensure no regression in build times
3. **Disk Usage**: Verify pnpm's space efficiency benefits

## Implementation Phases

### Phase 1: Preparation and Backup
- Create backup of package-lock.json
- Document current npm script behavior
- Install pnpm globally if needed

### Phase 2: Configuration Migration
- Update .npmrc for pnpm compatibility
- Create .pnpmrc with optimal settings
- Add packageManager field to package.json

### Phase 3: Dependency Migration
- Remove node_modules and package-lock.json
- Run pnpm install to generate pnpm-lock.yaml
- Verify dependency versions match

### Phase 4: Script Updates
- Update package.json scripts to use pnpm commands
- Replace npx with pnpm exec where appropriate
- Test all scripts individually

### Phase 5: Documentation Updates
- Update README.md installation instructions
- Update NPM_SCRIPTS.md to reference pnpm
- Update any other documentation references

### Phase 6: Validation and Testing
- Run complete test suite
- Verify build process
- Test development workflow
- Validate deployment process
