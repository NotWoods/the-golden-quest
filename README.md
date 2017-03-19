# nwhacks-2017
IN PROGRESS
Hello Alexa's World

## story.txt
Each block of text (with atleast 2 newlines) represents a StoryNode.
StoryNodes follow this format:
```
{story id}: {story message}
> {action id}: {action message} | {next story}
> {action id}: {action message} | {next story}
```

Alternatively, if the story node should automatically move to the next node:
```
{story id}: {story message}
>> {action id}: {next story}
```
