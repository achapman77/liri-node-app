

var inquirer = require('inquirer');





inquirer
  .prompt(
    {
      type: "list",
      message: "What would you like Liri to Do?",
      choices: ["A", "B", "C"],
      name: "liriCommand"
    },
  )
  .then(function(inquirerResponse) {
    
      var command = inquirerResponse.liriCommand;

      switch (command) {
          case "A":
              inquirer
                  .prompt({
                      type: "input",
                      message: "What Band?",
                      name: "userInput",
                  }
                  )
                  .then(function (inquirerResponse) {
                      console.log(inquirerResponse.userInput)
                  });
              break;
          case "B":
          inquirer
          .prompt({
              type: "input",
              message: "What Movie?",
              name: "userInput",
          }
          )
          .then(function (inquirerResponse) {
              console.log(inquirerResponse.userInput)
          });
      break;
    }
      
    
  });