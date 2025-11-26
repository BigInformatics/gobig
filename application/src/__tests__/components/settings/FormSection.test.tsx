import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSection } from '@/components/settings/FormSection';
import { Provider } from '@/components/ui/provider';

describe('FormSection Component', () => {
  it('should render title correctly', () => {
    render(
      <Provider>
        <FormSection title="Test Section">
          <div>Child content</div>
        </FormSection>
      </Provider>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <Provider>
        <FormSection title="Test Section" description="This is a test description">
          <div>Child content</div>
        </FormSection>
      </Provider>
    );

    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const { container } = render(
      <Provider>
        <FormSection title="Test Section">
          <div>Child content</div>
        </FormSection>
      </Provider>
    );

    const description = container.querySelector('text[color="fg.muted"]');
    expect(description).not.toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Provider>
        <FormSection title="Test Section">
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
        </FormSection>
      </Provider>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('should render multiple children in a stack', () => {
    render(
      <Provider>
        <FormSection title="Test Section">
          <input type="text" data-testid="input-1" />
          <input type="text" data-testid="input-2" />
          <button data-testid="button">Submit</button>
        </FormSection>
      </Provider>
    );

    expect(screen.getByTestId('input-1')).toBeInTheDocument();
    expect(screen.getByTestId('input-2')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });
});

