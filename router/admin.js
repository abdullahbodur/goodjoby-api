const express = require("express");
const router = express.Router();
const {
  adminStageControl,
  adminTokenControl,
  existControl,
  adminAuthorityControl,
  blockedControl,
} = require("../middlewares/tokenControls/tokenControls");
const {
  adminRegisterHelper,
  adminSignInHelper,
} = require("../helpers/Auth/adminAuthHelper");
const {
  createAdmin,
  loginAdmin,
  updateSubAdmin,
  blockUser,
  blockAdmin,
  deleteAdmin,
  cancelWork,
} = require("../controllers/admin");
const Admin = require("../models/Admin");

// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** POST REQUESTS ******** POST REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S

// == == == == == == == == == == == == == == == == == == == ==
//  CREATE SUB ADMIN - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_sub_admin",
  [adminTokenControl, adminStageControl([4, 3]), blockedControl(Admin)],
  adminRegisterHelper,
  createAdmin
);

// == == == == == == == == == == == == == == == == == == == ==
//  LOGIN ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.post("/login", adminSignInHelper, loginAdmin);




// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PUT REQUESTS ******** PUT REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S




router.put("/cancel_work",[adminTokenControl, adminStageControl([2, 4]), blockedControl(Admin)],cancelWork)




// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S
//  ******** PARAM REQUESTS ******** PARAM REQUESTS ********
// ==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S==S




// == == == == == == == == == == == == == == == == == == == ==
//  CANCEL WORK - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.put("/cancel_work/:work_id", [
  [adminTokenControl, adminStageControl([2, 4]), blockedControl(Admin)],
  cancelWork,
]);

// == == == == == == == == == == == == == == == == == == == ==
//  UPDATE SUB ADMIN - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/update_sub_admin/:id",
  [
    adminTokenControl,
    adminStageControl([4, 3]),
    blockedControl(Admin),
    existControl(Admin),
  ],
  adminAuthorityControl,
  updateSubAdmin
);

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCK USER - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/block_user/:id",
  [adminTokenControl, adminStageControl([4, 2]), blockedControl(Admin)],
  existControl(undefined),
  blockUser
);

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCK ADMIN - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.put(
  "/block_admin/:id",
  [adminTokenControl, adminStageControl([4, 3]), blockedControl(Admin)],
  existControl(Admin),
  adminAuthorityControl,
  blockAdmin
);

// == == == == == == == == == == == == == == == == == == == ==
//  DELETE ADMIN - ADMIN
// == == == == == == == == == == == == == == == == == == == ==

router.delete(
  "/:id",
  [
    adminTokenControl,
    adminStageControl([4, 3]),
    blockedControl(Admin),
    existControl(Admin),
  ],
  adminAuthorityControl,
  deleteAdmin
);

module.exports = router;
