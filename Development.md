#Triangle grid
The game board is a Cartesian grid of triangles.  To tessellate the triangles, every other triangle is inverted.  The origin, and all cells where  `x + y` is even, is upwards-pointing; odd cells are downwards-pointing.

The grid is oriented like CSS; positive X & Y are in the lower-right quadrant.

The sides of each triangle are identified by index.  `0` is the right side, `1` is the right side, and `2` is the vertical side (bottom for upwards-pointing; top for downwards-pointing).

#Classes
The classes in `game.js` track game state only and have no coupling to any UI or DOM elements.

##Triangle class
The `Triangle` class stores the contents of a triangle.  It just tracks the color of each side; it does not know where the triangle is or what orientation it is.

##GameBoard class
The `GameBoard` tracks the triangles in the board.  It stores every extant triangle, and it only allows mutations that result in a valid board.  (triangle orientations are simply computed from their locations)

Individual triangles are passed as an array of `[x, y]`; these arrays are passed to and returned by methods in `GameBoard`.  Individual sides of a triangle are passed as arrays of `[x, y, index]`, where `index` is `0`, `1`, or `2`, as described above.

#UI
All of the triangle UI, including the background, the triangles within the board, and phantom/preview triangles, are drawn in SVG.  These SVG triangles have a width of 1 and a height of .866 (`h = Math.sqrt(w*w - (w/2) * (w/2))`, via Pythagorean Theorem), and are then scaled (via SVG transform or `background-size`) to the appropriate size.

The triangles are laid out on a grid in units of half the width in the X axis and the entire height in the Y axis.  The contents of the grid are drawn in an absolutely positioned element, centered (with CSS) so that the middle of the [0, 0] triangle is at the center of the screen.
The background is aligned to the triangle grid using `background-position: center center`, with the center of an upwards-pointing triangle in the center of the image.
Because the centering is achieved in CSS, no Javascript is needed to re-align things as the window is resized.