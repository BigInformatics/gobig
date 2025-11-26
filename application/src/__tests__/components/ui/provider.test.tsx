import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from '@/components/ui/provider';

describe('Provider Component', () => {
  it('should render children correctly', () => {
    render(
      <Provider>
        <div>Test Content</div>
      </Provider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should wrap children with Chakra UI provider', () => {
    const { container } = render(
      <Provider>
        <div data-testid="child">Child Content</div>
      </Provider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle multiple children', () => {
    render(
      <Provider>
        <div>First Child</div>
        <div>Second Child</div>
      </Provider>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });
});

