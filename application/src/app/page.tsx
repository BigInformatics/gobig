'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  HStack,
} from '@chakra-ui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Provider } from '@/components/ui/provider'
import { LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react'

export default function Home() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      router.refresh()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <Provider>
      <Flex minH="100vh" direction="column" bg="bg.surface">
        {/* Header */}
        <Box borderBottomWidth="1px" bg="bg.canvas">
          <Container maxW="7xl" py="4">
            <HStack justify="space-between">
              <Heading size="lg">GoBig</Heading>
              {!isPending && (
                <HStack gap="4">
                  {session?.user ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => router.push('/flow/dashboard')}
                        leftIcon={<LayoutDashboard />}
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        leftIcon={<LogOut />}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => router.push('/login')}
                        leftIcon={<LogIn />}
                      >
                        Sign in
                      </Button>
                      <Button
                        onClick={() => router.push('/signup')}
                        leftIcon={<UserPlus />}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </HStack>
              )}
            </HStack>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="7xl" py="20" flex="1">
          <Stack gap="8" alignItems="center" textAlign="center">
            <Heading size="3xl">Welcome to GoBig</Heading>
            <Text fontSize="xl" color="fg.muted" maxW="2xl">
              Foundational framework for building modern web applications with Next.js, Better Auth, and Drizzle ORM.
            </Text>

            {!isPending && (
              <HStack gap="4" mt="8">
                {session?.user ? (
                  <Button
                    size="lg"
                    onClick={() => router.push('/flow/dashboard')}
                    leftIcon={<LayoutDashboard />}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/login')}
                      leftIcon={<LogIn />}
                    >
                      Sign in
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => router.push('/signup')}
                      leftIcon={<UserPlus />}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </HStack>
            )}

            {session?.user && (
              <Box mt="8" p="6" bg="bg.canvas" borderRadius="lg" borderWidth="1px">
                <Stack gap="2">
                  <Text fontWeight="semibold">Signed in as</Text>
                  <Text color="fg.muted">{session.user.email}</Text>
                </Stack>
              </Box>
            )}
          </Stack>
        </Container>
      </Flex>
    </Provider>
  )
}
