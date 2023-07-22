import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface ICheckIfVoted {
  __typename: 'PlatformVoteUser'
  voted: boolean
}

export const checkIfVoted = async (token: string, platform: string): Promise<ICheckIfVoted> => {
  const query = gql`
    query CheckIfAlreadyVotedPlatform($platform: PlatformVoteEnum!) {
      checkIfAlreadyVotedPlatform(platform: $platform) {
        voted
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors, error } = await client.query({
          query,
          variables: {
            platform,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        })

        const response = data.checkIfAlreadyVotedPlatform as ICheckIfVoted

        if (errors) {
          reject(errors)
        } else if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    }

    fetchData()
  })
}
