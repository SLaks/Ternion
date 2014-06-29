/// <reference path="lib/mocha.js" />
/// <reference path="lib/chai.js" />
/// <reference path="../javascript/ui.js" />
'use strict';

mocha.setup('bdd');
var expect = chai.expect;

//AVA
//VAV
//AVA

describe('GameUI', function () {
	var container = document.createElement('div');
	var ui = new GameUI(container);
	beforeEach(function () {
		container = document.createElement('div');
		ui = new GameUI(container);
		document.body.appendChild(container);
	});
	afterEach(function () {
		document.body.removeChild(container);
	});

	function assertRenderedTriangle(element, location) {
		if (location) {
			expect(element.location).to.deep.equal(location);
		} else {
			location = element.location;
		}
		expect(element.sides).to.deep.equal(ui.board.get(location).sides);
	}

	it('should create an initial triangle', function () {
		expect(ui.board.get([0, 0])).to.not.be.null;

		assertRenderedTriangle(ui.triangleContainer.firstElementChild, [0, 0]);
	});

	it('should create a pending triangle', function () {
		expect(ui.pendingTriangle).to.not.be.null;

		expect(ui.pendingElement.sides).to.deep.equal(ui.pendingTriangle.sides);
	});

	it('should add & recreate the pending triangle', function () {
		var oldPending = ui.pendingTriangle;
		var oldElement = ui.pendingElement;

		ui.addTriangle([2, 2]);
		expect(ui.board.get([2, 2])).to.equal(oldPending);
		assertRenderedTriangle(oldElement);

		expect(ui.pendingTriangle).to.not.equal(oldPending);
		expect(ui.pendingElement).to.not.equal(oldElement);
		expect(ui.pendingElement.sides).to.deep.equal(ui.pendingTriangle.sides);
	});

	it('should hittest existing triangles');
});