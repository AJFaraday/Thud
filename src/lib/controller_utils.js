var ControllerUtils = {
  // Source and target, must have x and y{
  distance_between: function (source, target) {
    var x_dist = Math.abs(source.x - target.x);
    var y_dist = Math.abs(source.y - target.y);
    return x_dist + y_dist;
  },

  // All spaces, and target, must have x and ytemplate.js
  farthest_from(spaces, target) {
    spaces.forEach((move) => {
      move.distance = ControllerUtils.distance_between(move, target);
    });
    return spaces.sort((a, b) => {
      return b.distance - a.distance
    })[0];
  },

  // All spaces, and target, must have x and y
  closest_to(spaces, target) {
    spaces.forEach((move) => {
      move.distance = ControllerUtils.distance_between(move, target);
    });
    return spaces.sort((a, b) => {
      return a.distance - b.distance
    })[0];
  }
}

module.exports = ControllerUtils;