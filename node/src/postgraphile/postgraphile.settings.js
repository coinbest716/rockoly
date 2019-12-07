//export allowed operators
const connectionFilterAllowedOperators = [
  'isNull',
  'equalTo',
  'notEqualTo',
  'in',
  'notIn',
  'lessThan',
  'lessThanOrEqualTo',
  'greaterThan',
  'greaterThanOrEqualTo',
  'startsWith',
  'notStartsWith',
  'startsWithInsensitive',
  'notStartsWithInsensitive',
  'endsWith',
  'notEndsWith',
  'endsWithInsensitive',
  'notEndsWithInsensitive',
  'like',
  'notLike',
  'likeInsensitive',
  'notLikeInsensitive'
];

//export operators names
const connectionFilterOperatorNames = {
  isNull: 'isNull',
  equalTo: 'eq',
  notEqualTo: 'ne',
  in: 'in',
  notIn: 'nin',
  lessThan: 'lt',
  lessThanOrEqualTo: 'lte',
  greaterThan: 'ge',
  greaterThanOrEqualTo: 'gte',
  startsWith: 'starts',
  notStartsWith: 'nstarts',
  startsWithInsensitive: 'startsi',
  notStartsWithInsensitive: 'nstartsi',
  endsWith: 'ends',
  notEndsWith: 'nends',
  endsWithInsensitive: 'endsi',
  notEndsWithInsensitive: 'nendsi',
  like: 'like',
  notLike: 'nlike',
  likeInsensitive: 'ilike',
  notLikeInsensitive: 'nilike'
};

function removeDeleteGQLTagsFromSchema() {
  const fn = function (builder) {
    builder.hook('GraphQLObjectType:fields', (fields, build, {Self}) => {
      let newFields = Object.assign({}, fields);
      if (Self == 'Mutation') {
        let allEntries = Object.entries(newFields);
        for (let i = 0; i < allEntries.length; i++) {
          let key = allEntries[i][0];
          if (key.indexOf('delete') === 0) {
            delete newFields[key];
          }
        }
      }
      return newFields;
    });
  };
  return fn;
}


module.exports = {connectionFilterAllowedOperators,connectionFilterOperatorNames,removeDeleteGQLTagsFromSchema};