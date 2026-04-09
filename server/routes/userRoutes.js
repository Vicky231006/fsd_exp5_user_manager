const router = require('express').Router();
const User = require('../models/User');

// Create User
router.post('/', async (req, res) => {
    try {
        let { userId, name, email, age, hobbies, bio } = req.body;
        
        // Validate required fields
        if (!userId || !name || !email) {
            return res.status(400).json({ error: "userId, name, and email are required" });
        }
        
        // Convert hobbies to array if needed
        if (typeof hobbies === 'string') {
            hobbies = hobbies.split(',').map(h => h.trim()).filter(h => h);
        } else if (!Array.isArray(hobbies)) {
            hobbies = [];
        }
        
        // Convert age to number
        if (age) {
            age = parseInt(age);
        }
        
        const user = new User({ userId, name, email, age, hobbies, bio });
        await user.save();
        res.status(201).json(user);
    } catch (err) { 
        res.status(400).json({ error: err.message }); 
    }
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
        let { name, email, age, hobbies, bio, userId } = req.body;
        
        // Convert hobbies to array if needed
        if (typeof hobbies === 'string') {
            hobbies = hobbies.split(',').map(h => h.trim()).filter(h => h);
        } else if (!Array.isArray(hobbies)) {
            hobbies = [];
        }
        
        // Convert age to number
        if (age) {
            age = parseInt(age);
        }
        
        const updateData = { name, email, age, hobbies, bio };
        if (userId) updateData.userId = userId;
        
        const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
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

router.get('/explain/:field', async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.query;
        
        let query = {};
        query[field] = value;
        
        const explanation = await User.find(query).explain("executionStats");
        res.json({
            query: query,
            executionStats: explanation
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;