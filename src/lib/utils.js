Utils = {
  build_element: (name, attrs = {}, style = {}) => {
    var el = document.createElement(name);
    Object.entries(attrs).forEach(attr => el.setAttribute(attr[0], attr[1]))
    if (Object.keys(style).length > 0) {
      Object.entries(style).forEach(style_rule => el.style[style_rule[0]] = style_rule[1]);
    }
    return el;
  },

  _eventHandlers: {},

  addListener: (node, event, handler, capture = false) => {
    if (!(event in Utils._eventHandlers)) {
      Utils._eventHandlers[event] = [];
    }
    // here we track the events and their nodes (note that we cannot
    // use node as Object keys, as they'd get coerced into a string
    Utils._eventHandlers[event].push({node: node, handler: handler, capture: capture})
    node.addEventListener(event, handler, capture)
  },


  removeAllListeners: (targetNode, event) => {
    // remove listeners from the matching nodes
    Utils._eventHandlers[event]
      .filter(({node}) => node === targetNode)
      .forEach(({node, handler, capture}) => node.removeEventListener(event, handler, capture))

    // update _eventHandlers global
    Utils._eventHandlers[event] = Utils._eventHandlers[event].filter(
      ({node}) => node !== targetNode,
    )
  },

  remove_from_array: (array, object) => {
    if (array.includes(object)) {
      array.splice(array.indexOf(object), 1);
    }
  },


  distance_box: (x, y, distance) => {
    var coords = [];
    var first_row = y - distance;
    var last_row = y + distance;
    Utils.index_array((distance * 2) + 1).forEach((idx) => {
      coords.push([(x - idx + distance), first_row])
    });
    Utils.index_array((distance * 2) - 1).forEach((idx) => {
      coords.push([(x - distance), (first_row + idx + 1)]);
      coords.push([(x + distance), (first_row + idx + 1)]);
    });
    Utils.index_array((distance * 2) + 1).forEach((idx) => {
      coords.push([(x - idx + distance), last_row])
    });
    return coords;
  },

  index_array: (size) => {
    return Array.from(new Array(size), (_, i) => {
      return i;
    });
  }
};

module.exports = Utils;
