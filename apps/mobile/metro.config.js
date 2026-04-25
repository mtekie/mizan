const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Removed explicit nodeModulesPaths to allow Metro to use standard hierarchical resolution.
// This ensures that packages can find their own local dependencies (like semver v7 for reanimated)
// while still looking in the root for common packages.


// 3. Force resolve React and React-Native to the workspace root to prevent duplication errors (Invalid Hook Call)
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
};

// 4. Removed disableHierarchicalLookup to allow standard resolution for hoisted packages like expo-router


module.exports = config;
