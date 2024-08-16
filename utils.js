import fg from 'fast-glob'

export function typeBy(obj) {
  const str = Object.prototype.toString.call(obj);
  let type = "string";
  switch (str) {
    case "[object Number]": type = "number"; break;
    case "[object Null]": type = "null"; break;
    case "[object Undefined]": type = "undefined"; break;
    case "[object Boolean]": type = "boolean"; break;
    case "[object Object]": type = "object"; break;
    case "[object Array]": type = "array"; break;
    case "[object Function]": type = "function"; break;
    default: type = "string"
  }
  return type;
}

export function getConfig(opts) {
  const content = fg.globSync(opts.content || [], { dot: true });
  const prefix = opts.prefix || 'g';

  function handleTheme(data, path, result = {}) {
    Object.keys(data).forEach(key => {
      Object.keys(data[key]).forEach(i => {
        result[`${path}-${key}-${i}`] = {
          [key]: data[key][i]
        }
      })
    })
    return result
  }
  const theme = handleTheme(opts.theme || {}, prefix, {})

  return { prefix, content, theme }
}

export function isNumber(str) {
  const reg = /^[0-9]+$/
  return reg.test(str)
}