const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
  const token = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    })
  });

  const { access_token } = await token.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
};

module.exports = { exchangeCodeForToken, getGithubProfile };
