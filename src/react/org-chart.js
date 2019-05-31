const { createElement, PureComponent } = require('react')
const find = require('lodash/find');
const extend = require('lodash/extend');
const remove = require('lodash/remove');

const { init } = require('../chart')
const buildTreeData = require('../utils/buildTreeData')

class OrgChart extends PureComponent {
  static defaultProps = {
    id: 'react-org-chart'
  }

  constructor(props) {
    super(props);

    const { id, tree, storyboardData, ...options } = props

    this.addBlock = this.addBlock.bind(this);

    this.state = {
      id: `#${id}`,
      data: tree,
      storyboardData,
      addBlock: this.addBlock,
      div: createElement('div', {
        id
      }),
      ...options
    }
  }

  componentDidMount() {
    const { id, tree, storyboardData, ...options } = this.props
    init(this.state)
  }

  render() {
    const { id } = this.props
    return this.state.div;
  }

  addBlock (addingPlace) {

    const {storyboardData} = this.state;
    const {blocks, links} = storyboardData;
    const {id, isAfter} = addingPlace;

    const newId = Math.floor(Math.random()*1000001);

    if (isAfter) {
      const block = blocks[`/${id}`];
      const {sectionId} = block;

      const newLink = {
        source: {id},
        target: {id: newId}
      };
      const newBlock = {
        id: newId,
        sectionId
      };

      blocks[`/${newId}`] = newBlock;
      links.push(newLink);
      
    } else {
      const block = blocks[`/${id}`]||blocks['/'];
      const {sectionId} = block;
      const isEntry = !blocks[`/${id}`];

      const newBlock = {
        id: newId,
        sectionId
      };

      if (isEntry) {
        const newLink = {
          source: {id: newId},
          target: {id}
        }

        blocks['/'] = newBlock;
        blocks[`/${id}`] = block;
        links.push(newLink);
      } else {
        const brokenLink = remove(
          links,
          link => link.target.id === id
        )[0];

        links.push({
          source: {id: brokenLink.source.id},
          target: {id: newId}
        });

        links.push({
          source: {id: newId},
          target: {id: brokenLink.target.id}
        });

        blocks[`/${newId}`] = newBlock;
      }

    }

    const data = buildTreeData(storyboardData);

    this.setState((state) => extend({}, state, {
      storyboardData,
      data
    }));

    return data;
  }
}

module.exports = OrgChart
