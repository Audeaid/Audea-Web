import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string,
  signatureVersion: 'v4',
})

export default s3
