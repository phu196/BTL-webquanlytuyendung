const Chat = require("../models/Chat");
const sendMessage = async (req,res,io)=>{
    try {
      // Xác minh người gửi hợp lệ
      // if (senderType === 'User' && !req.body.userID) {
      //   return res.status(400).json({ success: false, message: 'User ID is required for User senderType' });
      // }
      // if (senderType === 'Company' && !req.body.companyID) {
      //   return res.status(400).json({ success: false, message: 'Company ID is required for Company senderType' });
      // }

      const chat = new Chat({
        senderType: req.body.senderType,
        userID: req.body.userID,
        companyID: req.body.companyID,
        content: req.body.content,
        roomID: req.body.roomID,
      });
      await chat.save();
      if (io) {
        io.to(req.body.roomID).emit('receiveMessage', {
          senderType: chat.senderType,
          userID: chat.userID,
          companyID: chat.companyID,
          content: chat.content,
          roomID: chat.roomID,
          createdAt: chat.createdAt,
        });
      }
      //res.redirect(`/chat/${req.body.roomID}`);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
};
const getMessage = async(req,res)=>{
    const { roomID } = req.params;
    var isCompany = false;
    if (req.company){
        isCompany = true;
    }
    if (req.user && !req.company) {
        isCompany = false;
    }
  try {
    const messages = await Chat.find({ roomID })
      .populate('userID', 'username') 
      .populate('companyID', 'companyName') 
      .sort({ createdAt: 1 });
        res.render("chat",{messages,roomID,isCompany});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
}
const index = async (req, res) => {
    
}
const createRoom = async (req, res) => {
  var userID, companyID, senderType, content;
  if (req.company){
    companyID = req.company._id;
    userID = req.body.id;
    senderType = "Company";
    content = "Xin chào tôi là đai diện phía công ty liên hệ với bạn";
  }
  else if (req.user){
    userID = req.user._id;
    companyID = req.body.id;
    senderType = "User";
    content = "Xin chào tôi là ứng viên liên hệ với công ty";
  }
  const roomID = `${userID}-${companyID}`;
  const chat = new Chat({
    senderType: senderType,
    userID: userID,
    companyID: companyID,
    content: content,
    roomID: roomID,
  });
  console.log(chat);
  await chat.save();
  res.redirect(`/chat/${roomID}`);  
}
module.exports = { sendMessage, getMessage, index ,createRoom};