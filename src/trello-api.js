require('dotenv').config()
const request = require('request-promise')


const { TRELLO_HOST, TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env; 
const prefix = '1/boards'

class BoardsApi {
   constructor(host = TRELLO_HOST){
    this.host = host
      this.request = request.defaults({
        headers: {
           "Content-type" : "application/json",
            Accept: "application/json",
           
        },
        
        json: true
      })
   }

    authenticate(trelloApiKey = TRELLO_API_KEY, trelloApiToken = TRELLO_API_TOKEN) { 
        this.request = request.defaults({

    headers: {
    "Content-type" : "application/json",
    Accept: "application/json",
    Authorization: `OAuth oauth_consumer_key="${trelloApiKey}", oauth_token= "${trelloApiToken}"`
    },
    json: true
    })
}



    createBoard(body) {
        const path = `${this.host}/${prefix}/boards` 
  
    return this.request.post({
    url: path,
    body: body
    })
    }


   getBoardsList() {
        const path = `${this.host}/${prefix}/boards` 

    return this.request.get({
    url: path
    })
   }

   getBoard(boardId) {
    const path = `${this.host}/${prefix}/${boardId}/boards`   
  
    return this.request.get({
    url: path
    })
   }


   updateBoard(boardId,body) {
    const path = `${this.host}/${prefix}/${boardId}`


    return this.request.put({
    url: path,
    body: body
    })
}

    deleteBoard(boardId, resolvedWithFullResponse = true) {
    const path = `${this.host}/${prefix}/${boardId}`   
  
      return this.request.delete({
      url: path,
      resolveWithFullResponse: resolvedWithFullResponse
      })
   }

}

module.exports = BoardsApi;