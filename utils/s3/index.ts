import AWS from 'aws-sdk'
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from '../constant'

const s3 = new AWS.S3({
  region: 'us-east-1',
  accessKeyId: AWS_ACCESS_KEY_ID as string,
  secretAccessKey: AWS_ACCESS_KEY_SECRET as string,
  signatureVersion: 'v4',
})

export default s3
