#! /usr/bin/env node

import { restFolder } from './restfolder.js';
import { restCrud } from './restcrud.js';

import inquirer from 'inquirer';

const questions = [
  {
    name: 'structure',
    type: 'list',
    message: 'which tech you are using?',
    choices: ['rest crud', 'rest api'],
  },
];

const askQuestion = async () => {
  const ans = await inquirer.prompt(questions);
  console.log(ans.structure);

  if (ans.structure == 'rest api') {
    console.log(restFolder());
  } else {
    ans.structure == 'rest crud';
  }
  {
    console.log(restCrud());
  }
};

askQuestion();
