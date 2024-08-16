const jitiFactory = require('jiti');
const sucrase = require('sucrase');
const normalizePathBase = require('normalize-path')
const glob = require('fast-glob')

let jiti = null;
function lazyJiti() {
  return (
    jiti ??
    (jiti = jitiFactory(__filename, {
      interopDefault: true,
      transform: (opts) => {
        return sucrase.transform(opts.source, {
          transforms: ['typescript', 'imports'],
        });
      },
    }))
  );
}

function loadConfig(path) {
  let config = (function () {
    // Always use jiti for ESM or TS files
    if (
      path &&
      (path.endsWith('.mjs') ||
        path.endsWith('.ts') ||
        path.endsWith('.cts') ||
        path.endsWith('.mts'))
    ) {
      return lazyJiti()(path);
    }

    try {
      return path ? require(path) : {};
    } catch {
      return lazyJiti()(path);
    }
  })();

  return config.default ?? config;
}

function normalizePath(originalPath) {
  let normalized = normalizePathBase(originalPath);

  // This is Windows network share but the normalize path had one of the leading
  // slashes stripped so we need to add it back
  if (
    originalPath.startsWith('\\\\') &&
    normalized.startsWith('/') &&
    !normalized.startsWith('//')
  ) {
    return `/${normalized}`;
  }

  return normalized;
}

exports.loadConfig = loadConfig
exports.normalizePath = normalizePath
exports.glob = glob
