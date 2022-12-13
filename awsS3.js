const { S3 } = require('aws-sdk')

exports.s3Uploadv2 = async (file, keyName) => {
  const s3 = new S3()

  const param = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${keyName}`,
    Body: file.buffer
  }
  const result = await s3.upload(param).promise()
  return result

}

exports.s3MultiUploadv2 = async (files) => {
  const s3 = new S3()


  const params = files.map((file, idx) => {
    var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    var fileName = Date.now() + `${idx}` + extension
    return {
      Bucket: process.env.BUCKET_NAME,
      Key: `${fileName}`,
      Body: file.buffer
    }
  })

  return await Promise.all(params.map((param) => s3.upload(param).promise()))

}