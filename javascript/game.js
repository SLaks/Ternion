'use strict';

/**
 * Stores the contents of a single triangle.
 * @param {int[]}	sides The colors of each side in the triangle (right, left, vertical).
 */
function Triangle(sides) {
	sides.sort();
	this.sides = sides;
}

/**
 * The number of distinct colors that the sides of a triangle can have.
 */
Triangle.colorCount = 6;

Triangle.createRandom = function () {
	// TODO: Only allow distinct sides?
	return new Triangle([
		Math.floor(Math.random() * Triangle.colorCount),
		Math.floor(Math.random() * Triangle.colorCount),
		Math.floor(Math.random() * Triangle.colorCount)
	]);
};


/**
 * Stores and manipulates all of the triangles in the game board.
 */
function GameBoard() {
	this.contents = {};
}


/**
 * Gets the string key in the contents map for a given location.
 * @param {int[]}		location
 */
GameBoard.prototype.key = function(location) {
	return location.join(',');
};


/**
 * Gets the triangle at a given location.
 * @param {int[]}		location
 */
GameBoard.prototype.get = function (location) {
	return this.contents[this.key(location)];
};


/**
 * Gets the color at the given side and location.
 * @param {int[]}		locationSide
 */
GameBoard.prototype.getSide = function (locationSide) {
	var triangle = this.get(locationSide);
	if (!triangle)
		return null;
	return triangle.sides[locationSide[2]];
};


/**
 * Gets the orientation of the given location.
 * Returns 0 for an upwards-pointing triangle, or 1 for a downwards-pointing triangle.
 * @param {int[]}		location
 */
GameBoard.prototype.orientation = function (location) {
	return (location[0] + location[1]) % 2;
};


/**
 * Gets the three sides adjacent to a given location.
 * @param {int[]}		location
 */
GameBoard.prototype.getAdjacencies = function (location) {
	var x = location[0], y = location[1];
	var orientation = this.orientation(location);
	return [
		[x + 1, y, 1],
		[x - 1, y, 0],
		[x, y + (1 - 2 * orientation), 2]
	];
};


/**
 * Checks whether the specified triangle is allowed at the specified location.
 * 
 * @param {int[]}		location
 * @param {Triangle}	triangle
 */
GameBoard.prototype.isAllowed = function (location, triangle) {
	return this.getAdjacencies(location)
		.map(this.getSide.bind(this))
		.every(function (color, index) {
			return color === null || color === triangle.sides[index];
		});
};


/**
 * Adds a new triangle at the specified location.
 * 
 * @param {int[]}		location
 * @param {Triangle}	triangle
 */
GameBoard.prototype.add = function (location,triangle ) {
	if (this.get(location))
		throw new Error('Cannot overwrite existing triangle');
	if (!this.isAllowed(location, triangle))
		throw new Error('Cannot insert mismatching triangle');

	this.contents[this.key(location)] = triangle;
};
