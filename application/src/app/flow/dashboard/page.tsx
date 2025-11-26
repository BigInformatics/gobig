'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  Card,
  HStack,
} from '@chakra-ui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Provider } from '@/components/ui/provider'
import { LogOut, Settings, User } from 'lucide-react'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/flow/dashboard')
    }
  }, [session, isPending, router])

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      router.push('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (isPending) {
    return (
      <Provider>
        <Flex height="full" flex="1" minH="100vh" alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Flex>
      </Provider>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <Provider>
      <Box minH="100vh" bg="bg.surface">
        {/* Header */}
        <Box borderBottomWidth="1px" bg="bg.canvas">
          <Container maxW="7xl" py="4">
            <HStack justify="space-between">
              <Heading size="lg">Dashboard</Heading>
              <HStack gap="4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/settings')}
                  leftIcon={<Settings />}
                >
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  leftIcon={<LogOut />}
                >
                  Sign out
                </Button>
              </HStack>
            </HStack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="7xl" py="8">
          <Stack gap="6">
            {/* Welcome Card */}
            <Card.Root>
              <Card.Body>
                <Stack gap="4">
                  <HStack>
                    {session.user.image ? (
                      <Box
                        as="img"
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width="64px"
                        height="64px"
                        borderRadius="full"
                      />
                    ) : (
                      <Box
                        width="64px"
                        height="64px"
                        borderRadius="full"
                        bg="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <User size={32} />
                      </Box>
                    )}
                    <Stack gap="1">
                      <Heading size="md">
                        Welcome back, {session.user.name || session.user.email}!
                      </Heading>
                      <Text color="fg.muted">
                        {session.user.email}
                      </Text>
                    </Stack>
                  </HStack>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Placeholder Content */}
            <Card.Root>
              <Card.Body>
                <Stack gap="4">
                  <Heading size="md">Getting Started</Heading>
                  <Text color="fg.muted">
                    This is your dashboard. Start building your application by adding features and content here.
                  </Text>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Stack>
        </Container>
      </Box>
    </Provider>
  )
}



