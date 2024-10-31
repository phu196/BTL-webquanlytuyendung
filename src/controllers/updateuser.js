const User = require('../models/User');



exports.updateUser = async (req, res) => {

    try {

        const { id } = req.params; // User ID from the request parameters

        

        // Filter to allow only specific fields to be updated

        const allowedFields = ['fullname', 'gender', 'phone', 'address'];

        const updateData = Object.keys(req.body)

            .filter(key => allowedFields.includes(key))

            .reduce((obj, key) => {

                obj[key] = req.body[key];

                return obj;

            }, {});



        // Update user in the database

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        

        if (!updatedUser) {

            return res.status(404).json({ message: "User not found" });

        }



        // Optionally, omit sensitive fields

        const { password, refreshToken, ...safeUser } = updatedUser._doc; // Exclude password and refresh token



        res.status(200).json(safeUser);

    } catch (error) {

        res.status(500).json({ message: "Error updating user information", error: error.message });

    }

};