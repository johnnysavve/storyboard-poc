const fakeData = require('../utils/fake-data')
const buildTreeData = require('../utils/buildTreeData')
const { init } = require('../chart')
const data = require('../utils/data.json')
const storyboardData = require('../utils/storyboard.json')
const cloneDeep = require('lodash/cloneDeep')

console.log(buildTreeData(storyboardData), cloneDeep(data));

//init({ id: '#root', data, lineType: 'angle' })
init({ id: '#root', data: buildTreeData(storyboardData), lineType: 'angle' })
