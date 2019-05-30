const { createElement, PureComponent } = require('react')
const { init } = require('../chart')

class OrgChart extends PureComponent {
  static defaultProps = {
    id: 'react-org-chart'
  }

  constructor(props) {
    super(props);

    const { id, tree, storyboardData, ...options } = props
    this.state = { id: `#${id}`, data: tree, ...options }
  }

  componentDidMount() {
    const { id, tree, storyboardData, ...options } = this.props

    init(this.state)
  }

  render() {
    const { id } = this.props

    return createElement('div', {
      id
    })
  }
}

module.exports = OrgChart
