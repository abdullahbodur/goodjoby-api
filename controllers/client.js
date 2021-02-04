const errorHandlerWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const Client = require("../models/Client");
const JobInfo = require("../models/JobInfo");
const PendingWork = require("../models/PendingWork");
const ExpertRequest = require("../models/ExpertRequest");
const Work = require("../models/Work");
const Expert = require("../models/Expert");
const Team = require("../models/Team");

const path = require("path");
// == == == == == == == == == == == == == == == == == == == ==
//  REGISTER CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const registerClient = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  SIGN CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const signClient = (req, res, next) => {};

// == == == == == == == == == == == == == == == == == == == ==
//  LOGOUT CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const logoutClient = (req, res, next) => {
  const { NODE_ENV } = process.env;
  res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now),
      secure: NODE_ENV === "development" ? false : true, // https koruması
    })
    .json({
      success: true,
      message: "Logout is succesfully",
    });
};

// == == == == == == == == == == == == == == == == == == == ==
//  PROFILE CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const profileClient = (req, res, next) => {
  res.status(200).json({
    profileOwnerAccess: req.profileOwnerAccess,
    profile: req.profile,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  FORGOT PASSWORD CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const forgotPasswordClient = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Password reset link is sended your email",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  RESET PASSWORD CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const resetPassword = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "password is updated",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET ALL CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const getAllClient = errorHandlerWrapper(async (req, res, next) => {
  const clients = await Client.find({});

  res.status(200).json({
    success: true,
    clients: clients,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD PROFILE IMAGE CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const uploadedPIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Client profile image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD BACKGROUND IMAGE CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const uploadedBIController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Client background image uploaded successfuly",
    data: req.uploadedUser,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET SEARCH SERVICE FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const getSearchService = errorHandlerWrapper(async (req, res, next) => {
  res.status(200).json(res.result);
});

// == == == == == == == == == == == == == == == == == == == ==
//  GET SERVICE QUESTIONS FOR CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const getServiceQuestions = errorHandlerWrapper(async (req, res, next) => {
  const serviceID = req.params.service_id;

  const jobInfo = await JobInfo.findById(serviceID)
    .populate("question_filters")
    .select({ job_name: 1 });

  if (!jobInfo) {
    return next(new CustomError("There is no service with that id", 400));
  }

  res.status(200).json({
    success: true,
    data: jobInfo,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE PENDING WORK - CLIENT CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const createPendingWork = errorHandlerWrapper(async (req, res, next) => {
  const data = req.body;

  const client = req.user.userObject;

  const pendingWork = await PendingWork.create({
    ...data,
    client: client._id,
    expireAt: new Date(Date.now() + parseInt(data.expireAt)),
  });

  try {
    client.pending_works.push(pendingWork._id);
    await client.save();
  } catch (error) {
    pendingWork.remove();
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: pendingWork,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  UPLOAD DOCUMENTS TO SERVER FOR JOB APPLICATION
// == == == == == == == == == == == == == == == == == == == ==

const uploadNewDocuments = errorHandlerWrapper(async (req, res, next) => {
  const { id } = req.params;
  const pendingWork = await PendingWork.findById(id);

  if (req.user.client_id != pendingWork.client) {
    return next(new CustomError("You authorize is invalid", 403));
  }

  if (!pendingWork) {
    return next(new CustomError("There is no work with that id", 400));
  }
  const documents = pendingWork.documents;

  for (let i = 0; i < req.files.length; i++) {
    pendingWork.documents.push(req.files[i]["file_url"]);
  }

  pendingWork.documents = documents;
  await pendingWork.save();
  res.status(200).json({
    success: true,
    message: "Document uploaded successfuly",
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPT ANY OFFER
// == == == == == == == == == == == == == == == == == == == ==

const acceptAnyOffer = errorHandlerWrapper(async (req, res, next) => {
  const offerID = req.params.offer_id;
  const { pending_work_id, expireAt } = req.body;
  const {
    STATE_CREATED,
    STATE_ACTIVE,
    STATE_FINISHED,
    STATE_PASSIVE,
  } = process.env;
  if (!expireAt)
    return next(
      new CustomError("Please provide a expire time for your work", 400)
    );

  // find expert offer and pending work
  const expertRequest = await ExpertRequest.findOne({
    _id: offerID,
    state: {
      $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)],
    },
  });

  const pendingWork = await PendingWork.findOne({
    _id: pending_work_id,
    state: {
      $in: [parseInt(STATE_CREATED), parseInt(STATE_ACTIVE)],
    },
  });

  if (!expertRequest || !pendingWork)
    return next(
      new CustomError(
        "There is no offer or pending work with that id Or already expired",
        400
      )
    );

  try {
    (expertRequest.is_accepted = true),
      (expertRequest.state = parseInt(STATE_FINISHED));

    (pendingWork.is_accepted = true),
      (pendingWork.state = parseInt(STATE_FINISHED));

    await expertRequest.save();
    await pendingWork.save();

    await ExpertRequest.updateMany(
      {
        $and: [
          { pending_work_id: pendingWork._id },
          { _id: { $ne: expertRequest._id } },
        ],
      },
      { $set: { state: parseInt(STATE_PASSIVE) } }
    );
  } catch (error) {
    (expertRequest.is_accepted = false),
      (expertRequest.state = parseInt(STATE_CREATED));

    (pendingWork.is_accepted = false),
      (pendingWork.state = parseInt(STATE_CREATED));

    await expertRequest.save();
    await pendingWork.save();

    return next(error);
  }

  // create new work after pendingwork state = 3

  const work = await Work.create({
    client: pendingWork.client,
    description: pendingWork.description,
    documents: pendingWork.documents,
    service_id: pendingWork.service_id,
    expert: expertRequest.expert,
    expert_type: expertRequest.is_team ? "Team" : "Expert",
    messages: expertRequest.messages ? expertRequest.messages : [],
    answers: pendingWork.answers,
    is_team: expertRequest.is_team,
    expireAt: new Date(Date.now() + parseInt(expireAt)),
  });

  // find client and expert

  const model = expertRequest.is_team ? Team : Expert;

  const client = await Client.findById(req.user.client_id);

  const expert = await model.findById(expertRequest.expert);

  if (!client || !expert)
    return next(new CustomError("There is no client o user with that id", 400));

  // save this work id to client and expert

  try {
    client.works.push(work._id);
    expert.works.push(work._id);

    await client.save();
    await expert.save();
  } catch (error) {
    client.works.splice(client.works.indexOf(work._id), 1);
    expert.works.splice(client.works.indexOf(work._id), 1);

    expertRequest.is_accepted = false;
    expertRequest.state = parseInt(STATE_CREATED);

    pendingWork.is_accepted = false;
    pendingWork.state = parseInt(STATE_CREATED);

    await expertRequest.save();
    await pendingWork.save();

    await client.save();
    await expert.save();

    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Offer Accepted successfuly",
    data: work,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL ANY WORK - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelAnyPendingWork = errorHandlerWrapper(async (req, res, next) => {
  const { work_id } = req.params;

  const pendingWork = await PendingWork.findById(work_id);

  if (!pendingWork) {
    return next(new CustomError("There is no pending work with that id", 400));
  }

  if (
    [
      parseInt(process.env.STATE_FINISHED),
      parseInt(process.env.STATE_PASSIVE),
    ].indexOf(pendingWork.state) != -1
  ) {
    return next(new CustomError("This Pending work is already expired", 400));
  }

  if (!req.user.userObject.pending_works.includes(work_id)) {
    return next(new CustomError("Authorize is invalid", 403));
  }

  try {
    pendingWork.state = parseInt(process.env.STATE_CANCELED);
    await pendingWork.save();
    await ExpertRequest.updateMany(
      { pending_work_id: pendingWork._id },
      { $set: { state: parseInt(process.env.STATE_CANCELED) } },
      { runValidators: true }
    );
  } catch (error) {
    pendingWork.state = parseInt(process.env.STATE_CREATED);
    await pendingWork.save();
    await ExpertRequest.updateMany(
      { pending_work_id: pendingWork._id },
      { $set: { state: parseInt(process.env.STATE_CREATED) } }
    );
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Work canceled successfuly",
    pendingWork: pendingWork,
  });
});

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK REQUEST - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWork = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Cancelling request successfuly, Please wait your expert response",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK ACCEPT - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const cancelWorkAccept = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "You are successfuly canceled work",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET WORKS - CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const getWorks = (req, res, next) => {
  res.status(200).json(res.result);
};

// == == == == == == == == == == == == == == == == == == == ==
//  GET MESSAGES- CLIENT
// == == == == == == == == == == == == == == == == == == == ==

const getMessages = (req, res, next) => {
  // let socket = require('socket.io-client')('http://localhost:1234');

  // socket.on('connect', function(m){
  //   console.log(m);
  // });

  // socket.emit("sendIdRole",{
  //   id : req.user.client_id,
  //   role : goodjoby_ob
  // })

  // socket.on('event', function(data){});
  // // socket.on('disconnect', function(){});

  // socket.on("notice",(msg)=>{
  //   console.log(msg);
  // })

  // 5f9c879976bb8910b622f64d
  // client

  res.status(200).sendFile(path.join(__dirname, "../public/index.html"));
};

// == == == == == == == == == == == == == == == == == == == ==
//  SOCIAL ID CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const socialIDController = (req, res, next) => {
  res.status(200).json({
    success: true,
    account_id: req.body.account_id,
    account_type: req.body.account_type,
    message: "This account is available for register",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  SENDING VERIFICATE CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const verificationSendController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Email sended your mail. Please check your Inbox",
    email: req.user.email,
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  ACCEPTING VERIFICATE CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const acceptingVerificationController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Your account verification is successfuly",
  });
};

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE LOCATION CONTROLLER
// == == == == == == == == == == == == == == == == == == == ==

const updateLocationController = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Your location is updated successfuly",
  });
};

// // == == == == == == == == == == == == == == == == == == == ==
// //  REGISTER PROFILE
// // == == == == == == == == == == == == == == == == == == == ==

// const registerProfile = (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: "Register profile is saved",
//   });
// };


module.exports = {
  profileClient,
  logoutClient,
  registerClient,
  signClient,
  resetPassword,
  forgotPasswordClient,
  getAllClient,
  uploadedPIController,
  uploadedBIController,
  createPendingWork,
  uploadNewDocuments,
  getSearchService,
  getServiceQuestions,
  acceptAnyOffer,
  cancelAnyPendingWork,
  cancelWork,
  cancelWorkAccept,
  getWorks,
  getMessages,
  socialIDController,
  verificationSendController,
  acceptingVerificationController,
  updateLocationController,
};
