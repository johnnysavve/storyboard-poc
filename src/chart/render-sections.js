const d3 = require('d3')
const filter = require('lodash/filter')
const groupBy = require('lodash/groupBy');
const values = require('lodash/values');
const map = require('lodash/map');
const min = require('lodash/min');
const max = require('lodash/max');

const SECTION_NODE_CLASS = 'section-node';

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

  // Select all the sections to render the area
  const area = svg
    .selectAll(`rect.${SECTION_NODE_CLASS}`)
    .data(values(groupBy(filter(nodes, node => node.id), 'sectionId')))

   // Enter any new links at the parent's previous position.
   area
    .enter()
    .insert('rect', 'g')
    .attr('class', SECTION_NODE_CLASS)
    .attr('id', d => d[0]['sectionId'])

  // Draw Section Area
  area
    .attr('width', d => {
      const {xMax, xMin} = _sectionCoordinateHelper(d);
      return xMax-xMin+nodeWidth+40;
    })
    .attr('height', d => {
      const {yMax, yMin} = _sectionCoordinateHelper(d);
      return yMax-yMin+nodeHeight+40;
    })
    .attr('fill', '#E4ECFD');

  // Transition links to their new position.
  area
    .transition()
    .duration(animationDuration)
    .attr('transform', d => {
      const {xMin, yMin} = _sectionCoordinateHelper(d);

      return `translate(${xMin-20}, ${yMin-20})`;
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

    function _sectionCoordinateHelper(d) {
      const xs = map(d, d => d.x);
      const ys = map(d, d => d.y);
      const xMax = max(xs);
      const xMin = min(xs);
      const yMax = max(ys);
      const yMin = min(ys);

      return {xMax, xMin, yMax, yMin};
    }
}