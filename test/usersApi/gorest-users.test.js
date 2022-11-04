// const expect = require('chai').expect;
const { expect } = require('chai');
const GoRestUsersApi = require('../../src/GoRest-api')
const guard = require('../utils/guard')
const factory = require('../../src/factory/GoRest-factory.js')

describe("GoRest Users API tests (/users)", function () {
  let api;
  let unauthenticatedApi;

  // Test cleanup function
  const testCleanup = async () => {

    const usersToBeDeleted = await api.getUsersList({ email: factory.qaPrefix })

    // const arrayOfPromises = usersToBeDeleted.map((user) => {
    //   return api.deleteUser(user.id)
    // });

    // await Promise.all(arrayOfPromises)

    await Promise.all(usersToBeDeleted.map((user) => {
      return api.deleteUser(user.id)
    }))
  }


  before(async function () {
    api = new GoRestUsersApi();
    api.authenticate();
    // api.authenticate1({
    //   username: "test",
    //   password: "testPassword"
    // });

    unauthenticatedApi = new GoRestUsersApi();

    await testCleanup()
  })

  afterEach(async () => {
    await testCleanup()
  })

  describe("Users API Security tests", function () {

    it("Error is returned when auth parameters are missing from the request (GET /users)", async function () {
      const userToBeCreated = factory.user();

      const error = await guard(async () => unauthenticatedApi.createUser(userToBeCreated))

      expect(error).to.have.property('statusCode', 401)
      expect(error.error).to.eql({ "message": "Authentication failed" })
      expect(error.response.body).to.eql({ "message": "Authentication failed" })
      let response;
      try {
        response = await unauthenticatedApi.createUser(userToBeCreated)
      } catch (error) {
        expect(error).to.have.property('statusCode', 401)
        expect(error.error).to.eql({ "message": "Authentication failed" })
        expect(error.response.body).to.eql({ "message": "Authentication failed" })
      }
    })
  })

  describe("GoRest Create User (POST /users)", function () {

    it("Can create new user (POST /users)", async function () {
      this.retries = 3; // this only works with mocha using regular callback function, not the arrow functions
      this.timeout = 30000;

      const userToBeCreated = {
        "name": "John Doe",
        "gender": "Female",
        "email": `${factory.qaPrefix}${Math.random().toString(36).slice(2)}@example.com`,
        "status": "active"
      };

      let response = await api.createUser(userToBeCreated)

      expect(response).to.have.property('id').that.is.a('number')
    })

    const testScenarios = [
      "John",
      "John Doe",
      "VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVery Long name",
      "Name with '",
      "Name with $",
    ]

    testScenarios.forEach(function (name) {
      it(`Can create users with different names: ${name}`, async () => {
        const userToBeCreated = {
          ...factory.user(),
          name
        }
        const userCreateResponse = await api.createUser(userToBeCreated)

        expect(userCreateResponse).to.have.property('name', name)
      })
    })

    it("Can create multiple users in parallel (POST /users)", async function () {
      const user1 = {
        ...factory.user(),
        name: `User 1 (${factory.randomString()})`
      }

      const user2 = {
        ...factory.user(),
        name: `User 2 (${factory.randomString()})`
      }

      const user3 = {
        ...factory.user(),
        name: `User 3 (${factory.randomString()})`
      }

      const myUserArray = await Promise.all([
        api.createUser(user1),
        api.createUser(user2),
        api.createUser(user3)
      ])
      console.log(myUserArray)
      myUserArray.forEach((user) => {
        expect(user).to.have.property('id').that.is.a('number')

      })
    })

    it("Error is returned when creating a user and email is empty in the request (POST /users)", async function () {

      const userToBeCreated = {
        ...factory.user(),
        email: "", // overriding existing prop
      };
      const error = await guard(async () => api.createUser(userToBeCreated))

      expect(error).to.have.property('statusCode', 422)
      expect(error.error).to.eql([{ field: 'email', message: "can't be blank" }])
    })

    it("Error is returned when creating a user and email is missing from the request (POST /users)", async function () {

      const userToBeCreated = factory.user();
      delete userToBeCreated.email;

      const error = await guard(async () => api.createUser(userToBeCreated))

      expect(error).to.have.property('statusCode', 422)
      expect(error.error).to.eql([{ field: 'email', message: "can't be blank" }])
    })
  })

  describe("GoRest Update a user (PUT /users)", function () {

    it("Can update single property of a user by ID (PUT /users)", async function () {
      let createdUserResponse = await api.createUser(factory.user())
      console.log("CREATED: ", JSON.stringify(createdUserResponse, null, 2))

      const userToBeUpdated = {
        "status": "inactive",
      }

      const userToBeUpdatedResponse = await api.updateUser(createdUserResponse.id, userToBeUpdated)
      console.log("UPDATED: ", JSON.stringify(userToBeUpdatedResponse, null, 2))
    })
  })



  describe("GoRest Get users list (GET /users)", function () {

    it("Can get a list of users (GET /users)", async function () {
      let response = await api.getUsersList()
      console.log(JSON.stringify(response, null, 2))

      expect(response).to.be.an('array').that.has.lengthOf(10)
      response.forEach((user) => {
        expect(user).to.have.property('id').that.is.a('number')
        expect(user).to.have.property('name').that.is.a('string')
        expect(user).to.have.property('email').that.is.a('string')
        expect(user).to.have.property('gender').that.is.a('string')
        expect(user).to.have.property('status').that.is.a('string')
      })
    })

    it("Can filter a list of users by name (POST /users)", async function () {
      const user1 = {
        ...factory.user(),
        name: `TestUser 1 (${factory.randomString()})`
      }

      const user2 = {
        ...factory.user(),
        name: `TestUsers 2 (${factory.randomString()})`
      }

      const user3 = {
        ...factory.user(),
        name: `User 3 (${factory.randomString()})`
      }

      await Promise.all([
        api.createUser(user1),
        api.createUser(user2),
        api.createUser(user3)
      ])

      let response = await api.getUsersList({
        name: "TestUser",
        status: "active"
      })

      expect(response).to.be.an('array').that.has.lengthOf(2)
    })
  })

  describe("GoRest Get user by ID (GET /users/:id)", function () {

    it("GoRest Get user by ID (GET /users/:id)", async function () {
      const userToBeCreated = {
        "name": "John Doe",
        "gender": "Female",
        "email": `${Math.random().toString(36).slice(2)}@example.com`,
        "status": "active"
      };

      let createdUserResponse = await api.createUser(userToBeCreated)
      let getUserResponse = await api.getUser(createdUserResponse.id)

      expect(getUserResponse).to.have.property('id').that.is.a('number')
    })

    it("Error is returned when getting a user by ID that doesn't exist")

  })

  describe("GoRest Delete user by ID (DELETE /users/:id)", function () {

    it("GoRest delete user by ID (DELETE /users/:id)", async function () {
      let createdUserResponse = await api.createUser(factory.user())
      console.log(createdUserResponse)
      let deleteResponse = await api.deleteUser(createdUserResponse.id)

      expect(deleteResponse).to.have.property("statusCode", 204)
      expect(deleteResponse).to.have.property("statusMessage", "No Content")

    })
  })
})
