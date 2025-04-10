export const clerkWebhooks = async (req, res) => {
    try {
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  
      const payload = req.body; // still raw buffer
      const headers = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      };
  
      const evt = whook.verify(payload, headers); // This throws if invalid
  
      const { data, type } = evt;
  
      switch (type) {
        case "user.created": {
          const userData = {
            _id: data.id,
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url, // fix naming
          };
          await User.create(userData);
          break;
        }
  
        case "user.updated": {
          const updatedData = {
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
          };
          await User.findByIdAndUpdate(data.id, updatedData);
          break;
        }
  
        case "user.deleted": {
          await User.findByIdAndDelete(data.id);
          break;
        }
  
        default:
          break;
      }
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  