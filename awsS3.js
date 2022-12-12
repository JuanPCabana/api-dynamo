const  {S3} = require('aws-sdk')

exports.s3Uploadv2 = async (file, keyName)=>{
  const s3 = new S3()

  const param = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${keyName}`,
    Body: file.buffer
  }
  const result = await s3.upload(param).promise()
  return result

}