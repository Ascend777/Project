const { expect } = require('chai');
const BoardsApi = require('../../src/trello-api')
const guard = require('../utils/guard')
const factory = require('../../src/factory/trello-factory')

// let api;
// let unauthenticatedApi;

describe(" Trello Boards API tests (/boards)", function () {
  let api;
  let unauthenticatedApi;

  before(async function () {
    api = new BoardsApi();
    api.authenticate();
     });

    unauthenticatedApi = new BoardsApi();


  afterEach(async () => {
    await testCleanup()
  })


  describe("Trello Create Board (POST /boards)", function () {

    it("Can create new board (POST /boards)", async function () {

      const boardToBeCreated = {
        "name": "Bill Shmo",
        "gender": "Male",
        "email": `${factory.qaPrefix}${Math.random().toString(36).slice(2)}@example.com`,
        "status": "active"
      };

      let response = await api.createBoard(boardToBeCreated)

      expect(response).to.have.property('id').that.is.a('number')
    })


    })

  
    it("Error is returned when creating a board and with missing email from the request (POST /board)", async function () {

      const boardToBeCreated = factory.board();
      delete boardToBeCreated.email;

      const error = await guard(async () => api.createBoard(boardToBeCreated))

      expect(error).to.have.property('statusCode', 422)
      expect(error.error).to.eql([{ field: 'email', message: "email not found" }])

      let response;
      try {
        response = await unauthenticatedApi.createBoard(boardToBeCreated)
      } catch (error) {
        expect(error).to.have.property('statusCode', 401)
        expect(error.error).to.eql({ "message": "missing email" })
        expect(error.response.body).to.eql({ "message": "missing email" })
      }

    })
  

  describe("Trello Update a board (PUT /boards)", function () {

    it("Can update a board by ID (PUT /boards)", async function () {
      let createdBoardResponse = await api.createBoard(factory.board())
      console.log("Board Created: ", JSON.stringify(createdBoardResponse, null, 2))

      const boardToBeUpdated = {
        "status": "inactive",
      }

      const boardToBeUpdatedResponse = await api.updateBoard(createdBoardResponse.id, boardToBeUpdated)
      console.log("Board has been updated: ", JSON.stringify(boardToBeUpdatedResponse, null, 2))
    })

    it("Error is returned while updating board when status value is missing in the request body", async function() {

        const boardToBeUpdated = factory.board();
        delete boardToBeUpdated.status;

        const error = await guard(async () => api.updateBoard(boardToBeUpdated))

        expect(error.error).to.eql([{ field: 'status', message: "status not found" }])


    })
  })



  describe("Trello Get boards list (GET /boards)", function () {

    it("Can get a list of boards (GET /boards)", async function () {
      let response = await api.getBoardsList()
      console.log(JSON.stringify(response, null, 2))

      expect(response).to.be.an('array').that.has.lengthOf(10)
      response.forEach((board) => {
        expect(board).to.have.property('id').that.is.a('number')
        expect(board).to.have.property('name').that.is.a('string')
        expect(board).to.have.property('email').that.is.a('string')
        expect(board).to.have.property('gender').that.is.a('string')
        expect(board).to.have.property('status').that.is.a('string')
      })
    })

  })

  describe("Trello Get a board (GET /boards/:id)", function () {

    it("Trello Get board by ID (GET /boards/:id)", async function () {
      const boardToBeCreated = {
        "name": "John Doe",
        "gender": "Female",
        "email": `${Math.random().toString(36).slice(2)}@example.com`,
        "status": "active"
      };
      let createdBoardResponse = await api.createBoard(boardToBeCreated)
      let getBoardResponse = await api.getBoard(createdBoardResponse.id)

      expect(getBoardResponse).to.have.property('id').that.is.a('number')
    })

    it("Error is returned with missing ID property", async function (){

    const boardToBeCreated = factory.board();

    const error = await guard(async () => unauthenticatedApi.createBoard(boardToBeCreated))

      expect(error).to.have.property('statusCode', 401)
      expect(error.error).to.eql({ "message": "missing ID number" })
      expect(error.response.body).to.eql({ "message": "missing ID number" })
  })

  })

  const testCleanup = async () => {

    const boardsToBeDeleted = await api.getBoardsList({ email: factory.qaPrefix })


    await Promise.all(boardsToBeDeleted.map((board) => {
      return api.deleteBoard(board.id)
    }))
  }


  describe("Trello Delete board by ID (DELETE /boards/:id)", function () {
    

    it("Trello delete board by ID (DELETE /boards/:id)", async function () {
      let createdBoardResponse = await api.createBoard(factory.board())
      console.log(createdBoardResponse)
      let deleteResponse = await api.deleteBoard(createdBoardResponse.id)

      expect(deleteResponse).to.have.property("statusCode", 204)
      expect(deleteResponse).to.have.property("statusMessage", "No Content")

    })
  })
})
