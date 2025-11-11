const { alias, configPaths } = require('react-app-rewire-alias')

module.exports = function override(config, env) {
  const aliasedConfig = alias(configPaths('./tsconfig.paths.json'))(config)
  
  // Fix react-refresh issue with module scope
  if (config.resolve) {
    config.resolve.plugins = config.resolve.plugins || []
    // Remove ModuleScopePlugin that restricts imports to src/
    config.resolve.plugins = config.resolve.plugins.filter(
      plugin => plugin.constructor.name !== 'ModuleScopePlugin'
    )
  }
  
  // Add Jest moduleNameMapper for path aliases when in test environment
  if (env === 'test') {
    if (!aliasedConfig.jest) {
      aliasedConfig.jest = {}
    }
    if (!aliasedConfig.jest.moduleNameMapper) {
      aliasedConfig.jest.moduleNameMapper = {}
    }
    aliasedConfig.jest.moduleNameMapper = {
      ...aliasedConfig.jest.moduleNameMapper,
      '^components/(.*)$': '<rootDir>/src/components/$1',
      '^library/(.*)$': '<rootDir>/src/library/$1',
    }
  }
  
  return aliasedConfig
}
