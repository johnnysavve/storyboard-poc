const React = require('react')
const ReactDOM = require('react-dom')
const OrgChart = require('../react/org-chart')
const fakeData = require('../utils/fake-data')
const storyboardData = require('../utils/storyboard.json')
const buildTreeData = require('../utils/buildTreeData')
const buildSectionTree = require('../utils/buildSectionTree')

const root = document.getElementById('root')
const tree = buildTreeData(storyboardData)

const props = {
  tree, storyboardData
}

ReactDOM.render(React.createElement(OrgChart, props, null), root)
