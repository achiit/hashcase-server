import fs from 'fs'

import pinataSDK, { PinataPinOptions } from '@pinata/sdk'

import logger from '../../utils/logger'

const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT!
})

const uploadImageFromFile = async (path: string) => {
  const readableStreamForFile = fs.createReadStream(path)
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: Date.now.toString()
    },
    pinataOptions: {
      cidVersion: 0
    }
  }
  const res = await pinata.pinFileToIPFS(readableStreamForFile, options)
  fs.unlink(path, error => {
    logger.error(error)
  })
  return res
}

const uploadMetadata = async (data: object) => {
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: Date.now.toString()
    },
    pinataOptions: {
      cidVersion: 0
    }
  }
  const res = await pinata.pinJSONToIPFS(data, options)
  return res
}

export { uploadImageFromFile, uploadMetadata }
