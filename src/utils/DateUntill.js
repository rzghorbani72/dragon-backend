/* eslint no-shadow: 0 */
const moment = require('moment');

function todayUntilSevenDay() {
  const today = moment()
    .startOf('day')
    .toISOString();
  const sevenFromToday = moment(today)
    .add(7, 'days')
    .endOf('day')
    .toISOString();

  return {
    $gte: today,
    $lte: sevenFromToday,
  };
}

function todayUntilOneMonthAgo() {
  const today = moment()
    .startOf('day')
    .toISOString();
  const oneMonthsAgo = moment(today)
    .subtract(1, 'months')
    .toISOString();

  return {
    $gte: oneMonthsAgo,
    $lte: today,
  };
}

function todayUntilOneMonthAfter() {
  const today = moment()
    .startOf('day')
    .toISOString();
  const oneMonthsAfter = moment(today)
    .add(1, 'months')
    .toISOString();

  return {
    $gte: today,
    $lte: oneMonthsAfter,
  };
}

function todayUntilTwoMonthAfter() {
  const today = moment()
    .startOf('day')
    .toISOString();
  const twoMonthsAfter = moment(today)
    .add(2, 'months')
    .toISOString();

  return {
    $gte: today,
    $lte: twoMonthsAfter,
  };
}

function todayUntilStartOfMonth() {
  const today = moment()
    .startOf('day')
    .toISOString();
  const thiMonth = moment()
    .startOf('month')
    .toISOString();

  return {
    $gte: thiMonth,
    $lte: today,
  };
}

function thisMonth() {
  const startOfMonth = moment()
    .startOf('month')
    .toISOString();
  const endOfMonth = moment()
    .endOf('month')
    .toISOString();

  return {
    $gte: startOfMonth,
    $lte: endOfMonth,
  };
}

function thisWeek() {
  const startOfWeek = moment()
    .startOf('isoWeek')
    .toISOString();
  const endOfWeek = moment()
    .endOf('isoWeek')
    .toISOString();

  return {
    $gte: startOfWeek,
    $lte: endOfWeek,
  };
}

function today() {
  const startOfDay = moment()
    .startOf('day')
    .toISOString();
  const endOfDay = moment()
    .endOf('day')
    .toISOString();

  return {
    $gte: startOfDay,
    $lte: endOfDay,
  };
}

function toIsoDate(date) {
  return moment(date).startOf('day').toISOString();
}

function startDateEndDate(start, end) {
  const startDate = moment(start).startOf('day').toISOString();
  const endDate = moment(end).endOf('day').toISOString();

  return {
    $gte: startDate,
    $lte: endDate,
  };
}

module.exports = {
  today,
  todayUntilSevenDay,
  toIsoDate,
  thisWeek,
  thisMonth,
  todayUntilStartOfMonth,
  todayUntilOneMonthAfter,
  todayUntilTwoMonthAfter,
  todayUntilOneMonthAgo,
  startDateEndDate,
};
