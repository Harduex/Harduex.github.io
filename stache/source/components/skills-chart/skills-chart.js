if ((typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')) {
  module.exports = function (options) {
    const children = options.fn(this);
    return (`
          <div class="skills-chart" id="skills" class="toad-fullscreen">
              <article class="skills">
                ${children}
              </article>
          </div>
      `);
  }
}