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
    if (!d.hasChild) {
      return concat(places, [{
        x: d.x + parseInt(nodeWidth / 2),
        y: d.y + nodeHeight + margin.top / 2,
        isAfter: true,
        id: d.id
      }, {
        x: d.x + parseInt(nodeWidth / 2),
        y: d.y - margin.top / 2,
        isAfter: false,
        id: d.id
      }])
    } else {
      return concat(places, [{
        x: d.x + parseInt(nodeWidth / 2),
        y: d.y - margin.top / 2,
        isAfter: false,
        id: d.id
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
    .attr('stroke', '#03A678')
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 1.25)

  // Transition links to their new position.
  link
    .transition()
    .duration(animationDuration)
    .attr('d', d => {

      if (d.source.x === d.target.x) {
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
        ])
      }
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
      .data(data)

    const nodeEnter = node
      .enter()
      .insert('g')
      .attr('class', 'new-node')
      .attr('cursor', 'pointer')
      .on('click', function(d) {
        d3.event.stopPropagation();
        dispatch['addblock'](d);
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
      
  }
}
