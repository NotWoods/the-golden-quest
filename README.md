# nwhacks-2017
![The Golden Quest](https://raw.githubusercontent.com/NotWoods/nwhacks-2017/master/best_logo.PNG)

## Inspiration
We were interested in learning how to work with Amazon Web Services to
program an app on Amazon Echo and Alexa AI.

## What it does
It is a voice based interaction game.
It allows the user to play it hands free while they are doing chores, work, etc.
The content is also child friendly and amusing to a broad audience.

## How we built it
We used TypeScript and Amazon's alexa-sdk package for Node.js
To represent the branching paths of the story, we created a custom text format
and wrote a parser to convert the text into story objects.
Our parser was later modified to auto-generate the schema files for Alexa.

## Challenges we ran into
When we got the game running on the Echo,
we realized that some of the lines did not sound fluid when spoken by Alexa.
We also got several students to test our game and took note of the fact that
most were choosing the same series of options to the end of the game.
We had to rephrase some lines and restructure the story so
the chance of users choosing each route is more equal.

## Accomplishments that we're proud of
We were really proud of being able to program a game for Alexa while not
having touched an Echo in our lives.

## What we learned
We learned how to program a custom Alexa skill,
despite the fact we never used Alexa previously.

## Demo
<a href="http://www.youtube.com/watch?feature=player_embedded&v=qgQCpviGm5U
" target="_blank"><img src="http://img.youtube.com/vi/qgQCpviGm5U/0.jpg"
alt="Demo Video" width="240" height="180" border="10" /></a>
