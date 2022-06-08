# notionrecurringtasks
This is an integration for the note-taking and management app 'Notion'. It provides recurring task functionality by altering databases on a regular schedule
## what does it use?
notionrandomthought is runs on AWS Lambda and is scheduled by AWS CloudWatch events. It is build on top of AWS SAM(Serverless Application Model) which also handles deployment. The function itself is written in Node.js
## how does it work?
An actions database is shared with this integration that contains discrete tasks. Each is marked done or not with a checkbox and each can be marked with a number of recurrence intervals. When a scheduled event is received, this integration fetches all actions that have an interval, increments their due date by their interval and unchecks its completed box. All altered actions are then updated in their original location
## why does it work like this?
Unfortunately Notion does not provide recurring task functionality. There are methods in app to replicate this but they are all clunky from a useability perspective
