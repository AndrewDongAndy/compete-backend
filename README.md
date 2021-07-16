# compete-frontend

A web app that tracks your competitive programming progress and an all-round training tool to make you a better competitive programmer.

## Features

### To-do

- cache problems from BOJ and Codeforces so that few API calls need to be made when a new user joins
- save the history of a user's problem recommendations
- modify the levels each day at midnight
- show a graph of the user's progress

### Preparation

- supports multiple judges
  - fetches data from Codeforces, DMOJ, Kattis, and more
    - will need to be updated if pages or APIs change their presentation format
  - easy links to submit code
- tracks the difficulty of the problems you've solved
  - also takes problem categories into account; these categories may need to be supplied by the user
  - uses this data to suggest next problems to solve to improve
- gives you reminders to practice
- allows you to write notes about specific problems or problem types
  - easily generates "notes" to review?
- implementation "practice"?
  - e.g. lazy segment tree
- contest simulation, e.g. choose a set of problems to form a mock contest

### In-contest

- quick code snippets generator
  - e.g. for Mint, enter the modulus and all code will be pasted to clipboard
- find past problems by keyword (e.g. cutpoints, diophantine)?
  - the utility of this feature could be controversial

## Implementation

- data collection: web scraping and APIs
  - many sites do not have APIs, such as:
    - https://www.acmicpc.net/
    - https://open.kattis.com/
- MERN stack
