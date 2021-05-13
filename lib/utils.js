Utils = {
  build_element: function(name, attrs={}, style={}) {
    var el = document.createElement(name);
    Object.entries(attrs).forEach(
      function(attr) {
        el.setAttribute(attr[0], attr[1]);
      }
    )
    if(Object.keys(style).length > 0) {
      Object.entries(style).forEach(
        function (style_rule) {
          el.style[style_rule[0]] = style_rule[1];
        }
      );
    }
    return el;
  },

  _eventHandlers: {},

  addListener: function(node, event, handler, capture = false) {
    if (!(event in Utils._eventHandlers)) {
      Utils._eventHandlers[event] = []
    }
    // here we track the events and their nodes (note that we cannot
    // use node as Object keys, as they'd get coerced into a string
    Utils._eventHandlers[event].push({ node: node, handler: handler, capture: capture })
    node.addEventListener(event, handler, capture)
  },


  removeAllListeners: function(targetNode, event) {
    // remove listeners from the matching nodes
    Utils._eventHandlers[event]
      .filter(({ node }) => node === targetNode)
      .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture))

    // update _eventHandlers global
    Utils._eventHandlers[event] = Utils._eventHandlers[event].filter(
      ({ node }) => node !== targetNode,
    )
  }
}