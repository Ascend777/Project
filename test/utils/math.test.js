// const expect = require('chai').expect;
// const double = require('./math').double;

const { expect } = require('chai');
const { double, triple } = require('../../src/math')


describe("Math functions",function(){

    // Hooks
    before(function () {
        // runs before all tests in this test file
    })

    after(function () {
        // runs after all tests in this test file
    })

    beforeEach(function () {
        // runs before each test in this test file
    })

    afterEach(function () {
        // runs after each test in this test file
    })



        describe("Double function", function () {

            it("passing 3 to double() function results in 6", function(){

            expect(double(3)).to.equal(6)
            })


            it("passing 6 to double() function results in 12", function(){
            
            expect(double(6)).to.equal(12)
            })
            })

        describe("Triple function", function () {

            it("passing 3 to triple() function results in 9", function(){

            expect(triple(3)).to.equal(9)
            })


            it("passing 4 to triple() function results in 12", function(){
            
            expect(triple(4)).to.equal(12)
            })



    
    
})
})