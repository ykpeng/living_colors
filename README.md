# Living Colors

[Living Colors live][heroku]

[heroku]: https://simpatico.herokuapp.com/

Living Colors is a visual experiment that combines two algorithms to allow a grid of cells to evolve endlessly in color. It applies Boid's algorithm for simulating the movements of birds in a flock. Instead of calculating a bird's position in relation to its flock, Boid's algorithm is used here to calculate a cell's RGB values in relation to those of its neighbors. A cellular automaton algorithm is also used in that a cell's state is determined by the states of its eight neighbors. The project is built with JavaScript, jQuery and CSS.

## Features & Implementation

### Evolving

Cohesion: a cell will match its RGB values to the average RGB values of its neighbors.
Alignment: a cell will match the rate of change in its RGB values to the average rate of change in the RGB values of its neighbors.
Separation: a cell will maintain 

### Bouncing off RGB Limits

  ![userShow]

### Changing Frame Rates


  ![questions]

## Future Directions for the Project

- [ ] minimum separation distance
- [ ] all the other interesting effects that can be had by changing different values!

[userIndex]: ./docs/screenshots/userIndex.png
[userShow]: ./docs/screenshots/userShow.png
[messaging]: ./docs/screenshots/messaging.png
[conversationIndex]: ./docs/screenshots/conversationIndex.png
[messageIndex]: ./docs/screenshots/messageIndex.png
[questions]: ./docs/screenshots/questions.png
