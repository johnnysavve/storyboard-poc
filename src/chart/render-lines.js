const d3 = require('d3')

module.exports = renderLines

function renderLines(config = {}) {
  const {
    svg,
    links,
    margin,
    nodeWidth,
    nodeHeight,
    borderColor,
    animationDuration
  } = config

  // Select all the links to render the lines
  const link = svg
    .selectAll('path.link')
    .data(links.filter(link => link.source.id), d => d.target.id)

  // Define the angled line function
  const angle = d3.svg
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('linear')

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', borderColor)
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 1.25)

  // Transition links to their new position.
  link
    .transition()
    .duration(animationDuration)
    .attr('d', d => {
      const linePoints = [
        {
          x: d.source.x + parseInt(nodeWidth / 2),
          y: d.source.y + nodeHeight
        },
        {
          x: d.source.x + parseInt(nodeWidth / 2),
          y: d.target.y - margin.top / 2
        },
        {
          x: d.target.x + parseInt(nodeWidth / 2),
          y: d.target.y - margin.top / 2
        },
        {
          x: d.target.x + parseInt(nodeWidth / 2),
          y: d.target.y
        }
      ]

      return angle(linePoints)
    })

  // Animate the existing links to the parent's new position
  // link
  //   .exit()
  //   .transition()
  //   .duration(animationDuration)
  //   // .attr('d', d => {
  //   //   const linePoints = [
  //   //     {
  //   //       x: config.callerNode.x + parseInt(nodeWidth / 2),
  //   //       y: config.callerNode.y + nodeHeight + 2
  //   //     },
  //   //     {
  //   //       x: config.callerNode.x + parseInt(nodeWidth / 2),
  //   //       y: config.callerNode.y + nodeHeight + 2
  //   //     },
  //   //     {
  //   //       x: config.callerNode.x + parseInt(nodeWidth / 2),
  //   //       y: config.callerNode.y + nodeHeight + 2
  //   //     },
  //   //     {
  //   //       x: config.callerNode.x + parseInt(nodeWidth / 2),
  //   //       y: config.callerNode.y + nodeHeight + 2
  //   //     }
  //   //   ]

  //   //   return angle(linePoints)
  //   // })
  //   .each('end', () => {
  //     config.callerNode = null
  //   })
}
