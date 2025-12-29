
const users = require("../model/userModel")
const notes = require("../model/notesModel");
const reports = require("../model/reportModel");
var jwt = require("jsonwebtoken")
// to register
exports.registerController = async (req, res) => {

    // destructuring the data from the req body
    const { email, password, username } = req.body
    console.log(username, email, password);

    try {
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            res.status(401).json("this user already exists...")
        }

        else {
            const newUser = new users({
                email, password, username
            })
            // to save to mongoDb
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err);

    }

}

// login
exports.loginController = async (req, res) => {

    const { email, password } = req.body

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                // for generating the token, so that app can identify whther user is logged in or not
                const token = jwt.sign({ email: existingUser.email }, 'secretkey')
                console.log(token);

                res.status(200).json({ existingUser, token })

            }
            else {
                res.status(401).json("password does not match")

            }

        }
        else {
            res.status(404).json("No user found!! Please register first...")

        }
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err);

    }
}

// login google
exports.googleLoginController = async (req, res) => {

    const { email, password, username, profile } = req.body
    console.log(email, password, username, profile);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ email: existingUser.email }, "secretkey")
            res.status(200).json({ existingUser, token })
        }
        else {
            const newUser = new users({
                username,
                email,
                password,
                profile

            })
            await newUser.save()
            const token = jwt.sign({ email: newUser.email }, "secretkey")
            res.status(200).json({ existingUser:newUser, token })
        }
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err);

    }
}

// to get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user; // from JWT middleware

    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json("Failed to fetch profile");
  }
};

// get all users (admin)
exports.getAllUsersController = async (req, res) => {
  try {
    const allUsers = await users.find({ email: { $ne: "admin@gmail.com" } });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete user (admin)
exports.deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await users.findByIdAndDelete(id);
    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

// admin dashboard stats
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await users.countDocuments({
      email: { $ne: "admin@gmail.com" }
    });

    const totalNotes = await notes.countDocuments();

    const pendingReports = await reports.countDocuments({
      status: "pending"
    });

    res.status(200).json({
      totalUsers,
      totalNotes,
      pendingReports
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

