# Living Colors

[Living Colors live][github]

[github]: https://ykpeng.github.io

Living Colors is a cellular automaton that integrates Boid's flocking algorithm to create a grid of cells that evolve endlessly in color. The project is built with JavaScript, jQuery and CSS.

## Features & Implementation

### Evolving Colors

Boid's algorithm simulates the movements of birds in a flock. Here, instead of calculating a bird's spacial position in relation to its flock, Boid's algorithm is used to calculate a cell's RGB values in relation to those of its neighbors.

The three rules of Boid's algorithm are implemented as such:

**Cohesion**: a cell will match its RGB values to the average RGB values of its neighbors.

**Alignment**: a cell will match the rates of change in its RGB values to the average rates of change in the RGB values of its neighbors.

**Separation**: a cell's RGB values will maintain a minimum distance away from the RGB values of each of its neighbors.

The grid is a cellular automaton in that each cell's state is determined by the states of its eight neighbors.

The result is a vibrant display of color movements that are in constant tension.

![smooth]

### Bouncing off RGB Limits

When a cell reaches an RGB limit (0 or 255), it can either bounce off smoothly or ricochet to the other end of the RGB spectrum. The former creates gentle movements while the latter creates ripple effects. Users can press "s" and "w", respectively, to alternate between the effects. The document listens to keydown events and passes a boolean into `GameView.start()` to instruct `GameView` on what to render.

![ripple]

### Changing Frame Rates

Users can press "a" and "d" to slow down and speed up the frame rate, respectively. The initial frame rate is set at 60 fps, which is achieved by passing 1000/60 to window.setInterval(). The frame rate increments or decrements by 10 fps each time "a" or "d" is pressed. Limits are set at 10 fps and 100 fps. A rate variable is passed to `GameView.start()` to set the interval each time.

### Resetting Values

The grid listens to click events, upon which each cell resets its RGB values to random numbers between 0 and 255.  

## Future Directions for the Project

Many other interesting effects can be had by slightly changing parts of the code. Users can be allowed to adjust more values, such as the minimum separation distance.  

[smooth]: ./screenshots/smooth.png
[ripple]: ./screenshots/ripple.png
