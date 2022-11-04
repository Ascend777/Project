require('dotenv').config()
const request = require('request-promise')

const { GOREST_HOST, GOREST_APIKEY } = process.env;
const prefix = 'public/v2'

class UsersApi {
  constructor(host = GOREST_HOST) {
    this.host = host;
    this.request = request.defaults({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      // followAllRedirects: true, //
      json: true
    })
  }

  authenticate(apiKey = GOREST_APIKEY) {
    this.request = request.defaults({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      json: true
    })
  }

  async authenticate1(userCredentials) {
    const response = await this.getAuthToken(userCredentials)

    this.request = request.defaults({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${response.token}`
      },
      json: true
    })
  }

  getAuthToken(userCreds) {
    return this.request.post({
      url: `${this.host}/${prefix}/getToken`,
      body: userCreds
    })
  }


  /// POST /getToken
  // {
  //   username: "test",
  //   password: "testPassword"
  // }

  createUser(body) {
    const path = `${this.host}/${prefix}/users`

    return this.request.post({
      url: path,
      body: body
    })
  }

  getUsersList(queryStrings = {}) {
    const path = `${this.host}/${prefix}/users`

    return this.request.get({
      url: path,
      qs: queryStrings
    })
  }

  getUser(userId) {
    const path = `${this.host}/${prefix}/users/${userId}`

    return this.request.get({
      url: path,
    })
  }

  updateUser(userId, body) {
    const path = `${this.host}/${prefix}/users/${userId}`

    return this.request.put({
      url: path,
      body
    })
  }

  deleteUser(userId, resolveWithFullResponse = true) {
    const path = `${this.host}/${prefix}/users/${userId}`

    return this.request.delete({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    })
  }

}

module.exports = UsersApi;