const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// Get All Genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

// Aşağıdaki fonksiyonda ilk parametre rroute, ikincisi optional olarak middleware
// üçüncisi ise gerçek fonksiyondur. Burada biz auth middleware'ini ekledik. Bu middleware
// asıl fonksiyondan ÖNCE işletilecek.
// Create Genre
router.post("/", auth, async (req, res) => {
  // mantık aşağıdaki gibi ama bunu bir middleware fonksiyonuna
  // atamak daha mantıklı olur
  // const token = req.header("x-auth-token");
  // if(!valid) res.status(401).send("Unauthorized access!");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save(); //result db'e kaydedilen dökümandır. id bilgisini geri dönelim...

  res.status(200).send(genre);
});

// Update Genre
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true } //update edilmiş veriyi geri döndür...
  );

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

// Delete Genre by ID
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

// Find Genre by ID
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;