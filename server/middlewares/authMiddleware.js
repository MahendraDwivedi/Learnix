import {clerkClient} from "@clerk/express"

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