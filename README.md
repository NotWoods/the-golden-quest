# "Alexa, open The Golden Quest"

![The Golden Quest](https://raw.githubusercontent.com/NotWoods/nwhacks-2017/master/best_logo.PNG)

## Inspiration
The Amazon Echo is literally awesome -- the Amazon AI called Alexa provides intuitive user experience with voice as the only input. We love working with new technologies and this was a great way to learn more about the capabilities of Alexa.

## What it does
The Golden Quest is a voice-only, interactive Choose Your Own Adventure game. You play as the main character, a hackathon member embarking on a desperate search. Alexa reads out the story and choices to the player. Its intuitiveness and ease of use means anyone can play -- all you need to do is say "Alexa, open the Golden Quest".

## How we built it
We used TypeScript and Amazon's alexa-sdk package for Node.js To represent the branching paths of the story, we created a custom text format and wrote a parser to convert the text into story objects. Our parser was later modified to auto-generate the schema files for Alexa.

## Challenges we ran into
Once we deployed the game on Echo, some of the story lines did not sound natural when spoken by Alexa. We use the Amazon Alexa voice simulator to repeat the lines and edit them. Through user feedback from asking students and mentors to play test, we refined the user experience and game play options. Some improvements based on feedback: wording choices that allowed for more distributed game paths, creating a generalizable character story, expand user input beyond basic gameplay such as "Cancel", "Repeat", "Start Over" etc.

We were unable to find even basic documentation on using the Alexa SDK with Java. Thus, we switched to using Node.js for the game. We then examined Alexa Skill samples with SampleUtterances and IntentSchema

## Accomplishments that we're proud of
None of us have ever worked with Amazon Echo, the Alexa AI, or Amazon Web Services (Lambda) prior to this hackathon. To get a game up and running on hardware in less than 24 hours has been an amazing learning experience for us. From using feedback from the beta testers to refine, we were able to go beyond a minimum viable product and create a polished, debugged

## What we learned
We learned how to create, test and deploy an Alexa Skill with no prior experience. We learned how to work with the Alexa SDK, AWS lambda functions, and Alexa Developer to create a game. We gained experience with functional programming modelling, TypeScript and Node.js.

## What's next for The Golden Quest
The Golden Quest is a self-contained game, but we believe in the potential to be much greater. Alexa is an AI that learns. Our game creates a personal experience for the user, with voice as the only input. However, with the possibilities of machine learning, the game can become unique to the user experience. Sentiment-based player choices informs the AI of certain game paths and customizes the game with existing information.

The Golden Quest can also be expanded to contain multiple storylines with educational opportunities. It can be simplified for younger players or made more complex for language learning and retention.

## Demo
<a href="http://www.youtube.com/watch?feature=player_embedded&v=qgQCpviGm5U
" target="_blank"><img src="http://img.youtube.com/vi/qgQCpviGm5U/0.jpg"
alt="Demo Video" width="240" height="180" border="10" /></a>
