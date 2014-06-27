/// <reference path="lib/mocha.js" />
/// <reference path="lib/chai.js" />
/// <reference path="../javascript/game.js" />
'use strict';

mocha.setup('bdd');
var expect = chai.expect;

//AVA
//VAV
//AVA

describe('GameBoard', function () {
	var board = new GameBoard();
	beforeEach(function () {
		board = new GameBoard();
	});

	it('should report orientations', function () {
		expect(board.orientation([0, 0])).to.equal(0);
		expect(board.orientation([1, 0])).to.equal(1);
		expect(board.orientation([0, 1])).to.equal(1);
		expect(board.orientation([1, 1])).to.equal(0);
	});

	it('should start empty', function () {
		expect(board.get([0, 0])).to.be.null;
		expect(board.get([1, 0])).to.be.null;
	});

	it('should add triangles', function () {
		var triangle = new Triangle([1, 2, 3]);
		board.add([0, 0], triangle);
		expect(board.get([0, 0])).to.equal(triangle);

		triangle = new Triangle([7, 4, 3]);
		board.add([2, 0], triangle);
		expect(board.get([2, 0])).to.equal(triangle);

		triangle = new Triangle([4, 1, 3]);
		board.add([1, 0], triangle);
		expect(board.get([1, 0])).to.equal(triangle);

		triangle = new Triangle([5, 6, 3]);
		board.add([0, 1], triangle);
		expect(board.get([0, 1])).to.equal(triangle);
	});

	it('should return adjacencies', function () {
		expect(board.getAdjacencies([0, 0])).to.deep.equal([
			[1, 0, 1],
			[-1, 0, 0],
			[0, 1, 2]
		]);
	});

	it('should report invalid placements', function () {
		board.add([0, 1], new Triangle([1, 9, 9]));
		board.add([2, 1], new Triangle([9, 0, 9]));
		board.add([1, 2], new Triangle([9, 9, 5]));

		expect(board.isAllowed([1, 1], new Triangle([0, 1, 2]))).to.be.false;
	});
});