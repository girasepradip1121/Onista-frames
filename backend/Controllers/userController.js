const User = require("../Models/usermodel");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.userId || null, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
};

const signup = async (req, res) => {
  try {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password should required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Email already exists");
      return res.status(409).json({ message: "Email Already Exists" });
    }
    const hashPassword = md5(password);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    res.status(200).json(newUser);
    console.log("User Created");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User Not Registered..." });
    }

    const isPasswordMatch = md5(password) === user.password;
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    const userData = {
      ...user.dataValues,
      token: token,
    };

    await User.update(
      {
        token: token,
      },
      { where: { userId: user.userId } }
    );

    res.status(200).json({ message: "Login Successful", user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password", "token"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params; // <-- change from req.user to req.params
    const { phone, dob, firstName, lastName } = req.body;


    if (!phone && !dob && !firstName && !lastName ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const [updated] = await User.update(updateData, {
      where: { userId },
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password", "token"] },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users data" });
  }
};

module.exports = { signup, login, getUsers, updateProfile,getUserById};
