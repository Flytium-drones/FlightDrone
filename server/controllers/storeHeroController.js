import StoreHero from "../models/StoreHero.js";

// Fetch the StoreHero documents (create default if not exists)
export const getStoreHero = async (req, res) => {
  try {
    let storeHeroes = await StoreHero.find();
    
    // Create default if it doesn't exist
    if (storeHeroes.length === 0) {
      const defaultHero = await StoreHero.create({
        features: [
          { icon: "Package", title: "DIY Kit" },
          { icon: "Smartphone", title: "Mobile Control System" },
          { icon: "Settings", title: "Trim Adjustment" },
          { icon: "Compass", title: "Headless Mode" },
          { icon: "Sliders", title: "Advanced Flight Controller Settings" }
        ],
        productInfo: [
          { icon: "Info", title: "Product Type", description: "Nano Drone DIY Kit" },
          { icon: "Gamepad2", title: "Control", description: "Mobile Control System" },
          { icon: "BookOpen", title: "Learning Use", description: "Drone Technology, STEM" },
          { icon: "Users", title: "Best For", description: "Students, Beginners" },
          { icon: "Wind", title: "Mode", description: "Headless Mode Supported" }
        ],
        whyChoose: [
          { icon: "Smile", title: "Beginner Friendly" },
          { icon: "Wrench", title: "DIY Learning" },
          { icon: "Feather", title: "Compact & Light" },
          { icon: "Cpu", title: "Smart Features" }
        ]
      });
      storeHeroes = [defaultHero];
    }

    res.status(200).send({
      success: true,
      storeHeroes, // returning an array now
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Store Hero data",
      error,
    });
  }
};

// Update the StoreHero documents (receives array in req.body.slides)
export const updateStoreHero = async (req, res) => {
  try {
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).send({ success: false, message: "Expected 'slides' array" });
    }

    // Clear existing documents
    await StoreHero.deleteMany({});

    // Insert new slides
    const newHeroes = await StoreHero.insertMany(slides);

    res.status(200).send({
      success: true,
      message: "Store Hero Data Updated Successfully",
      storeHeroes: newHeroes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating store hero data",
      error,
    });
  }
};
