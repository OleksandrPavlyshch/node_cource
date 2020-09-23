const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer  = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload image'))
        }
        cb(null, true)
    },
});
const { sendWelcomEmail, sendCancelationEmail } = require("../emails/accounts");

const sharp = require('sharp')

router.post("/users/me/avatar", auth, upload.single("avatar"),  async (req, res) => {
    const buffer = await sharp(req.user.avatar).resize({width: 200, height: 200}).png().toBuffer()
    req.user.avatar = buffer
        await req.user.save()
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({
            error: error.message
        })
    }
);

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        console.log(error, "user err");
        res.status(400).send()
    }
})

router.post('/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens.filter(token => token !== req.token);
        req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.get("/users/", auth, async (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
});

module.exports = router
