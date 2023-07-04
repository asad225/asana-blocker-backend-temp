import express from "express";
const routes = express.Router();
import { check, param, query } from "express-validator";

import {
  addRewardsOfGoodSites,
  addGoalOfGoodSites,
  updateSpendingTime,
  // getMygoalDetails,
  addProductiveSite,
  addBlockedSite,
  getProductiveSites,
  getBlockedSites,
  deleteProductiveSite,
  deleteBlockSite,
  deleteGoalById,
  findIsGoalCompleted

} from "../api/reward.js";
import { ValidationErrors } from "../helper/validationMiddleware.js";


// -----------------------------addRewards-------------------------------------------------------------------
routes.post(
  "/addRewards",
  [check("userId").not().isEmpty().withMessage("User is required")],
  ValidationErrors,
  addRewardsOfGoodSites
);

// ----------------------------addGoals-----------------------------------------------------------------------
routes.post(
  "/addGoals",
  [
    check("total_time_count")
      .not()
      .isEmpty()
      .withMessage("Please add goal time"),
  ],
  ValidationErrors,
  addGoalOfGoodSites
);
// ----------------------------deleteGoals-----------------------------------------------------------------------
routes.delete(
  "/deleteGoal",
  [
    check("goalId")
      .not()
      .isEmpty()
      .withMessage("Please add goal id"),
  ],
  ValidationErrors,
  deleteGoalById
);
// ----------------------------Goal Completed?-----------------------------------------------------------------------
routes.get(
  "/getGoal",
  [
    check("goalId")
      .not()
      .isEmpty()
      .withMessage("Please add goal id"),
  ],
  ValidationErrors,
  findIsGoalCompleted
);
/* ---------------------------update goals----------------------------------------------------------------------------
update get spent time of user and update it to database 
*/

routes.put(
  "/goal/update/:goalId",
  [
    query("goalId").exists().withMessage("Please add goal id"),
    check("spending_time")
      .not()
      .isEmpty()
      .withMessage("Please add spending time"),
  ],
  ValidationErrors,
  updateSpendingTime
);

// routes.get(
//   "goal/:goalId",
//   [query("goalId").exists().withMessage("Please add goal id")],
//   ValidationErrors,
//   getMygoalDetails
// );

// --------------------------------------------------------------add productive sites--------------------------------------

routes.post(
  "/productive/site",
  [
    check("userId").not().isEmpty().withMessage("User is required"),
    check("site").not().isEmpty().withMessage("Please add minimum one site."),
    check("method").not().isEmail().withMessage("Please add difficulty method"),
  ],
  ValidationErrors,
  addProductiveSite
);

//------------------------------------------addBlockedSite---------------------------------------------------------------------
routes.post(
  "/block/site",
  [
    check("userId").not().isEmpty().withMessage("User is required"),
    check("site").not().isEmpty().withMessage("Please add minimum one site."),
  ],
  ValidationErrors,
  addBlockedSite
);


// ---------------------------------------getProductiveSites---------------------------------------------------------------------
routes.get( 
  "/productive/sites/:userId",
  [ check("userId").not().isEmpty().withMessage("User is required"),],
  ValidationErrors,
  getProductiveSites
);

// -----------------------------------------getBlockedSites----------------------------------------------------------------------
routes.get(
  "/block/sites/:userId",
  [check("userId").exists().withMessage("User is required")],
  ValidationErrors,
  getBlockedSites
);

// ------------------------------------------deleteProductiveSite-----------------------------------------------------------------
routes.delete("/goodSite/:siteId" , [
  check("siteId").exists().withMessage("Domain is required")
],
ValidationErrors,
deleteProductiveSite
)

// ------------------------------------------deleteBlockSite-----------------------------------------------------------------------

routes.delete("/blockSite/:siteId" , [
  check("siteId").exists().withMessage("Domain is required")
],
ValidationErrors,
deleteBlockSite
)

export default routes;
