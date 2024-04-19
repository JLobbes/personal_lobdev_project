
// import handlebars for rendering, path for path declarations, fs for reading files
const handlebars = require('express-handlebars');
const path = require('path');
const file_structure = require('fs');

// make a registerPartials function to export

function registerPartials() {

    // handlebars imported above does not create an instance of expess handlebars so therefore 
    // you cannot use the objects methods by simply calling handlebars.registerPartial()
    const handlebars_instance = handlebars.create();

    // this area can be expanded if quantity of partials increases
    handlebars_instance.handlebars.registerPartial('header', () => {
        const header_path = path.join(__dirname, 'src', 'views', 'partials','header.handlebars');
        const header_content = file_structure.readFileSync(header_path, 'utf-8');
        return header_content
    });

    handlebars_instance.handlebars.registerPartial('footer', () => {
        const header_path = path.join(__dirname, 'src', 'views', 'partials', 'footer.handlebars');
        const header_content = file_structure.readFileSync(header_path, 'utf-8');
        return header_content
    });

}

module.exports = registerPartials;

