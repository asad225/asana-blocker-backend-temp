import {
  Method,
  Text,
  CheckInterval
} from "../models/setting.js";

// -----------------------------------Methods-----------------------------------------------------------------------------
// GetAll
export const getMethod = async (req, res) => {
  let filter = {};
  if (req.query.userId) {
    filter = { userId: req.query.userId.split(",") };
  }
  let data = await Method.find(filter);
  res.send(data);
};
// GetbyId
export const getgetMethodById = async (req, res) => {
  let data = await Method.find(req.params);
  res.send(data);
};
// Post
export const postMethod = async (req, res) => {
  const { method, userId } = req.body;
  let data = new Method({ method, userId });
  await data
    .save()
    .then((result) => {
      console.log(result, "method data save to database");
      res.json({
        method: result.method,
        userId: result.userId,
      });
    })
    .catch((err) => {
      res.status(400).send("unable to save database");
      console.log(err);
    });
};
// update
export const updateMethod = async (req, res) => {
  let data = await Method.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body,
    },
    { new: true }
  );
  if (data) {
    res.send({ message: "Method data updated successfully" });
  } else {
    res.send({ message: "Method data cannot be updated successfully" });
  }
};
// Delete
export const deleteMethod = async (req, res) => {
  console.log(req.params);
  let data = await Method.deleteOne(req.params);

  if (data) {
    res.send({ message: "Method data delete successfully" });
  } else {
    res.send({ message: "Method data cannot delete successfully" });
  }
};

// ----------------------------taxes----------------------------------------------------------------------------------------------
// GetAll
export const getText = async (req, res) => {
  let filter = {};
  if (req.query.userId) {
    filter = { userId: req.query.userId.split(",") };
  }
  let data = await Text.find(filter);
  res.send(data);
};
// GetById
export const getTextById = async (req, res) => {
  let data = await Text.find(req.params);
  res.send(data);
};
// Post
export const postText = async (req, res) => {
  const { len, onoff, userId } = req.body;
  let data = new Text({ len, onoff, userId });
  await data
    .save()
    .then((result) => {
      console.log(result, "Text data save to database");
      res.json({
        len: result.len,
        onoff: result.onoff,
        userId: result.userId,
      });
    })
    .catch((err) => {
      res.status(400).send("unable to save database");
      console.log(err);
    });
};
// update
export const updateText = async (req, res) => {
  let data = await Text.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body,
    },
    { new: true }
  );
  if (data) {
    res.send({ message: "Text data updated successfully" });
  } else {
    res.send({ message: "Text data cannot be updated successfully" });
  }
};
// Delete
export const deleteText = async (req, res) => {
  console.log(req.params);
  let data = await Text.deleteOne(req.params);

  if (data) {
    res.send({ message: "Text data delete successfully" });
  } else {
    res.send({ message: "Text data cannot delete successfully" });
  }
};

// ------------------------------------------------CheckInterval--------------------------------------------------------------------

// getAll
export const getCheckInterval = async (req, res) => {
  let filter = {};
  if (req.query.userId) {
    filter = { userId: req.query.userId.split(",") };
  }
  let data = await CheckInterval.find(filter);
  res.send(data);
};
// GetById
export const getCheckIntervalById = async (req, res) => {
  let data = await CheckInterval.find(req.params);
  res.send(data);
};
// Post
export const postCheckInterval = async (req, res) => {
  const { TaskCheckInterval, userId } = req.body;
  let data = new CheckInterval({ TaskCheckInterval, userId });
  await data
    .save()
    .then((result) => {
      console.log(result, "TaskCheckInterval data save to database");
      res.json({
        TaskCheckInterval: result.TaskCheckInterval,
        userId: result.userId,
      });
    })
    .catch((err) => {
      res.status(400).send("unable to save database");
      console.log(err);
    });
};
// update
export const updateCheckInterval = async (req, res) => {
  let data = await CheckInterval.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: req.body,
    },
    { new: true }
  );
  if (data) {
    res.send({ message: "CheckInterval data updated successfully" });
  } else {
    res.send({ message: "CheckInterval data cannot be updated successfully" });
  }
};
// Delete
export const deleteCheckInterval = async (req, res) => {
  console.log(req.params);
  let data = await CheckInterval.deleteOne(req.params);

  if (data) {
    res.send({ message: "CheckInterval data delete successfully" });
  } else {
    res.send({ message: "CheckInterval data cannot delete successfully" });
  }
};


