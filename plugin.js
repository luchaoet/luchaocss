import fs from 'fs'
import path from 'path'
import isColor from 'is-color'
import { parse } from '@vue/compiler-sfc'

import { getConfig, isNumber } from './utils.js'
import basecss from './basecss.js'

const plugin = (config) => {
  const _config = getConfig(config);
  const { prefix, content, theme } = _config;
  // console.log('===============================')
  // console.log('config.prefix => ', prefix)
  // console.log('config.content => ', content)
  // console.log('config.theme => ', theme)
  // console.log('===============================')

  const getClasses = () => {
    const classes = new Set();

    const extractFromHtml = (html) => {
      const classRegex = /class="([^"]+)"/g;
      let match;
      while ((match = classRegex.exec(html)) !== null) {
        const classNames = match[1].split(/\s+/);
        classNames.forEach((className) => classes.add(className));
      }
    };

    const processVueFile = (content) => {
      const { descriptor } = parse(content);
      if (descriptor.template) {
        const templateContent = descriptor.template.content;
        extractFromHtml(templateContent);
      }
    };

    const projectRoot = process.cwd();
    content.forEach(f => {
      const c = fs.readFileSync(path.join(projectRoot, f), 'utf-8');
      const extname = path.extname(f);
      if (extname === '.vue') {
        processVueFile(c);
      } else {
        extractFromHtml(c)
      }
    })


    return classes
  }

  function getSelector(selector) {
    selector = selector.replace('#', '\\#').replace('h:', 'h\\:').replace('%', '\\%').replace('.', '\\.');
    return `.${selector.indexOf('h\\:') > 0 ? `${selector}:hover` : selector}`
  }

  const getMargin = (attr1, attr2) => {
    // attr1: tblr / 10 / 10px
    const isPosition = attr1 && attr1.split('').every(i => 'tblr'.includes(i));
    if (isPosition) {
      const result = {};
      const pos = {
        t: 'top',
        b: 'bottom',
        l: 'left',
        r: 'right',
      }
      attr1.split('').forEach(i => {
        result[`margin-${pos[i]}`] = isNumber(attr2) ? `${attr2}px` : attr2
      })
      return result
    } else {
      return {
        margin: isNumber(attr1) ? `${attr1}px` : attr1
      }
    }
  }
  const getPadding = (attr1, attr2) => {
    // attr1: tblr / 10 / 10px
    const isPosition = attr1 && attr1.split('').every(i => 'tblr'.includes(i));
    if (isPosition) {
      const result = {};
      const pos = {
        t: 'top',
        b: 'bottom',
        l: 'left',
        r: 'right',
      }
      attr1.split('').forEach(i => {
        result[`padding-${pos[i]}`] = isNumber(attr2) ? `${attr2}px` : attr2
      })
      return result
    } else {
      return {
        padding: isNumber(attr1) ? `${attr1}px` : attr1
      }
    }

  }

  const getPaddingOrPosition = (attr1, attr2) => {
    const position = {
      r: 'relative',
      a: 'absolute',
      f: 'fixed',
      s: 'sticky',
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky',
    }
    if (attr1 in position) {
      return {
        'position': position[attr1]
      }
    } else {
      return getPadding(attr1, attr2)
    }
  }

  const getFontSize = (params) => ({ 'font-size': isNumber(params) ? `${params}px` : params })
  const getFontWeight = (params) => {
    switch (params) {
      case 'b': return { 'font-weight': 'bold' }
      case 'n': return { 'font-weight': 'normal' }
      case 'l': return { 'font-weight': 'lighter' }
      default: return { 'font-weight': params }
    }
  }
  const getBackground = (params) => ({ 'background-color': params })
  const getDisplay = (params) => {
    switch (params) {
      case 'f': return { display: 'flex' };
      case 'i': return { display: 'inline' };
      case 'b': return { display: 'block' };
      case 'g': return { display: 'grid' };
      case 'ig': return { display: 'inline-grid' };
      case 'ib': return { display: 'inline-block' };
      case 'if': return { display: 'inline-flex' };
      case 'n': return { display: 'none' };
      default: return { display: params };
    }
  }
  const getHeight = (params) => {
    const height = isNumber(params) ? `${params}px` : params;
    return { height }
  }
  const getWidth = (params) => {
    const width = isNumber(params) ? `${params}px` : params;
    return { width }
  }
  const getBorderWidth = (params) => {
    const bw = isNumber(params) ? `${params}px` : params;
    return { 'border-width': bw }
  }
  const getZIndex = (index) => {
    return { 'z-index': index }
  }
  const getLineHeight = (params) => {
    const lh = params == 1 ? params : isNumber(params) ? `${params}px` : params;
    return { 'line-height': lh }
  }
  const getBorderRadius = (params) => {
    const br = isNumber(params) ? `${params}px` : params;
    return {
      'border-radius': br
    }
  }
  const getBorderColor = (params) => ({ 'border-color': params })
  const getObjectFit = (params) => {
    let of = '';
    switch (params) {
      case 'f':
        of = 'fill';
        break;
      case 'c':
        of = 'cover';
        break;
      case 'sd':
        of = 'scale-down';
        break;
      case 'n':
        of = 'none';
        break;
      case 'i':
        of = 'initial';
        break;
      default:
        of = params
        break;
    }
    return {
      'object-fit': of
    }
  }
  const getBorderStyleOrBorderShadow = (params) => {
    const borderStyle = {
      h: 'hidden',
      d: 'dashed',
      s: 'solid',
      g: 'groove',
      r: 'ridge',
      i: 'inset',
      o: 'outset'
    }
    const boxShadow = {
      basic: '0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)',
      light: '0px 0px 12px rgba(0, 0, 0, .12)',
      lighter: '0px 0px 6px rgba(0, 0, 0, .12)',
      dark: '0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16)',
      n: 'none',
    }
    const boxSizing = {
      'bb': 'border-box',
      'cb': 'content-box'
    }
    const boxSizingKeys = Object.keys(boxSizing);
    const boxSizingValues = Object.values(boxSizing);
    if (boxSizingKeys.includes(params)) {
      return {
        'box-sizing': boxSizing[params]
      }
    } else if (boxSizingValues.includes(params)) {
      return {
        'box-sizing': params
      }
    } else if (params in boxShadow) {
      return {
        'box-shadow': boxShadow[params]
      }
    } else {
      return {
        'border-style': borderStyle[params] || params
      }
    }
  }
  // align-items: stretch|center|flex-start|flex-end|baseline|initial|inherit;
  const getAlignItems = (params) => {
    let ai = ''
    switch (params) {
      case 's': ai = 'stretch'; break;
      case 'c': ai = 'center'; break;
      case 'fs': ai = 'flex-start'; break;
      case 'fe': ai = 'flex-end'; break;
      case 'b': ai = 'baseline'; break;
      default: ai = params; break;
    }
    return {
      'align-items': ai
    }
  }
  const getColorOrCursor = (...params) => {
    const [attr1] = params;
    if (params.length > 1) {
      return { cursor: params.join('-') }
    } else if (isColor(attr1)) {
      return {
        color: attr1
      }
    } else {
      const c = {
        p: 'pointer',
        na: 'not-allowed',
        m: 'move',
        zo: 'zoom-out',
        d: 'default',
      }
      return c[attr1] ? {
        cursor: c[attr1]
      } : {}
    }
  }
  const getEllipsis = (num) => {
    if (num == 2) {
      return {
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        'overflow-wrap': 'break-word'
      }
    } else {
      return {
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      }
    }
  }
  const getGridGap = (attr1, attr2) => {
    const attr = {
      gg: 'grid-gap',
      grg: 'grid-row-gap',
      gcg: 'grid-column-gap',
    }
    return {
      [attr[attr1]]: isNumber(attr2) ? `${attr2}px` : attr2
    }
  }
  const getJustifyContent = (params) => {
    const attrs = {
      c: 'center',
      sb: 'space-between',
      sa: 'space-around',
      fs: 'flex-start',
      fe: 'flex-end'
    }
    if (params in attrs) {
      return {
        'justify-content': attrs[params]
      }
    } else {
      return {}
    }
  }
  const getFlexDirection = (params) => {
    const attrs = {
      c: 'row',
      rr: 'row-reverse',
      sa: 'space-around',
      c: 'column',
      cr: 'column-reverse'
    }
    if (params in attrs) {
      return {
        'flex-direction': attrs[params]
      }
    } else {
      return {}
    }
  }
  const getFlexGrow = (params) => {
    return {
      'flex-grow': params
    }
  }
  const getTopBottomLeftRight = (attr1, attr2) => {
    const attrs = {
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left'
    }
    return {
      [attrs[attr1]]: isNumber(attr2) ? `${attr2}px` : attr2
    }
  }

  const overflow = {
    a: 'auto',
    h: 'hidden',
    ox: 'overflow-x',
    oy: 'overflow-y',
  }
  const getOverflow = (attr1, attr2) => {
    return {
      [overflow[attr1]]: overflow[attr2]
    }
  }
  const getopacityOrOverflowOrOrder = (params) => {
    if (params in overflow) {
      return {
        overflow: overflow[params]
      }
    }
    if (isNaN(Number(params))) {
      return {}
    } else {
      if (params >= 0 && params <= 1) {
        return {
          opacity: params
        }
      } else {
        return {
          order: params
        }
      }
    }
  }

  const getTextAlign = (params) => {
    const attrs = {
      l: 'left',
      c: 'center',
      r: 'right'
    }
    return {
      'text-align': attrs[params]
    }
  }

  function getCss(attr1, ...attrs) {
    switch (attr1) {
      case 'm': return getMargin(...attrs);
      case 'p': return getPaddingOrPosition(...attrs);
      case 'fs': return getFontSize(...attrs);
      case `h:${prefix}`: return getCss(...attrs);
      case 'fw': return getFontWeight(...attrs);
      case 'bg': return getBackground(...attrs);
      case 'd': return getDisplay(...attrs);
      case 'h': return getHeight(...attrs);
      case 'w': return getWidth(...attrs);
      case 'zi': return getZIndex(...attrs);
      case 'lh': return getLineHeight(...attrs);
      case 'bw': return getBorderWidth(...attrs);
      case 'br': return getBorderRadius(...attrs);
      case 'bc': return getBorderColor(...attrs);
      case 'bs': return getBorderStyleOrBorderShadow(...attrs);
      case 'of': return getObjectFit(...attrs);
      case 'c': return getColorOrCursor(...attrs);
      case 'e': return getEllipsis(...attrs);
      case 'gg':
      case 'grg':
      case 'gcg': return getGridGap(attr1, ...attrs);
      case 'ai': return getAlignItems(...attrs);
      case 'jc': return getJustifyContent(...attrs);
      case 'fd': return getFlexDirection(...attrs);
      case 'fg': return getFlexGrow(...attrs);
      case 't':
      case 'b':
      case 'l':
      case 'r': return getTopBottomLeftRight(attr1, ...attrs);
      case 'o': return getopacityOrOverflowOrOrder(...attrs);
      case 'ox':
      case 'oy': return getOverflow(attr1, ...attrs);
      case 'ta': return getTextAlign(...attrs)
      default: return {}
    }
  }

  let utilitiesRoot = null;

  return {
    config: _config,
    postcssPlugin: 'luchaocss',
    AtRule: {
      luchaocss: (rule, { Rule, Declaration, Comment }) => {
        const { parent: root, params } = rule;
        console.log(`AtRule ===> luchaocss ${params}`)

        if (params === 'base') {
          Object.keys(basecss).reverse().forEach(selector => {
            const r = new Rule({ selector });
            const decs = basecss[selector];
            r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
            root.prepend(r)
          })
          const comment = new Comment({ text: '\n * luchaocss base css \n * https://github.com/luchaoet/base-css/blob/main/scss/reset.scss \n' })
          root.prepend(comment)
        } else if (params === "utilities") {
          utilitiesRoot = root;
          const classes = getClasses()
          classes.forEach((key) => {
            if (key.indexOf(`${prefix}-`) === 0) {
              const [_, ...others] = key.split('-');
              const r = new Rule({ selector: getSelector(key) });
              const decs = getCss(...others)

              if (Object.keys(decs).length) {
                r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
                root.prepend(r)
              }
            }
          })

          /**
           * theme 生成
           */
          Object.keys(theme).forEach(key => {
            const r = new Rule({ selector: getSelector(key) });
            const decs = theme[key];

            if (Object.keys(decs).length) {
              r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
              root.prepend(r)
            }
          })
        }
        rule.remove()
      }
    },
    Once(root, { Rule, Declaration, Comment }) {
      console.log('Once ===>', root)

      if (utilitiesRoot) {
        const classes = getClasses()
        classes.forEach((key) => {
          if (key.indexOf(`${prefix}-`) === 0) {
            const [_, ...others] = key.split('-');
            const r = new Rule({ selector: getSelector(key) });
            const decs = getCss(...others)

            if (Object.keys(decs).length) {
              r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
              utilitiesRoot.prepend(r)
            }
          }
        })
      }

      /**
       * @luchaocss base;
       */
      // root.walkAtRules('luchaocss', (rule) => {
      // console.log('Once walkAtRules ===>')
      //   const params = rule.params;
      //   if (params === 'base') {
      //     Object.keys(basecss).reverse().forEach(selector => {
      //       const r = new Rule({ selector });
      //       const decs = basecss[selector];
      //       r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
      //       root.prepend(r)
      //     })
      //     const comment = new Comment({ text: '\n * luchaocss base css \n * https://github.com/luchaoet/base-css/blob/main/scss/reset.scss \n' })
      //     root.prepend(comment)
      //   } else if (params === "utilities") {
      //     classes.forEach((key) => {
      //       if (key.indexOf(`${prefix}-`) === 0) {
      //         const [_, ...others] = key.split('-');
      //         const r = new Rule({ selector: getSelector(key) });
      //         const decs = getCss(...others)

      //         if (Object.keys(decs).length) {
      //           r.append(Object.keys(decs).map(prop => new Declaration({ prop, value: decs[prop] })))
      //           root.prepend(r)
      //         }

      //       }
      //     })
      //   }
      //   rule.remove()
      // })
    },
  };
}

plugin.postcss = true
export default plugin