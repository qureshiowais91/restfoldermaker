#! /usr/bin/env node

import {restFolder} from "./restfolder.js"
import inquirer from "inquirer"

const questions = [{
    name: 'structure',
    type: 'list',
    message: "which tech you are using?",
    choices: ['react', 'rest api']
}]

const askQuestion = async()=>{
    const ans = await inquirer.prompt(questions);
    console.log(ans.structure);

    if (ans.structure == "rest api") {
        console.log(restFolder())
    }
}

askQuestion();