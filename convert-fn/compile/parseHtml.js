const htmlparser2 = require('htmlparser2')

let node = ''
let _filePath = null
function htmlToggle(str, filePath) {
  _filePath = filePath
  let nodeList = []
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
  }, { decodeEntities: true, xmlMode: true })

  parser.write(str);

  parser.parseComplete()

  parser.end();
  return nodeList.join('')
}

function generateEndTag(str, tag) {
  if (tag == 'rich-text') {
    tag = '</div>'
  } else if (tag == 'text') {
    tag = '</span>'
  }
  //  else if (tag == 'slot') {
  //   tag = '</slot>'
  // } 
  // || tag == "slot"
  else if (tag == 'img' || tag == 'input' || tag == 'wxs') {
    tag = ''
  } else {
    tag = `</${tag}>\n`
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


  Object.keys(attribs).forEach(key => {
    let oldStr = key

    if (oldStr === 'wx:else') {
      key = 'v-else'
    }

    if (oldStr === 'custom-class') {
      key = 'class'
    }

    if (oldStr === 'custom-style') {
      key = 'style'
    }

    // 处理nodes富文本信息
    if (key.indexOf('nodes') > -1) {
      attr += ` v-html="${attribs[oldStr]}"`
    }

    // 特殊处理wx:for边界问题
    else if (key.indexOf('wx:for') > -1) {
      if (key == 'wx:for') {
        let str = getBracesText(attribs[oldStr])
        attr += ` v-for="(WXFORITEM_ITEM_TEXT, WXFORITEM_ITEM_KEY) in ${str}"`
      } else if (key == 'wx:for-index') {
        wxForItemKey = attribs[oldStr]
        attr += ` :key="${wxForItemKey}"`
      } else if (key == 'wx:for-item') {
        wxForItemText = attribs[oldStr]
      }
    }

    else if (key.indexOf('bind') > -1 || key.indexOf('catch') > -1) {
      if (/bind(:)?tap*/.test(key) || /catch(:)?tap*/.test(key)) {
        attribs[oldStr] = `${attribs[oldStr]}`
      }
      key = key.replace(/bind(:)?tap*/, '@click')
      key = key.replace(/catch(:)?tap*/, '@click.stop')
      if (key.indexOf('bind') > -1 || key.indexOf('catch') > -1) {
        key = key.replace(/capture-catch(:)?/, '@')
        key = key.replace(/capture-bind(:)?/, '@')
        key = key.replace(/catch(:)?/, '@')
        key = key.replace(/bind(:)?/, '@')
      }
      // 处理touchstart touchmove touchcancel touchend
      key = key.replace('touchstart', 'mousedown')
      key = key.replace('touchmove', 'mousemove.prevent')
      key = key.replace('touchcancel', 'mouseup')
      key = key.replace('touchend', 'mouseup')

      //这里处理data-xxx
      let jsonStr = ''
      for (let _key in attribs) {
        if (/data-*/.test(_key)) {
          let _s = _key.split('-')
          // 将data-id="{{uid}}" => fn({id: uid})
          if (jsonStr) { jsonStr += ', ' }
          jsonStr += `${_s[1]}:${_getBracesText(attribs[_key])}`
        }
      }

      if (!jsonStr) {
        attr += ` ${key}="${attribs[oldStr]}()"`
      } else {
        attr += ` ${key}="${attribs[oldStr]}({${jsonStr}})"`
      }
    }

    // 特殊处理 data-xxx
    //TODO: 暂时不针对 data-xxx处理，保留原有的数据，方便html转小程序操作

    // else if (/data-*/.test(key)) {

    // let newStr = attr.split(' ')
    // newStr.forEach((originStr, key, arr) => {
    //   if (originStr.indexOf('=') > -1) {
    //     let splitEqual = originStr.split('=')
    //     if (splitEqual[0].indexOf('@click') > -1) {
    //       let result = splitEqual[1].substring(splitEqual[1].indexOf("(") + 1, splitEqual[1].indexOf(")"))
    //       let fnName = splitEqual[1].substring(0, splitEqual[1].indexOf('('))
    //       let str = getBracesText(attribs[oldStr])
    //       if (!result) {
    //         result = str.split(',')
    //       } else {
    //         result = result.split(',')
    //         result.push(str)
    //       }
    //       newStr[key] = `${splitEqual[0]}=${fnName}(${result.join(',')})"`
    //     }
    //   }
    // })
    // attr = newStr.join(' ')
    // }

    else if (key.indexOf('wx:if') > -1) {
      key = key.replace('wx:if', 'v-if')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${key}="${str}"`
    }

    else if (key.indexOf('wx:elif') > -1) {
      key = key.replace('wx:elif', 'v-else-if')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${key}="${str}"`
    }

    else if (key.indexOf('hidden') > -1) {
      key = key.replace('hidden', 'v-show')
      let str = getBracesText(attribs[oldStr])
      attr += ` ${key}="${str}"`
    }

    else {
      let str = attribs[oldStr]
      if (str.trim() == '') {
        attr += ` ${key}`
      }
      else {
        if (attribs[oldStr].indexOf('{{') > -1) {
          let _str = getBracesText(attribs[oldStr])
          attr += ` :${key}="${_str}"`
        } else {
          attr += ` ${key}="${str}"`
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

  // || tag == 'slot'
  if (tag == 'img' || tag == 'input' || tag == 'wxs') {
    return `<${tag}${attr} />
    `
  } else {
    return `<${tag}${attr}>
    `
  }
}

// 解决： style="height: {{omd}}px; width: {{dd}}; postion: {{postionType}}"
// => :style=`height: ${omd}px; width: ${dd}; postion: ${postionType}`

// class="classa {{a ? b : c}}"
// =>  class="`classa ${a ? b : c}`"

// TODO: 存在 class="classa {{b}}"
// =>  :class="classa b`"
// => 1. class="classa" :class="b" 
// => 2. :class="`classa ${b}`"
// => 3. :class="classa " + b

function getBracesText(str) {
  let newstr = str
  if (str.indexOf(';') > -1 || str.indexOf(':') > -1) {
    newstr = str.replace(/{{/g, '${').replace(/}}/g, '}')
    return '`' + _getBracesText(newstr) + '`'
  } else {
    let arrStr = newstr.split(' ')

    if (arrStr.length > 1) { 
      
    }

    // return ``
  }

  return _getBracesText(newstr)
}

const _getBracesText = (str) => {
  str = str.replace('{{', '').replace('}}', '')
  // if (str.indexOf('.') > -1) {
  // global.wechatWxsMapCache.getResolverFn(_filePath + '_' +)
  // }
  // setResolverFn
  // global.wechatWxsMapCache.setResolverPath(componentPath + '_' + importModuleName, fromValue)
  return str.trim()
}


module.exports = { htmlToggle }