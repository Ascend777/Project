const request = require('request-promise')

class UsersGitApi {
   constructor(){
      this.request = request.defaults({
        headers: {
            "User-Agent" : "JeremyLakhnenko",
           
        },
        json: true
      })
   }


   getUser(userId) {
      const path = "https://gorest.co.in/public/v2/users"


      return this.request.get({
      url: path
      })
   }

   getUser(userId) {
        const path = `https://gorest.co.in/public/v2/users/${userId}` //template literals
  
  
      return this.request.get({
      url: path
      })
   }
  
}

module.exports = UsersApi;