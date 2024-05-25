 
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'User registration failed', error });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = user.generateToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

module.exports = { registerUser, loginUser };
