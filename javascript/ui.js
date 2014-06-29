/* global GameBoard, Triangle */
/// <reference path="game.js" />
'use strict';


var svgNS = 'http://www.w3.org/2000/svg';
function GameUI(container) {
	this.triangleWidth = 100;	// Width of a triangle in pixels
	this.triangleHeight = this.triangleWidth * 0.866;
	this.board = new GameBoard();

	container.classList.add('GameBackground');
	container.style.backgroundSize = this.triangleWidth + 'px';

	this.triangleContainer = document.createElement('div');
	// Center the triangle at the center of the board
	this.triangleContainer.style.marginLeft = -this.triangleWidth / 2 + 'px';
	this.triangleContainer.style.marginTop = -this.triangleHeight / 2 + 'px';
	container.appendChild(this.triangleContainer);

	this.createPending();
	this.addTriangle([0, 0]);

	container.addEventListener('click', function (e) {
		var location = this.getEventLocation(e);
		if (this.board.get(location) || !this.board.isAllowed(location, this.pendingTriangle)) {
			return;
		}
		this.addTriangle(location);
	}.bind(this));

	container.addEventListener('mousemove', function (e) {
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
	// First, get the triangle starting in the cell containing the mouse.
	var row = Math.floor(y / (this.triangleHeight));
	var column = Math.floor(x / (this.triangleWidth / 2));

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
	x = mod(x, this.triangleWidth / 2);
	y = mod(y, this.triangleHeight);

	if (!isDownSlant) {
		if (y < this.triangleHeight - x / (this.triangleWidth / 2) * this.triangleHeight)
			column--;
	} else {
		if (y > x / (this.triangleWidth / 2) * this.triangleHeight)
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

	polygon.points.appendItem(createPoint(0, 0.866));
	polygon.points.appendItem(createPoint(1, 0.866));
	polygon.points.appendItem(createPoint(0.5, 0));

	// TODO: Draw color gradient
	polygon.style.fill = 'red';

	svg.appendChild(polygon);

	svg.style.width = this.triangleWidth + 'px';
	svg.style.height = this.triangleHeight + 'px';

	svg.setAttribute('viewBox', '0 0 1 0.866');

	svg.sides = triangle.sides;

	svg.classList.add('Triangle');

	if (location)
		this.setLocation(svg, location);

	return svg;
};


/**
 * Moves an existing triangle element to the specified game coordinates
 * @param {Element} element	The <svg> element to move
 * @param {int[]} location	The game location of to place it.
 */
GameUI.prototype.setLocation = function (element, location) {
	element.style.left = location[0] * (this.triangleWidth / 2) + 'px';
	element.style.top = location[1] * this.triangleHeight + 'px';

	var orientation = this.board.orientation(location);
	this.pendingElement.setAttribute('class', orientation ? 'Triangle Inverted' : 'Triangle');

	element.location = location;
	element.orientation = orientation;
};