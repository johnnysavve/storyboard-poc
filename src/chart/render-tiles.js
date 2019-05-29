const d3 = require('d3')
const each = require('lodash/each')
const remove = require('lodash/remove')
const onClick = require('./on-click')
const { wrapText, helpers } = require('../utils')

const CHART_NODE_CLASS = 'org-chart-node'
const PERSON_LINK_CLASS = 'org-chart-person-link'
const PERSON_NAME_CLASS = 'org-chart-person-name'
const PERSON_TITLE_CLASS = 'org-chart-person-title'
const PERSON_DEPARTMENT_CLASS = 'org-chart-person-dept'
const PERSON_REPORTS_CLASS = 'org-chart-person-reports'
const PLACEHOLDER_CLASS = 'org-chart-node-placeholder'

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
    nameColor,
    dispatch
  } = config;

  const parentNode = sourceNode || treeData;
  const data = nodes.filter(d => d.id)
    
  const drag = d3.behavior.drag()
    .origin(d => {
      return d;
    })
    .on('dragstart', function (d) {
      if (isDraggable(d)) {
        dispatch['tiledragstart'](d)

        d3.event.sourceEvent.stopPropagation();

        addPlaceholderTile(d);
  
        svg.selectAll('g.' + CHART_NODE_CLASS).sort(function (a, b) {
          if (a.person.id === d.person.id) return 1;
          else return -1;
        })
      }
    })
    .on('drag', function (d) {
      if (isDraggable(d)) {
        const tile = d3.select(this);
        console.log(d3.event, 'drag')
        tile.attr('transform', `translate(${d3.event.x}, ${d3.event.y})`)
      }
    })
    .on('dragend', function (d) {
      if (isDraggable(d)) {
        dispatch['tiledragend'](d)
        console.log(d3.event, 'dragend')
        const tile = d3.select(this);
        tile.attr('transform', `translate(${d.x}, ${d.y})`)

        removePlaceholderTile()
      }
    });

  const namePos = {
    x: nodePaddingX * 1.4 + avatarWidth,
    y: nodePaddingY * 1.8
  }

  drawTiles(data);

  function drawTiles (data) {
    const node = svg
    .selectAll('g.' + CHART_NODE_CLASS)
    .data(data, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
    .enter()
    .insert('g')
    .attr('class', CHART_NODE_CLASS)
    //.attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`)
    .attr('id', d => d.id)
    .call(drag)

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
      .style('cursor', d => {
        if (isDraggable(d)) {
          return 'pointer';
        } else {
          return 'default';
        }
      })
      .attr('class', 'box');

    //Person's Name
    nodeEnter
    .append('text')
    .attr('class', PERSON_NAME_CLASS)
    .attr('x', namePos.x)
    .attr('y', namePos.y)
    .attr('dy', '.3em')
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
      // .attr('transform', d => `translate(${parentNode.x},${parentNode.y})`)
      .remove();  
  }

  function isDraggable (d) {
    return !((d.hasChild && d.children.length > 1) || (!d.hasChild && d.parent.hasChild && d.parent.children.length > 1));
  }

  function addPlaceholderTile (d) {
    const placeholder = svg
    .selectAll(`g.${PLACEHOLDER_CLASS}`)
    .data([d])
    .enter()
    .insert('g')
    .attr('class', PLACEHOLDER_CLASS)
    //.attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`)
    .attr('id', d => d.id)
    .attr('transform', d => {
      return `translate(${d.x},${d.y})`;
    })

    placeholder  
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('fill', backgroundColor)
      .attr('stroke', borderColor)
      .attr('rx', nodeBorderRadius)
      .attr('ry', nodeBorderRadius)
      .attr('fill-opacity', 0.05)
      .attr('stroke-opacity', 0.025)
      .attr('filter', 'url(#boxShadow)')

    placeholder
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('id', d => d.id)
      .attr('fill', backgroundColor)
      .attr('fill-opacity', 0.5)
      .attr('stroke', borderColor)
      .attr('rx', nodeBorderRadius)
      .attr('ry', nodeBorderRadius)
      .attr('class', 'box');

    placeholder  
      .append('text')
      .attr('class', PERSON_NAME_CLASS)
      .attr('x', namePos.x)
      .attr('y', namePos.y)
      .attr('dy', '.3em')
      .style('fill', nameColor)
      .style('font-size', 16)
      .text(d => d.person.id)
  }

  function removePlaceholderTile () {
    const placeholder = svg
      .selectAll(`g.${PLACEHOLDER_CLASS}`)
      .data([])
      .exit()
      .remove()
  }

};
