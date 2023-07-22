import client from '@/utils/graphql'
import { gql } from '@apollo/client'

interface IVotePlatform {
  __typename: 'PlatformVote'
  count: number
}

export const votePlatform = (token: string, platform: string, vote: boolean): Promise<IVotePlatform> => {
  const mutation = gql`
    mutation VotePlatform($platform: PlatformVoteEnum!, $vote: Boolean!) {
      votePlatform(platform: $platform, vote: $vote) {
        count
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, errors } = await client.mutate({
          mutation,
          variables: {
            platform,
            vote,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })

        const response = data.votePlatform as IVotePlatform

        if (errors) {
          reject(errors)
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
