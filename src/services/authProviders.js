/* eslint-disable camelcase */
const axios = require('axios');

exports.facebook = async (access_token) => {
  const fields = 'id, first_name, last_name, email, picture';
  const url = 'https://graph.facebook.com/me';
  const params = { access_token, fields };
  const response = await axios.get(url, { params });
  const {
    id, first_name: givenName, last_name: familyName, email, picture,
  } = response.data;
  return {
    service: 'facebook',
    profile: picture.data.url,
    id,
    givenName,
    familyName,
    email,
  };
};

exports.google = async (access_token) => {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = { access_token };
  const response = await axios.get(url, { params });
  const {
    sub, given_name: givenName, family_name: familyName, email, picture: profile,
  } = response.data;
  return {
    service: 'google',
    profile,
    id: sub,
    givenName,
    familyName,
    email,
  };
};
