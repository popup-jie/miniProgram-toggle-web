import { basic } from './basic'

// 映射target数据源
function mapKeys(source, target, map) {
  Object.keys(map).forEach((key) => {
    if (source[key]) {
      target[map[key]] = source[key];
    }
  });
}

function ybfComponent(initObj) {
  const options = {}

  mapKeys(initObj, options, {
    data: 'data',
    props: 'properties',
    mixins: 'behaviors',
    methods: 'methods',
    beforeCreate: 'created',
    created: 'attached',
    mounted: 'ready',
    relations: 'relations',
    destroyed: 'detached',
    classes: 'externalClasses',
  });

  options.externalClasses = options.externalClasses || [];
  options.externalClasses.push('custom-class');

  options.behaviors = options.behaviors || [];
  options.behaviors.push(basic);


  // 解决props多种类型
  if (options.properties) {
    Object.keys(options.properties).forEach((name) => {
      if (Array.isArray(options.properties[name])) {
        // miniprogram do not allow multi type
        options.properties[name] = null;
      }
    });
  }
  // add default options
  options.options = {
    multipleSlots: true,
    addGlobalClass: true,
  };

  Component(options);

}


export { ybfComponent };