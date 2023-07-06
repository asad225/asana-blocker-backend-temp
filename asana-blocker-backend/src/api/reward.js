import { Rewards, Goals, ProductiveSite, BlockSite } from "../models/reward.js";

// ---------------------------------------------------------Add Productive sites----------------------------------------

export const addProductiveSite = async (req, res) => {
  const { userId, site, method , goalId} = req.body;
  try {
    const addproductiveSite = new ProductiveSite({
      goalId,
      userId,
      site,
      method,
    });
    const result = await addproductiveSite.save();
    return res.status(201).json({ result, msg: "data added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ---------------------------------------------------------Add_block_sites---------------------------------------------

export const addBlockedSite = async (req, res) => {
  const { userId, site } = req.body;
  try {
    const addproductiveSite = new BlockSite({
      userId,
      site,
    });
    const result = await addproductiveSite.save();
    return res.status(201).json({ result, msg: "data added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// --------------------------------------------------------Get_All_Sites--------------------------------------------------

export const getProductiveSites = async (req, res) => {
  const {userId , goalId} = req.body; // Assuming the user ID is passed as a route parameter

  try {
    // Find domains by user ID
    const result = await ProductiveSite.find({ userId , goalId });

    if (result.length === 0) {
      return res.status(200).json({
        message: "No domains found for the specified user ID",
        data: [],
      });
    }

    res.status(200).json({ message: "Data found", data: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//  Blocked
export const getBlockedSites = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed as a route parameter

  try {
    // Find domains by user ID
    const result = await BlockSite.find({ userId });

    if (result.length === 0) {
      return res.status(200).json({
        message: "No domains found for the specified user ID",
        data: [],
      });
    }

    res.status(200).json({ message: "Data found", data: result });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------------------------------------------Add_Goals---------------------------------------------------



export const addGoalOfGoodSites = async (req, res) => {
  const { domain, total_time_count,total_time_spent,is_goal_achieved , spending_time , userId , difficulty} = req.body;
  // It will take domain total time count (which is target set by user) and total_time_spent and a bolean field which is for checking
  // if goal has been achieved
  try {
    const addGoals = new Goals({
      domain,
      total_time_count,
      total_time_spent,
      is_goal_achieved,
      userId,
      difficulty
    });

    const result = await addGoals.save();
    return res.status(201).json({ result, msg: "Goals added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};
//----------------------------------------------------------Delete_Goals---------------------------------------------------

// its for reseting the goal.It will take goalid and delete that particular goal from goal collections
export const deleteGoalById = async (req, res) => {
  const {goalId} = req.body;
  console.log(goalId)
  try {
    const addGoals = await Goals.findByIdAndRemove(goalId)

    if(!addGoals){

      return res.status(404).json({ msg: "Goal not found!" });
    }
    return res.json({ msg: "Goal Deleted Successfuly!" });


  } catch (error) {
    
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//----------------------------------------------------------find Goal Completion---------------------------------------------------


// it will check the boolean field if goal has been completed
export const findIsGoalCompleted = async (req, res) => {
  const {goalId} = req.body;
  try {
    const goal= await Goals.findById(goalId)
    
    const {is_goal_achieved} = goal

    if(is_goal_achieved){
      return res.json({goal, msg:'Goal has been achieved'})
    }else{
      
      return res.json({msg:'Goal has not been achieved yet'})
    }




  } catch (error) {
    
    return res.status(500).json({msg: "Internal Server Error" });
  }
};
//----------------------------------------------------------find Goal By UserID---------------------------------------------------


// it will check the boolean field if goal has been completed
export const findGoalByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const goal = await Goals.find({ userId: userId, is_goal_achieved: false });

    if (goal.length>0) {
      return res.json({ goal, msg: 'Goal Found!' });
    } else {
      const empty_goal = {
        domain: [],
        total_time_count: 0,
        total_time_spent: 0,
        is_goal_achieved: false,
        userId: null,
        difficulty: 'easy'
      };

      return res.json({ goal: empty_goal, msg: 'Goal Not Found!' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
// ----------------------------------------------------------rewards----------------------------------------------------

export const addRewardsOfGoodSites = async (req, res) => {
  const { userId, startTime, endTime } = req.body;
  try {
    // Compare start and end times
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }
    const totalRewards = calculateTotalRewards(start, end);

    const addRewards = new Rewards({
      userId,
      startTime,
      endTime,
      totalRewards,
    });

    const result = await addRewards.save();
    return res.status(201).json({ result, msg: "Rewards added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const calculateTotalRewards = (start, end) => {
  const totalMilliseconds = end - start;
  const totalSeconds = totalMilliseconds / 1000;
  const totalRewards = (totalSeconds * 0.01).toFixed(2);
  return totalRewards;
};

// ---------------------------------------------update Spending Time----------------------------------------------------

export const updateSpendingTime = async (req, res) => {
  const { goalId } = req.params;
  const { newSpendingTime } = req.body;

  try {
    const updatedGoal = await Goals.findByIdAndUpdate(
      goalId,
      { spending_time: newSpendingTime },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    return res
      .status(200)
      .json({ result: updatedGoal, msg: "Goal updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// --------------------------------------get goal details-------------------------------------------------------------------------
export const getMygoalDetails = async (req, res) => {
  const { goalId } = req.params;

  try {
    const details = await Goals.findById(goalId);

    if (!details) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    return res
      .status(200)
      .json({ result: details, msg: "Goal details retrieved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ----------------------------------Delete productive sites-------------------------------------------------------------------------

export const deleteProductiveSite = async (req, res) => {
  const siteId = req.params.siteId;
  try {
    const domain = await ProductiveSite.findByIdAndRemove(siteId);

    if (!domain) {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }

    res.json({ message: "Domain deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    console.log({ error });

    res.status(500).json({
      message: "Could not delete domain with ID " + siteId,
    });
  }
};

export const deleteBlockSite = async (req, res) => {
  const siteId = req.params.siteId;
  try {
    const domain = await BlockSite.findByIdAndRemove(siteId);

    if (!domain) {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }

    res.json({ message: "Domain deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.name === "NotFound") {
      return res.status(404).json({
        message: "Domain not found with ID " + siteId,
      });
    }
    console.log({ error });

    res.status(500).json({
      message: "Could not delete domain with ID " + siteId,
    });
  }
};
