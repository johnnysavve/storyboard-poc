const cloneDeep = require('lodash/cloneDeep');
const groupBy = require('lodash/groupBy');
const reduce = require('lodash/reduce');
const concat = require('lodash/concat');

module.exports = function buildTreeData (data) {
  const {blocks, links} = cloneDeep(data);
  const entryBlock = blocks['/'];
  const entryBlockId = entryBlock.id;
  const paths = groupBy(links, link => `${link.source.id}`);

  return treeDataGenerator(entryBlock);

  function treeDataGenerator (entry) {
    const toLinks = paths[`${entry.id}`];

    entry.children = reduce(toLinks, (children=[], link) => {
      const child = treeDataGenerator(blocks[`/${link.target.id}`])
      return children.concat([child]);
    }, [])

    entry.hasChild = entry.children.length > 0;

    return entry;
  }
}