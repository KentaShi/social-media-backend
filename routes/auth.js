const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { bulkSave } = require("../models/User");


//register
router.post("/register", async (req, res) => {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {

        //save user and respond
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            !validPassword && res.status(400).json("Wrong password...")

            res.status(200).json(user);
        }
        else return res.status(404).json("User not exist!!!");
    } catch (err) {
        return res.status(500).json(err);
    }

})

module.exports = router;