'use strict';

/**
 * Utility Functions
 */

// Dependencies
var _ = require('lodash');

// Module Exports

var utils = module.exports = {};

/**
 * Prepare values
 *
 * Transform a JS date to SQL date and functions
 * to strings.
 */

utils.prepareValue = function (value) {
  if (!value) {
    return value;
  }

  // Cast functions to strings
  if (_.isFunction(value)) {
    value = value.toString();
  }

  // Store Arrays and Objects as strings
  if (Array.isArray(value) || value.constructor && value.constructor.name === 'Object') {
    try {
      value = JSON.stringify(value);
    } catch (e) {
      // just keep the value and let the db handle an error
      value = value;
    }
  }

  return value;
};

/**
 * Builds a Select statement determining if Aggeregate options are needed.
 */

utils.buildSelectStatement = function (criteria, table) {
  var query = 'SELECT ';

  /* Handle LIMIT */
  if (criteria.limit && !criteria.skip) {
    query += 'TOP ' + criteria.limit + ' ';
  }

  /* Handle SELECT */
  if (criteria.select) {
    if (typeof criteria.select === 'string') {
      criteria.select = [criteria.select];
    }

    query += '[' + criteria.select.join('], [') + '] ';
  } else {
    criteria.select = [];
  }

  /* Handle GROUP BY */
  if (criteria.groupBy) {
    if (Array.isArray(criteria.groupBy)) {
      criteria.groupBy.forEach(function (value) {
        if (criteria.select.indexOf(value < 0)) {
          query += '[' + value + '], ';
        }
      });
    } else if (typeof criteria.groupBy === 'string' && criteria.select.indexOf(criteria.groupBy < 0)) {
      query += '[' + criteria.groupBy + '], ';
    }
  }

  if (!criteria.select.length && !criteria.orderBy) {
    query += '* ';
  }

  /* Handle SUM */
  if (criteria.sum) {
    if (Array.isArray(criteria.sum)) {
      criteria.sum.forEach(function (value) {
        query += 'SUM([' + value + ']) AS [' + value + '], ';
      });
    } else {
      query += 'SUM([' + criteria.sum + ']) AS [' + criteria.sum + '], ';
    }
  }

  /* Handle AVG (casting to float to fix percision with trailing zeros) */
  if (criteria.average) {
    if (Array.isArray(criteria.average)) {
      criteria.average.forEach(function (value) {
        query += 'AVG(CAST([' + value + '] AS FLOAT)) AS [' + value + '], ';
      });
    } else {
      query += 'AVG(CAST([' + criteria.average + '] AS FLOAT)) AS [' + criteria.average + '], ';
    }
  }

  /* Handle MAX */
  if (criteria.max) {
    if (Array.isArray(criteria.max)) {
      criteria.max.forEach(function (value) {
        query += 'MAX([' + value + ']) AS [' + value + '], ';
      });
    } else {
      query += 'MAX([' + criteria.max + ']) AS [' + criteria.max + '], ';
    }
  }

  /* Handle MIN */
  if (criteria.min) {
    if (Array.isArray(criteria.min)) {
      criteria.min.forEach(function (value) {
        query += 'MIN([' + value + ']) AS [' + value + '], ';
      });
    } else if (typeof criteria.min === 'number') {
      query += 'MIN([' + criteria.min + ']) AS [' + criteria.min + '], ';
    }
  }

  /* Trim any trailing comma */
  query = query.replace(/,\s*$/, ' ');

  query += 'FROM [' + table + '] ';

  return query;
};
