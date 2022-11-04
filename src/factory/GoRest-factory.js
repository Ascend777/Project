const faker = require('faker');
const moment = require('moment')
const USER_GENDERS = ["female", "male"];

// YYYY-MM-DD
// 2022-10-29
const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, "days").format('YYYY-MM-DD');

const qaPrefix = 'QATestUser-'

const randomString = (length = 8) => faker.random.alphaNumeric(8)

const user = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: faker.random.arrayElement(USER_GENDERS),
    email: `${qaPrefix}${randomString()}@example.com`,
    status: "active"
  }
}

module.exports = {
  user,
  randomString,
  today,
  tomorrow,
  qaPrefix
}