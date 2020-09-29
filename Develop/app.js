const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

promptUserManager();
async function promptUserManager() {

    response = await inquirer.prompt([
        {
            type: "input",
            message: "What is your team manager's name?",
            name: "name"
        },
        {
            type: "input",
            message: "Enter your team manager's employee ID.",
            name: "id"
        },
        {
            type: "input",
            message: "Enter your team manager's email address.",
            name: "email"

        },
        {
            type: "input",
            message: "Enter your team manager's office number.",
            name: "officeNumber"
        }
    ]).then((response) => {
        const manager = new Manager(response.name, response.id, response.email, response.officeNumber);
        employees.push(manager);
        addTeamMembers();
    })
}
function addTeamMembers() {
    responseNext = inquirer.prompt([
        {
            name: "newEmployee",
            message: "Do you want to add another employee?",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then(function (responseNext) {
        if (responseNext.newEmployee === "Yes") {
            newEmployee();
        } else if (responseNext.newEmployee === "No") {
            console.log("Generating Team...")
            console.log("Team Generated!");
            mainHTML();
        }
    });
}

async function newEmployee() {
    let responseDone = "";
    do {
        response = await inquirer.prompt([
            {
                type: "input",
                message: "Enter team member's name.",
                name: "name"
            },
            {
                type: "list",
                message: "Select the team member's role.",
                choices: ["Engineer", "Intern"],
                name: "role"
            },
            {
                type: "input",
                message: "Enter the team member's employee ID.",
                name: "id"
            },
            {
                type: "input",
                message: "Enter the team member's email address.",
                name: "email"
            }
        ]);
        const employee = new Employee(response.name, response.id, response.email);
        let response2 = ""
        if (response.role === "Engineer") {
            response2 = await inquirer.prompt([
                {
                    name: "github",
                    type: "input",
                    message: "What is the engineer's github username?"
                }
            ]);
            const engineer = new Engineer(response.name, response.id, response.email, response2.github);
            employees.push(engineer);
        } else if (response.role === "Intern") {
            response2 = await inquirer.prompt([
                {
                    name: "school",
                    type: "input",
                    message: "What college or university does the intern attend?"
                }
            ]);
            const intern = new Intern(response.name, response.id, response.email, response2.school);
            employees.push(intern);
        }
        
        responseDone = await inquirer.prompt([
            {
                name: "continue",
                message: "Do you want to add another employee?",
                type: "list",
                choices: ["Yes", "No"]
            }
        ]);
    } while (responseDone.continue === "Yes");
    if (responseDone.continue === "No") {
        console.log("Generating Team...")
        console.log("Team Generated!");
        mainHTML();
    }
}
// Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)
async function mainHTML() {
    // After the user has input all employees desired, call the `render` function (required above) and pass in an array containing all employee objects; the `render` function will generate and return a block of HTML including templated divs for each employee!
    var renderEmp = render(employees);

    // After you have your html, you're now ready to create an HTML file using the HTML returned from the `render` function. Now write it to a file named `team.html` in the `output` folder. You can use the variable `outputPath` above target this location.
    fs.writeFile(outputPath, renderEmp, function (err) {
        if (err)
            throw err;

    })

};