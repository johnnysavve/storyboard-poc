const d3 = require('d3')

module.exports = renderUpdate

// Update the rendered node positions triggered by zoom
function renderUpdate(config) {
  const { svg, zooming } = config;

  return () => {
      config.scale = d3.event.scale.toFixed(1);

      svg.attr(
        'transform',
        `translate(${d3.event.translate})
       scale(${config.scale})`
      );
  }
}
