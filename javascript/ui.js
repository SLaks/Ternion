/* global GameBoard, Triangle */
/// <reference path="game.js" />
'use strict';


var heightRatio = 0.866;

var svgNS = 'http://www.w3.org/2000/svg';
function GameUI(background) {
	this.board = new GameBoard();

	this.triangleContainer = background.firstElementChild;

	this.createPending();
	this.addTriangle([0, 0]);

	background.addEventListener('click', function (e) {
		var location = this.getEventLocation(e);
		if (this.board.get(location) || !this.board.isAllowed(location, this.pendingTriangle)) {
			return;
		}
		this.addTriangle(location);
	}.bind(this));

	background.addEventListener('mousemove', function (e) {
		var location = this.getEventLocation(e);
		if (this.board.get(location))
			this.pendingElement.setAttribute('class', 'Triangle Pending Preview');
		else {
			this.setLocation(this.pendingElement, location);
			this.pendingElement.setAttribute('class', this.pendingElement.getAttribute('class') + ' Pending');
		}
	}.bind(this));
}


/**
 * Finds the game location of the specified mouse event.
 */
GameUI.prototype.getEventLocation = function (e) {
	var offset = this.triangleContainer.getBoundingClientRect();
	return this.hitTest(
		e.clientX - offset.left,
		e.clientY - offset.top
	);
};


/**
 * Adds the current pending triangle at the specified location.
 */
GameUI.prototype.addTriangle = function (location) {
	this.board.add(location, this.pendingTriangle);
	this.setLocation(this.pendingElement, location);
	this.createPending();
};


/**
 * Generates a random triangle to insert next.
 */
GameUI.prototype.createPending = function () {
	this.pendingTriangle = Triangle.createRandom();

	this.pendingElement = this.createTriangleElement(this.pendingTriangle);
	this.pendingElement.setAttribute('class', 'Triangle Pending Preview');
	this.triangleContainer.appendChild(this.pendingElement);
};


/**
 * Returns the triangle containing the given pixel location.
 */
GameUI.prototype.hitTest = function (x, y) {
	// Get the current triangle size from the CSS (this may change
	// at any time due to media queries)
	var triangleWidth = parseInt(getComputedStyle(this.triangleContainer).fontSize, 10);
	var xUnit = triangleWidth / 2;
	var triangleHeight = triangleWidth * heightRatio;

	// First, get the triangle starting in the cell containing the
	// mouse cursor.
	var row = Math.floor(y / triangleHeight);
	var column = Math.floor(x / xUnit);

	// Now, check whether the mouse is above the left side of that
	// triangle, in which case it is actually within the preceding
	// triangle.

	// Which way does the slant point when moving rightwards?
	var isDownSlant = this.board.orientation([column, row]);

	// http://stackoverflow.com/a/4467559/34397
	function mod(a, b) { return ((a % b) + b) % b; }


	// Get the position of the mouse relative to the origin of the
	// triangle containing the slant.  Even if the location of the
	// triangle is negative, these need to be positive, so % won't
	// work properly.
	x = mod(x, xUnit);
	y = mod(y, triangleHeight);

	if (!isDownSlant) {
		if (y < triangleHeight - x / xUnit * triangleHeight)
			column--;
	} else {
		if (y > x / xUnit * triangleHeight)
			column--;
	}

	return [column, row];
};


/**
 * Creates an SVG element for the specified triangle.
 * 
 * @param {Triangle} triangle	The triangle object specifying the colors to create.
 * @param {int[]} [location]	The game location of the triangle; used to position the element.
 *								If omitted, the element will not be positioned, and will point upwards.
 */
GameUI.prototype.createTriangleElement = function (triangle, location) {
	var svg = document.createElementNS(svgNS, 'svg');

	function createPoint(x, y) {
		var point = svg.createSVGPoint();
		point.x = x;
		point.y = y;
		return point;
	}

	var polygon = document.createElementNS(svgNS, 'polygon');

	polygon.points.appendItem(createPoint(0, heightRatio));
	polygon.points.appendItem(createPoint(1, heightRatio));
	polygon.points.appendItem(createPoint(0.5, 0));

	// TODO: Draw color gradient
	polygon.style.fill = 'red';

	svg.appendChild(polygon);

	svg.setAttribute('viewBox', '0 0 1 ' + heightRatio);

	svg.sides = triangle.sides;


	if (location)
		this.setLocation(svg, location);
	else	// setLocation() sets the class for us
		svg.setAttribute('class', 'Triangle');

	return svg;
};


/**
 * Moves an existing triangle element to the specified game coordinates
 * @param {Element} element	The <svg> element to move
 * @param {int[]} location	The game location of to place it.
 */
GameUI.prototype.setLocation = function (element, location) {
	element.style.left = (location[0] / 2) + 'em';
	element.style.top = (location[1] * heightRatio) + 'em';

	var orientation = this.board.orientation(location);
	this.pendingElement.setAttribute('class', orientation ? 'Triangle Inverted' : 'Triangle');

	element.location = location;
	element.orientation = orientation;
};