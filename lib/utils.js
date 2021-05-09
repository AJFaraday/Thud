Utils = {
  build_element: function(name, attrs) {
    var el = document.createElement(name);
    Object.entries(attrs).forEach(
      function(attr) {
        el.setAttribute(attr[0], attr[1]);
      }
    )
    return el;
  }
}