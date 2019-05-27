const d3 = require('d3')
const onClick = require('./on-click')
const { wrapText, helpers } = require('../utils')

const CHART_NODE_CLASS = 'org-chart-node'
const PERSON_LINK_CLASS = 'org-chart-person-link'
const PERSON_NAME_CLASS = 'org-chart-person-name'
const PERSON_TITLE_CLASS = 'org-chart-person-title'
const PERSON_DEPARTMENT_CLASS = 'org-chart-person-dept'
const PERSON_REPORTS_CLASS = 'org-chart-person-reports'

module.exports = renderTiles;

function renderTiles(config = {}) {
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
    avatarWidth,
    nameColor
  } = config;

  const parentNode = sourceNode || treeData;
  const node = svg
  .selectAll('g.' + CHART_NODE_CLASS)
  .data(nodes.filter(d => d.id), d => d.id);

  const dispatch = d3.dispatch('drag:start', 'drag:end');

  const drag = d3.behavior.drag()
    .origin(d => {
      return d;
    })
    .on('dragstart', function (d) {
      d3.event.sourceEvent.stopPropagation();

      d3.select(this).select(`.${PERSON_NAME_CLASS}`).text('dragging')
    })
    .on('drag', function (d) {
      const tile = d3.select(this);

      tile.attr('transform', `translate(${d3.event.x}, ${d3.event.y})`)
      
    })
    .on('dragend', function (d) {
      const tile = d3.select(this);
      tile.attr('transform', `translate(${d.x}, ${d.y})`)
      tile.select(`.${PERSON_NAME_CLASS}`).text(d.person.id)
    });

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .insert('g')
    .attr('class', CHART_NODE_CLASS)
    //.attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`)
    .attr('id', d => d.id)
    .call(drag);

  // Person Card Shadow
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .attr('fill-opacity', 0.05)
    .attr('stroke-opacity', 0.025)
    .attr('filter', 'url(#boxShadow)');

  // Person Card Container
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('id', d => d.id)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .style('cursor', helpers.getCursorForNode)
    .attr('class', 'box');

  const namePos = {
    x: nodePaddingX * 1.4 + avatarWidth,
    y: nodePaddingY * 1.8
  }

  //Person's Name
  nodeEnter
    .append('text')
    .attr('class', PERSON_NAME_CLASS)
    .attr('x', namePos.x)
    .attr('y', namePos.y)
    .attr('dy', '.3em')
    .style('cursor', 'pointer')
    .style('fill', nameColor)
    .style('font-size', 16)
    .text(d => d.person.id)

  // Transition nodes to their new position.
  const nodeUpdate = node
    .transition()
    .duration(animationDuration)
    .attr('transform', d => {
      return `translate(${d.x},${d.y})`;
    });

  nodeUpdate
    .select('rect.box')
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor);

  // Transition exiting nodes to the parent's new position.
  const nodeExit = node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', d => `translate(${parentNode.x},${parentNode.y})`)
    .remove();

};