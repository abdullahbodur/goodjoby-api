const errorHandlerWrapper = require("express-async-handler");

const creation_codes = [
  { code: 1, code_title: "User Created", status: false },
  { code: 2, code_title: "User verificed", status: false },
  { code: 3, code_title: "Profile created", status: false },
  { code: 4, code_title: "Brandnew User", status: true },
];

const creationCodeControl = errorHandlerWrapper((objectModel,res) => {
  for (let cr_code in creation_codes) {

    if(objectModel.creation_code === cr_code.code){
        
    }    
  }
});

module.exports = {
  creationCodeControl,
};
