const d3 = require('d3')
const filter = require('lodash/filter')
const groupBy = require('lodash/groupBy');
const values = require('lodash/values');
const map = require('lodash/map');
const min = require('lodash/min');
const max = require('lodash/max');

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

  console.log(nodes);

  // Select all the sections to render the area
  const area = svg
    .selectAll('path.section')
    .data(values(groupBy(filter(nodes, node => node.id), 'sectionId')))

  // Define the angled line function
  const angle = d3.svg
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('linear')

   // Enter any new links at the parent's previous position.
   area
    .enter()
    .insert('path', 'g')
    .attr('class', 'section')
    .attr('fill', 'none')
    .attr('stroke', borderColor)
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 1.25)

  // Transition links to their new position.
  area
    .transition()
    .duration(animationDuration)
    .attr('d', d => {
      
      const xs = map(d, d => d.x);
      const ys = map(d, d => d.y);
      const xMax = max(xs);
      const xMin = min(xs);
      const yMax = max(ys);
      const yMin = min(ys);

      return angle([
        {x: xMax+nodeWidth+20, y: yMax+nodeHeight+20},
        {x: xMax+nodeWidth+20, y: yMin-20},
        {x: xMin-20, y: yMin-20},
        {x: xMin-20, y: yMax+nodeHeight+20},
        {x: xMax+nodeWidth+20, y: yMax+nodeHeight+20}
      ])
    })

  // Animate the existing links to the parent's new position
  area
    .exit()
    .transition()
    .duration(animationDuration)
    // .attr('d', d => {
    //   const linePoints = [
    //     {
    //       x: config.callerNode.x + parseInt(nodeWidth / 2),
    //       y: config.callerNode.y + nodeHeight + 2
    //     },
    //     {
    //       x: config.callerNode.x + parseInt(nodeWidth / 2),
    //       y: config.callerNode.y + nodeHeight + 2
    //     },
    //     {
    //       x: config.callerNode.x + parseInt(nodeWidth / 2),
    //       y: config.callerNode.y + nodeHeight + 2
    //     },
    //     {
    //       x: config.callerNode.x + parseInt(nodeWidth / 2),
    //       y: config.callerNode.y + nodeHeight + 2
    //     }
    //   ]

    //   return angle(linePoints)
    // })
    .each('end', () => {
      config.callerNode = null
    })
}