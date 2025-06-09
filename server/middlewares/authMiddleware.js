import {clerkClient} from "@clerk/express"
import Course from "../models/Course.js";
import { Clerk } from "@clerk/clerk-sdk-node";
// middlewarte (protect educator routes)

export const protectEducator = async (req,res,next)=>{
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)
        if(response.publicMetadata.role!='educator'){
            return res.json({success:false,message:"unauthorized access"})
        }
        next()
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const verifyAdmin = (req, res, next) => {
  const clerkUserId = req.headers["x-clerk-user-id"];

  if (!clerkUserId) {
    return res.status(401).json({ success: false, message: "No user ID provided" });
  }

  if (clerkUserId !== process.env.ADMIN_USER_ID) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }

  next();
};



const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

export const verifyEducatorOrAdmin = async (req, res, next) => {
  const userId = req.headers["x-clerk-user-id"];
  const courseId = req.params.id;

  try {
    const user = await clerk.users.getUser(userId);
    const role = user.publicMetadata?.role;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const isEducator = course.educator?.toString() === userId;
    const isAdmin = role === "admin";

    if (!isEducator && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Authorization error" });
  }
};
