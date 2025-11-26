'use client'

import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Box>
      <Stack gap="2" mb="6">
        <Heading size="md">{title}</Heading>
        {description && (
          <Text color="fg.muted" textStyle="sm">
            {description}
          </Text>
        )}
      </Stack>
      <Stack gap="4">
        {children}
      </Stack>
    </Box>
  )
}



