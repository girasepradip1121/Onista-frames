const Request = require("../Models/contactUsModel");

const createrequest = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // ✅ Debugging ke liye

    const { name, email, message} = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = await Request.create({ name, email, message });

    return res.status(201).json(newRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create request" });
  }
};

const getrequest = async (req, res) => {
  try {
    const allrequest = await Request.findAll();
    res.status(200).json(allrequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get request" });
  }
};

const deleteRequest=async(req,res)=>{
    try {
        const {contactId}=req.params;
        const request=await Request.findOne({where:{contactId}})
        if(!request) return res.status(400).json({message:"Request not found"})

        await request.destroy()
        res.status(200).json("request deleted successully")
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete request" });
    }
}

module.exports = { createrequest ,getrequest,deleteRequest};
