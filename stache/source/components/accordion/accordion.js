module.exports = function(options) {
    var accordion = '<div class="accordion" id="accordionExample">' + options.fn(this) + '</div>';
    return accordion;
  }