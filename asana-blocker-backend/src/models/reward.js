import mongoose from "mongoose";

// -------------------------------------ADD_DOMAINS------------------------------------------------------------
// productive sites

const productiveSiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    site: { type: String, required: true, default: "none" },
    method: { type: String, required: true, default: "easy" },
  },

  {
    timestamps: true,
  }
);

export const ProductiveSite =
  mongoose.models.productiveSite ||
  mongoose.model("productiveSites", productiveSiteSchema);

//blockecd sites

const blockSiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    site: { type: String, required: true, default: "none" },
  },

  {
    timestamps: true,
  }
);

export const BlockSite =
  mongoose.models.blockSite || mongoose.model("blockedSites", blockSiteSchema);

// ----------------------------------ADD_GOALS--------------------------------------------------------------
const goalSchema = new mongoose.Schema(
  {
    domain: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "productiveSites",
      },
    ],
    total_time_count: { type: Number, required: true, default: 0 },

    total_time_spent: { type: Number, required: true, default: 0 },

    is_goal_achieved: { type: Boolean,default: false },
    
    spending_time: { type: Number, default: 0 },


    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    
  },
  {
    timestamps: true,
  }
);

export const Goals =
  mongoose.models.goals || mongoose.model("goals", goalSchema);

// -----------------------------------REAWARD_SCHEMA---------------------------------------------------------
const rewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    startTime: { type: String, require: true },
    endTime: { type: String, require: true },
    totalRewards: { type: String },
  },
  {
    timestamps: true,
  }
);
rewardSchema.pre("save", function (next) {
  const currentDate = new Date().toISOString();
  this.startTime = currentDate;
  this.endTime = currentDate;
  next();
});

export const Rewards =
  mongoose.models.rewards || mongoose.model("rewards", rewardSchema);
