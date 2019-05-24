const groupBy = require('lodash/groupBy');
const map = require('lodash/map');

module.exports = renderSections;

function renderSections(config={}) {
  const {
    svgroot,
    svg,
    tree,
    animationDuration,
    nodeWidth,
    nodeHeight,
    nodePaddingX,
    nodePaddingY,
    nodeBorderRadius,
    backgroundColor,
    borderColor,
    treeData,
    sourceNode,
    nodes,
    links,
    avatarWidth,
    nameColor
  } = config;

  const sections = groupBy(nodes, 'sectionId')

  const link = svg
    .selectAll('path.link')
    .data(sections)

  // Define the angled line function
  const angle = d3.svg
  .line()
  .x(d => d.x)
  .y(d => d.y)
  .interpolate('linear')

  link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', borderColor)
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 1.25)

  link
    .transition()
    .duration(animationDuration)
    .attr('d', d => {
      console.log(d)
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