import Settings from "../models/settings.js"

/* GET SETTINGS --------------------------------------------------*/
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // ensure singleton
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE SETTINGS --------------------------------------------------*/
export const updateSettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true }  
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};