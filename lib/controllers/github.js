const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`);
  })
  .get('/login/callback', async (req, res) => {
    const code = req.query.code;
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email} = await getGithubProfile(token);

    let user = await GithubUser.findByUsername(login);
    if (!user) {
      // create one user = insert
      user = await GithubUser.insert({ username: login, avatar: avatar_url, email });
    }

    const jsonWebToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    res.cookie(process.env.COOKIE_NAME, jsonWebToken, {
      httpOnly: true,
      maxAge: 4546464656,
    }).redirect('/api/v1/github/dashboard');
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
