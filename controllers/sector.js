const errorHandlerWrapper = require("express-async-handler");
const Sector = require("../models/Sector");

const createNewSector = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;

  const sector = await Sector.create(data);
 
  res.status(200).json({
    success: true,
    message: "Sector Created Succesfully",
    data: sector,
  });

  
});

const addSubJobs = errorHandlerWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { subjob_id } = req.body;
  
  const sector = await Sector.findByIdAndUpdate(id,{
    subJobs : subjob_id
  },{
    new : true,
    runValidators : true
  }).populate("subJobs")


  res.status(200).json({
    success: true,
    message : "SubJob is added to sector successfuly",
    sector : sector
  })
  

});


const getAllSectors = errorHandlerWrapper(async (req, res, next) => {
const {sectorName} = req.query; 
console.log(sectorName);


res.status(200).json(res.result)


});




module.exports = {
  createNewSector,
  addSubJobs,
  getAllSectors
};
