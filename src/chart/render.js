const reduce = require('lodash/reduce')
const map = require('lodash/map');
const max = require('lodash/max');
const filter = require('lodash/filter');

const { wrapText, helpers } = require('../utils')
const renderLines = require('./render-lines')
const renderTiles = require('./render-tiles')
const renderSections = require('./render-sections')
const onClick = require('./on-click')
const iconLink = require('./components/icon-link')

const CHART_NODE_CLASS = 'org-chart-node'
const PERSON_LINK_CLASS = 'org-chart-person-link'
const PERSON_NAME_CLASS = 'org-chart-person-name'
const PERSON_TITLE_CLASS = 'org-chart-person-title'
const PERSON_DEPARTMENT_CLASS = 'org-chart-person-dept'
const PERSON_REPORTS_CLASS = 'org-chart-person-reports'

function render(config) {
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
    avatarWidth,
    lineDepthY,
    treeData,
    sourceNode
  } = config

  // Compute the new tree layout.
  const nodes = tree.nodes(treeData).reverse()
  // const maxDepth = getMaxDepth(treeData);
  // const nodes = tree.nodes(expand(treeData, maxDepth)).reverse()

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * lineDepthY;
  })

  const links = tree.links(nodes)
  //const links = filter(tree.links(nodes), link => !!link.target.id);

  config.links = links
  config.nodes = nodes

  // Render tiles
  renderTiles(config)

  // Render lines connecting nodes
  renderLines(config)

  // Render sections
  renderSections(config)

  // Stash the old positions for transition.
  // nodes.forEach(function(d) {
  //   d.x0 = d.x
  //   d.y0 = d.y
  // })
}

function getDepartmentClass(d) {
  const { person } = d
  const deptClass = person.department ? person.department.toLowerCase() : ''

  return [PERSON_DEPARTMENT_CLASS, deptClass].join(' ')
}

module.exports = render
