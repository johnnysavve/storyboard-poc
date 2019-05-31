const d3 = require('d3')
const reduce = require('lodash/reduce')
const concat = require('lodash/concat')

module.exports = renderLines

function renderLines(config = {}) {
  const {
    svg,
    links,
    nodes,
    margin,
    nodeWidth,
    nodeHeight,
    borderColor,
    animationDuration,
    dispatch
  } = config

  const pathData = links.filter(link => link.source.id);
  
  const newBlockPlaceData = reduce(nodes.filter(d => d.id), (places, d) => {
    const {parent=d} = d;

    if (!d.hasChild) {
      return concat(places, [{
        x: parseInt(nodeWidth / 2),
        y: margin.top / 2,
        isAfter: true,
        node: d,
        placeId: `${d.id}-tail`
      }, {
        x: parseInt(nodeWidth / 2),
        y: 0 - margin.top / 2,
        isAfter: false,
        node: d,
        placeId: `${parent.id}-${d.id}`
      }])
    } else {
      return concat(places, [{
        x: parseInt(nodeWidth / 2),
        y: 0 - margin.top / 2,
        isAfter: false,
        node: d,
        placeId: `${parent.id}-${d.id}`
      }])
    }
  }, [])

  const angle = d3.svg
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('linear')

  renderPaths(pathData)
  renderNewBlockPlaceholder(newBlockPlaceData)

  // Define the angled line function

  function renderPaths (data) {
    // Select all the links to render the lines
    const link = svg
    .selectAll('path.link')
    .data(data, d => d.target.id)

    // Enter any new links at the parent's previous position.
    link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke-width', 1.25)

  // Transition links to their new position.
  link
    .transition()
    .duration(animationDuration)
    .attr('d', d => {
      const isSameSection = d.source.sectionId === d.target.sectionId;
      const yAdjust = isSameSection?0:margin.top / 4;

      if (isSameSection) {
        return angle([
          {
            x: d.source.x + parseInt(nodeWidth / 2),
            y: d.source.y + nodeHeight
          },
          {
            x: d.target.x + parseInt(nodeWidth / 2),
            y: d.target.y
          }
        ]);
      } else {
        return angle([
          {
            x: d.source.x + parseInt(nodeWidth / 2),
            y: d.source.y + nodeHeight + yAdjust
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
            y: d.target.y - yAdjust
          }
        ])
      }
    })
    .attr('stroke', d => {
      const isSameSection = d.source.sectionId === d.target.sectionId;
      return isSameSection?'#03A678':'#800080';
    })

  // Animate the existing links to the parent's new position
  link
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

  function renderNewBlockPlaceholder (data) {
    const node = svg
      .selectAll('g.new-node')
      .data(data, d => d.placeId)

    const nodeEnter = node
      .enter()
      .insert('g')
      .attr('class', 'new-node')
      .attr('cursor', 'pointer')
      .attr('id', d => d.placeId)
      .on('click', function(d) {
        d3.event.stopPropagation();
        dispatch['addblock']({id: d.node.id, isAfter: d.isAfter});
      })
      .on('mouseover', function (d, i) {
        d3.select(this).select('circle').attr('fill-opacity', 1)
        d3.select(this).selectAll('path').attr('stroke-opacity', 1)
      })
      .on('mouseout', function (d, i) {
        d3.select(this).select('circle').attr('fill-opacity', 0)
        d3.select(this).selectAll('path').attr('stroke-opacity', 0)
      })
      
    nodeEnter
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 10)
      .attr('fill', '#3A7CFF')
      .attr('fill-opacity', 0)

    nodeEnter
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#3A7CFF')
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 1.25)
      .attr('d', d => {
        return angle([{
          x: d.x - nodeWidth/2,
          y: d.y
        }, {
          x: d.x + nodeWidth/2,
          y: d.y
        }])
      })

    nodeEnter
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 1.25)
      .attr('d', d => {
        return angle([{
          x: d.x - 5,
          y: d.y
        }, {
          x: d.x + 5,
          y: d.y
        }])
      })

    nodeEnter
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 1.25)
      .attr('d', d => {
        return angle([{
          x: d.x,
          y: d.y + 5
        }, {
          x: d.x,
          y: d.y - 5
        }])
      })

    const nodeUpdate = node
      .transition()
      .duration(animationDuration)
      .attr('transform', d => {
        const {node, isAfter} = d;
        const x = node.x;
        const y = isAfter?
          node.y+nodeHeight:
          node.y;

        return `translate(${x}, ${y})`;  
      })
      
    const nodeExit = node
      .exit()
      .transition()
      .duration(animationDuration)
      .remove()
  }
}
