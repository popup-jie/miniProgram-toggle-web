const htmlparser2 = require('htmlparser2')

let node = ''
let nodeList = []
function htmlToggle(str) {
  nodeList = []
  str = str.replace(/wx\:key=\"\*this\"/g, ' ');
  str = str.replace(/wx\:key\=\"index\"/g, ' ');
  str = str.replace(/navigator/g, 'router-link');

  str = str.replace(/<image/g, '<img');
  str = str.replace(/src=\'\{\{/g, ":src='");
  str = str.replace(/view/g, 'div');
  const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
      node += generateStartTag(name, attribs)
    },
    ontext(text) {
      if (text.trim() != '') {
        node += text
      }
    },
    onclosetag(name) {
      node = generateEndTag(node, name)
      nodeList.push(node)
      node = ''
    }
  }, { decodeEntities: true })

  parser.write(str);

  parser.end();
  // console.log(nodeList)
  // console.log(nodeList.join(''))
  return nodeList.join('\n')
}

function generateEndTag(str, tag) {
  if (tag == 'rich-text') {
    tag = '</div>'
  } else if (tag == 'text') {
    tag = '</span>'
  } else if (tag == 'img' || tag == 'input' || tag == 'wxs') {
    tag = ''
  } else {
    tag = `</${tag}>`
  }

  return str + tag
}

function generateStartTag(tag, attribs) {
  let attr = ''

  let wxForItemText = 'item'
  let wxForItemKey = 'index'

  if (tag == 'image') {
    tag = 'img'
  } else if (tag == 'rich-text') {
    tag = 'div'
  } else if (tag == 'text') {
    tag = 'span'
  }


  Object.keys(attribs).forEach(item => {
    let oldStr = item

    if (item === 'wx:else') {
      item = 'v-else'
    }


    // 处理nodes富文本信息
    if (item.indexOf('nodes') > -1) {
      attr += ` v-html="${attribs[oldStr]}"`
    }
    // 特殊处理wx:for边界问题
    else if (item.indexOf('wx:for') > -1) {
      if (item == 'wx:for') {
        let str = getBracesText(attribs[oldStr])
        attr += ` v-for="(WXFORITEM_ITEM_TEXT, WXFORITEM_ITEM_KEY) in ${str}"`
      } else if (item == 'wx:for-index') {
        wxForItemKey = attribs[oldStr]
        attr += ` :key="${wxForItemKey}"`
      } else if (item == 'wx:for-item') {
        wxForItemText = attribs[oldStr]
      }
    }
    // 特殊处理 data-xxx
    else if (/data-*/.test(item)) {
      let newStr = attr.split(' ')
      newStr.forEach((originStr, key, arr) => {
        if (originStr.indexOf('=') > -1) {
          let splitEqual = originStr.split('=')
          if (splitEqual[0].indexOf('@click') > -1) {
            let result = splitEqual[1].substring(splitEqual[1].indexOf("(") + 1, splitEqual[1].indexOf(")"))
            let fnName = splitEqual[1].substring(0, splitEqual[1].indexOf('('))
            let str = getBracesText(attribs[oldStr])
            if (!result) {
              result = str.split(',')
            } else {
              result = result.split(',')
              result.push(str)
            }
            newStr[key] = `${splitEqual[0]}=${fnName}(${result.join(',')})"`
          }
        }
      })
      attr = newStr.join(' ')
    }
    else if (item.indexOf('bind') > -1 || item.indexOf('catch') > -1) {
      if (/bind(:)?tap*/.test(item) || /catch(:)?tap*/.test(item)) {
        attribs[oldStr] = `${attribs[oldStr]}()`
      }
      item = item.replace(/bind(:)?tap*/, '@click')
      item = item.replace(/catch(:)?tap*/, '@click.stop')
      if (item.indexOf('bind') > -1 || item.indexOf('catch') > -1) {
        item = item.replace(/capture-catch(:)?/, '@')
        item = item.replace(/capture-bind(:)?/, '@')
        item = item.replace(/catch(:)?/, '@')
        item = item.replace(/bind(:)?/, '@')
      }
      // 处理touchstart touchmove touchcancel touchend
      item = item.replace('touchstart', 'mousedown')
      item = item.replace('touchmove', 'mousemove.prevent')
      item = item.replace('touchcancel', 'mouseup')
      item = item.replace('touchend', 'mouseup')

      attr += ` ${item}="${attribs[oldStr]}"`
    }
    else if (item.indexOf('wx:if') > -1) {
      item = item.replace('wx:if', 'v-if')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${item}="${str}"`
    } 
    else if (item.indexOf('wx:elif') > -1) {
      item = item.replace('wx:elif', 'v-else-if')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${item}="${str}"`
    }
    else if (item.indexOf('hidden') > -1) {
      item = item.replace('hidden', 'v-show')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${item}="!${str}"`
    }
    else {
      let str = attribs[oldStr]
      if (str.trim() == '') {
        attr += ` ${oldStr}`
      }
      else {
        if (attribs[oldStr].indexOf('{{') > -1) {
          let str = getBracesText(attribs[oldStr])
          attr += `:${item}="${str}"`
        } else {
          attr += ` ${item}="${str}"`
        }
      }
    }
  })
  // 覆盖v-for
  if (attr.indexOf('WXFORITEM_ITEM_TEXT') > -1) {
    attr = attr.replace('WXFORITEM_ITEM_TEXT', wxForItemText)
    if (attr.indexOf('WXFORITEM_ITEM_KEY') > -1) {
      attr = attr.replace('WXFORITEM_ITEM_KEY', wxForItemKey)

      if (wxForItemKey == 'index') {
        attr += ' :key="index"'
      }
    }
  }

  if (tag == 'img' || tag == 'input' || tag == 'wxs') {
    return `<${tag} ${attr} />`
  } else {
    return `<${tag} ${attr}>`
  }
}

function getBracesText(str) {
  str = str.replace('{{', '').replace('}}', '')
  str = str.trim()
  return str
}


module.exports = { htmlToggle }