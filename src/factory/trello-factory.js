const faker = require('faker');
const moment = require('moment')
const BOARD_GENDERS = ["female", "male"];

// YYYY-MM-DD
// 2022-10-29
const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, "days").format('YYYY-MM-DD');

const qaPrefix = 'QATestUser-'

const randomString = (length = 8) => faker.random.alphaNumeric(8)

const board = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: faker.random.arrayElement(BOARD_GENDERS),
    email: `${qaPrefix}${randomString()}@example.com`,
    status: "active"
  }
}

module.exports = {
  board,
  randomString,
  today,
  tomorrow,
  qaPrefix
}