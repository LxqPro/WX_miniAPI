// 云函数入口文件
//npm install --save wx-server-sdk@lastest
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("Posts").doc(event._id).update({
      data: {
        comments: db.command.push(event.commentObj)
      }
    })
  } catch (e) {
    console.error(e)
  }
}