'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {props.children}
    </ChakraProvider>
  )
}
