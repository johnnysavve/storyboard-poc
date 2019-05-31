const d3 = require('d3')
const reduce = require('lodash/reduce')
const map = require('lodash/map');
const max = require('lodash/max');
const filter = require('lodash/filter');
const cloneDeep = require('lodash/cloneDeep')

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
    sourceNode,
    addBlock
  } = config

  const {nodes, links} = preprocessData(treeData);

  const dispatch = d3.dispatch(
    'tiledragstart',
    'tiledragend',
    'addblock'
  );

  dispatch.on('tiledragstart', function (d) {
    d.id = 'dragging start';
  })

  dispatch.on('tiledragend', function (d) {
    d.id = 'dragging end';
  })

  dispatch.on('addblock', function (d) {
    const data = addBlock(d);

    const {nodes, links} = preprocessData(data);

    config.links = links
    config.nodes = nodes

    startRender(config)
  })

  config.links = links
  config.nodes = nodes
  config.dispatch = dispatch

  startRender(config)

  // Stash the old positions for transition.
  // nodes.forEach(function(d) {
  //   d.x0 = d.x
  //   d.y0 = d.y
  // })

  function preprocessData (treeData) {
  // Compute the new tree layout.
    //const nodes = tree.nodes(treeData).reverse()
    const maxDepth = getMaxDepth(treeData);
    const nodes = tree.nodes(expand(treeData, maxDepth)).reverse()
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * lineDepthY;
    })
  
    const links = filter(tree.links(nodes), link => !!link.target.id);
  
    return {nodes, links};
  }
  
  function startRender (config) {
    // Render sections
    renderSections(config)
  
    // Render tiles
    renderTiles(config)
  
    // Render lines connecting nodes
    renderLines(config)
  }
  
  function getMaxDepth (treeData) {
    return _depth(treeData, 0);
  
    function _depth (d, depth) {
      const children = d.children||d._children;
  
      d.depth = depth;
  
      if (children) {
        return max(map(children, child => _depth(child, depth+1)));
      } else {
        return depth;
      }
    }
  }
  
  function expand(d, maxDepth) {
    const children = d.children||d._children;
  
    if (d._children) {        
      d.children = d._children;
      d._children = null;       
    }
  
    if (!children && d.depth < maxDepth) {
      d.children = [{}];
    }
  
    if(children) {
      children.forEach(child => expand(child, maxDepth));
    }
  
    return d;
  }
  
  function getDepartmentClass(d) {
    const { person } = d
    const deptClass = person.department ? person.department.toLowerCase() : ''
  
    return [PERSON_DEPARTMENT_CLASS, deptClass].join(' ')
  }
}

module.exports = render
