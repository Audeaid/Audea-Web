'use client'

import { createContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react'
import { useSubscription, useQuery, useMutation, gql } from '@apollo/client'
import { useAuth } from '@clerk/nextjs'
import signJwt from '@/utils/jwt'

interface IDarkModeContext {
  darkMode: boolean
  toggleDarkMode: () => void
}

interface IDarkModeProvider {
  children: React.ReactNode
}

const DARK_MODE_SUBSCRIPTION = gql`
  subscription DarkModeSubscription($clerkUserId: String!) {
    darkModeSubscription(clerkUserId: $clerkUserId) {
      darkMode
    }
  }
`

const DARK_MODE_CREATE_NEW_MUTATION = gql`
  mutation CreateNewDarkModePreferences($darkMode: Boolean) {
    createNewDarkModePreferences(darkMode: $darkMode) {
      darkMode
    }
  }
`

const DARK_MODE_UPDATE_MUTATION = gql`
  mutation UpdateDarkModePreferences($darkMode: Boolean!) {
    updateDarkModePreferences(darkMode: $darkMode) {
      darkMode
    }
  }
`

const DARK_MODE_GET_QUERY = gql`
  query GetDarkModePreferences {
    getDarkModePreferences {
      darkMode
    }
  }
`

export const DarkModeContext = createContext<IDarkModeContext | undefined>(undefined)

export const DarkModeProvider: React.FC<IDarkModeProvider> = ({ children }: { children: ReactNode }) => {
  const { userId: clerkUserId } = useAuth()
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [token, setToken] = useState(clerkUserId ? signJwt(clerkUserId) : '')

  useLayoutEffect(() => {
    if (clerkUserId) {
      const token = signJwt(clerkUserId)
      setToken(token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Update local storage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))

    // Update dark mode preferences
    updateDarkModePreferences({ variables: { darkMode: newDarkMode } })
  }

  const [createNewDarkModePreferences] = useMutation(DARK_MODE_CREATE_NEW_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
  const [updateDarkModePreferences] = useMutation(DARK_MODE_UPDATE_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const { data: darkModeSubscription } = useSubscription(DARK_MODE_SUBSCRIPTION, {
    variables: { clerkUserId },
  })

  useEffect(() => {
    if (darkModeSubscription) {
      const { darkMode } = darkModeSubscription.darkModeSubscription

      // Update dark mode value
      setDarkMode(darkMode)
      // Update local storage
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }
  }, [darkModeSubscription])

  const { data } = useQuery(DARK_MODE_GET_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode))
    } else if (data && data.getDarkModePreferences !== null) {
      setDarkMode(data.getDarkModePreferences.darkMode)
    } else {
      createNewDarkModePreferences({ variables: { darkMode: false } })
        .then((response) => {
          const newDarkModeValue = response.data.createNewDarkModePreferences.darkMode

          // Set initial dark mode value from the mutation response
          setDarkMode(newDarkModeValue)
          // Update local storage
          localStorage.setItem('darkMode', JSON.stringify(newDarkModeValue))
        })
        .catch((error) => {
          console.log('Error creating dark mode preferences:', error)
        })
    }
  }, [data, createNewDarkModePreferences])

  useEffect(() => {
    // Update the DOM when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>
}
