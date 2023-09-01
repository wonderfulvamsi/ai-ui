import aws from 'aws-sdk'

const region = "ap-south-1"
const bucketName = "ai-doodle-classifier"
const accessKeyId = "AKIAZPSHAPPYKW4RKASK"
const secretAccessKey = "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"

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL(file) {
  const params = ({
    Bucket: bucketName,
    Key: file.name,
    Body: file
  })
  
  const uploadURL = await s3.upload(params).promise()
  return uploadURL
}