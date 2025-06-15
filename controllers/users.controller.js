import { users as usersList } from '../constants.js';

let users = [...usersList];

const getUsers = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: users
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users !!!',
        });
    }
}

const addUser = (req, res) => {
    try {
        const {username, email} = req.body;

        if(!username || !email) {
            return res.status(400).json({
                success: false,
                message: "Both username and email are mandatory."
            });
        }

        const newUser = {
            id: Date.now().toString(),
            name: username,
            email: email
        };

        users.push(newUser);

        return res.status(201).json({
            success: true,
            message: `${newUser.name} got added in the list.`,
            data: newUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add user !!!',
        });
    }
}

export { getUsers, addUser };