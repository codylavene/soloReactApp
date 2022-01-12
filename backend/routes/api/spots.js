const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3");
const { Spot, Image, Review, Reservation, User } = require("../../db/models");
/*--------------------------------------------------------------------*/
// GET SINGLE SPOT
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const spot = await Spot.findByPk(req.params.id, {
      include: [Image, Review, Reservation, User],
    });
    if (spot) {
      return res.json(spot);
    }
    console.log("Spot in API", spot, " SpotId", spot.id);
  })
);
// GET ALL SPOTS
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const spots = await Spot.findAll({
      include: [Image, Review, User, Reservation],
    });

    console.log("Spots in API", JSON.stringify(spots, null, 4));
    return res.json(spots);
  })
);
// CREATE NEW SPOT
router.post(
  "/",
  singleMulterUpload("image"),
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const {
      type,
      name,
      title,
      pets,
      totalOccupancy,
      totalBedrooms,
      totalBathrooms,
      description,
      hasWifi,
      hasTV,
      hasAC,
      hasHeat,
      price,
      postedAt,
      coordinates,
      hostId,
    } = req.body;
    // const { spot } = req.body;
    const newSpot = {
      type,
      name,
      title,
      pets,
      totalOccupancy,
      totalBedrooms,
      totalBathrooms,
      description,
      hasWifi,
      hasTV,
      hasAC,
      hasHeat,
      price,
      postedAt,
      coordinates,
      hostId,
    };
    const createdSpot = await Spot.create(newSpot);
    if (createdSpot) {
      const imageUrl = await singlePublicFileUpload(req.file);
      const newImage = await Image.create({
        url: imageUrl,
        spotId: createdSpot.id,
      });
      return res.json({ createdSpot, newImage });
    } else {
      return res.json({ message: "Failed" });
    }
  })
);
// UPDATE SPOT
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log("<><><><><><><><><><><><><>", req.body);
    console.log(req.body);
    const {
      type,
      name,
      title,
      pets,
      totalOccupancy,
      totalBedrooms,
      totalBathrooms,
      description,
      hasWifi,
      hasTV,
      hasAC,
      hasHeat,
      price,
      postedAt,
      coordinates,
      hostId,
    } = req.body;
    // const { spot } = req.body;
    const spotToUpdate = {
      type,
      name,
      title,
      pets,
      totalOccupancy,
      totalBedrooms,
      totalBathrooms,
      description,
      hasWifi,
      hasTV,
      hasAC,
      hasHeat,
      price,
      postedAt,
      coordinates,
      hostId,
    };
    // TODO: Update Spot
    // const newImage = await Image.findByPk(req.file);
    const spot = await Spot.findByPk(req.params.id);
    const updatedSpot = await spot.update(spotToUpdate);
    // return res.json({ spot });
    console.log({ updatedSpot });
    return res.json({ updatedSpot });
  })
);
// DELETE SPOT
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Image.destroy({ where: { spotId: req.params.id } });
    await Review.destroy({ where: { spotId: req.params.id } });
    await Reservation.destroy({ where: { spotId: req.params.id } });
    const destroyed = await Spot.destroy({ where: { id: req.params.id } });
    if (destroyed) {
      return res.json({ message: "Destroyed" });
    } else {
      return res.json({ message: "Failed" });
    }
  })
);
module.exports = router;
