const router = require('express').Router();
const User = require('../models/User');

// Create User
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get All Users + Filter/Search
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { userId: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        const users = await User.find(query);
        res.json(users);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Update User
router.put('/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json(err); }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;