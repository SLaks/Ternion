/* global GameBoard, Triangle */
/// <reference path="game.js" />
'use strict';


var svgNS = 'http://www.w3.org/2000/svg';
function GameUI(container, pendingContainer) {
	this.triangleWidth = 100;	// Width of a triangle in pixels
	this.triangleHeight = this.triangleWidth * 0.866;
	this.board = new GameBoard();

	container.classList.add('GameBackground');
	container.style.backgroundSize = this.triangleWidth + 'px';

	this.pendingContainer = pendingContainer;
	this.triangleContainer = document.createElement('div');
	// Center the triangle at the center of the board
	this.triangleContainer.style.marginLeft = -this.triangleWidth / 2 + 'px';
	this.triangleContainer.style.marginTop = -this.triangleHeight / 2 + 'px';
	container.appendChild(this.triangleContainer);

	this.createPending();
	this.addTriangle([0, 0]);

	container.addEventListener('click', function (e) {
		var offset = this.triangleContainer.getBoundingClientRect();
		var location = this.hitTest(
			e.clientX - offset.left,
			e.clientY - offset.top
		);
		if (this.board.get(location) || !this.board.isAllowed(location, this.pendingTriangle)) {
			return;
		}
		this.addTriangle(location);
	}.bind(this));
}


/**
 * Adds the current pending triangle at the specified location.
 */
GameUI.prototype.addTriangle = function (location) {
	this.board.add(location, this.pendingTriangle);
	this.triangleContainer.appendChild(this.createTriangleElement(this.pendingTriangle, location));
	this.createPending();
};


/**
 * Generates a random triangle to insert next.
 */
GameUI.prototype.createPending = function () {
	this.pendingTriangle = Triangle.createRandom();

	var element = this.createTriangleElement(this.pendingTriangle);
	if (this.pendingContainer.firstChild)
		this.pendingContainer.replaceChild(element, this.pendingContainer.firstChild);
	else
		this.pendingContainer.appendChild(element);
};


/**
 * Returns the triangle containing the given pixel location.
 */
GameUI.prototype.hitTest = function (x, y) {
	var row = Math.floor(y / (this.triangleHeight));
	var column = Math.floor(x / (this.triangleWidth / 2));

	var isDownSlant = this.board.orientation([column, row]);

	x %= this.triangleWidth / 2;
	y %= this.triangleHeight;
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

	if (location) {
		svg.style.left = location[0] * (this.triangleWidth / 2) + 'px';
		svg.style.top = location[1] * this.triangleHeight + 'px';

		var orientation = this.board.orientation(location);

		if (orientation)
			svg.classList.add('Inverted');

		svg.location = location;
		svg.orientation = orientation;
	}

	return svg;
};