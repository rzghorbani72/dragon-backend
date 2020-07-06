const { pick, isEmpty } = require('lodash');

function unsetEmptyFields(updateData, AllowedBodyData) {
  const updatedData = pick(updateData, AllowedBodyData);

  const $unset = {};
  Object.keys(updatedData).forEach((key) => {
    if (!updatedData[key]) {
      $unset[key] = 1;
      delete updatedData[key];
    }
  });
  updatedData.$unset = $unset;

  if (isEmpty(updatedData.$unset)) { delete updatedData.$unset; }

  return updatedData;
}

module.exports = unsetEmptyFields;
