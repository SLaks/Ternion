/* global GameBoard, Triangle */
/// <reference path="game.js" />
'use strict';


function GameUI(container, pendingContainer) {
	this.triangleWidth = 100;	// Width of a triangle in pixels
	this.triangleHeight = this.triangleWidth * 0.866;
	this.board = new GameBoard();

	container.classList.add('GameBackground');
	container.style.backgroundSize = this.triangleWidth + 'px';

	this.pendingContainer = pendingContainer;
	this.triangleContainer = document.createElement('div');
	// Center the triangle at the center of the board
	this.triangleContainer.style.marginLeft = -this.triangleWidth / 2;
	this.triangleContainer.style.marginTop = -this.triangleHeight / 2;
	container.appendChild(this.triangleContainer);

	this.createPending();
	this.addTriangle([0, 0]);

	this.triangleContainer.addEventListener('click', function (e) {
		var offset = this.triangleContainer.getBoundingClientRect();
		var location = this.hitTest(
			e.clientX - offset.left / 2,
			e.clienty - offset.top / 2
		);
		if (!this.board.isAllowed(location, this.pendingTriangle)) {
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
		this.pendingContainer.replaceChild(this.pendingContainer.firstChild, element);
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

	return [row, column];
};


/**
 * Creates an SVG element for the specified triangle.
 * 
 * @param {Triangle} triangle	The triangle object specifying the colors to create.
 * @param {int[]} [location]	The game location of the triangle; used to position the element.
 *								If omitted, the element will not be positioned, and will point upwards.
 */
GameUI.prototype.createTriangleElement = function (triangle, location) {
	var element = document.createElement('svg');

	if (location) {
		element.style.left = location[0] * (this.triangleWidth / 2) + 'px';
		element.style.top = location[1] * this.triangleHeight + 'px';
	}

	return element;
};