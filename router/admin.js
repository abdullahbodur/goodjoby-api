const express = require("express");
const router = express.Router();
const {
  adminStageControl,
  adminTokenControl,
  existControl,
  adminAuthorityControl,
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
} = require("../controllers/admin");
const Admin = require("../models/Admin");

// == == == == == == == == == == == == == == == == == == == ==
//  POST REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.post(
  "/create_sub_admin",
  [adminTokenControl, adminStageControl([4, 3])],
  adminRegisterHelper,
  createAdmin
);

router.post("/login", adminSignInHelper, loginAdmin);

// == == == == == == == == == == == == == == == == == == == ==
//  PARAM REQUESTS
// == == == == == == == == == == == == == == == == == == == ==

router.put("/cancel_work/:work_id", [
  adminTokenControl,
  adminStageControl([2, 3, 4]),
]);

router.put(
  "/update_sub_admin/:id",
  [adminTokenControl, adminStageControl([4, 3])],
  existControl(Admin),
  adminAuthorityControl,
  updateSubAdmin
);

router.put(
  "/block_user/:id",
  [adminTokenControl, adminStageControl([4, 3, 2])],
  existControl(undefined),
  blockUser
);

router.put(
  "/block_admin/:id",
  [adminTokenControl, adminStageControl([4, 3])],
  existControl(Admin),
  adminAuthorityControl,
  blockAdmin
);

router.delete(
  "/admin",
  [adminTokenControl, adminStageControl([4, 3]), existControl(Admin)],
  adminAuthorityControl,
  deleteAdmin
);

// welcome

module.exports = router;
