import client from '@/utils/graphql'
import { gql } from '@apollo/client'

export interface IGetPlatformVote {
  __typename: 'PlatformVote'
  count: number
}

export function getPlatformVote(token: string, platform: string): Promise<IGetPlatformVote> {
  const query = gql`
    query GetPlatformVote($platform: PlatformVoteEnum!) {
      getPlatformVote(platform: $platform) {
        count
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

        const response = data.getPlatformVote as IGetPlatformVote

        if (errors) {
          reject(errors)
        } else if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      } catch (e) {
        reject(e)
      }
    }

    fetchData()
  })
}
