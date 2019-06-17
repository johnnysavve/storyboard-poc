const cloneDeep = require('lodash/cloneDeep');
const filter = require('lodash/filter');
const groupBy = require('lodash/groupBy');
const mapValues = require('lodash/mapValues');
const map = require('lodash/map');
const keys = require('lodash/keys');

module.exports = function buildSectionTree (data) {
  const {blocks, links} = cloneDeep(data);

  const sections = mapValues(
    groupBy(blocks, block => block.sectionId),
    blocks => map(blocks, block => block.id)
  );

  const sectionIds = keys(sections);

  const sameSourceTargets = mapValues(
    groupBy(links, link => link.source.id),
    links => map(links, link => link.target.id)
  );

  console.log(sections, sameSourceTargets, links)
}