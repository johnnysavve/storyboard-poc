const fakeData = require('../utils/fake-data')
const { init } = require('../chart')
const data = require('../utils/data.json')

init({ id: '#root', data, lineType: 'angle' })
