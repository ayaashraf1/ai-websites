import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FirstComponent } from './FirstComponent';

const defaultProps = {
  title: 'Getting started',
  description: 'A short summary of what this component does.',
};

describe('FirstComponent', () => {
  it('renders without crashing', () => {
    render(<FirstComponent {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: defaultProps.title })
    ).toBeInTheDocument();
  });

  it('renders the title as a heading', () => {
    render(<FirstComponent {...defaultProps} title="Custom title" />);
    expect(
      screen.getByRole('heading', { name: 'Custom title' })
    ).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(
      <FirstComponent {...defaultProps} description="Custom description" />
    );
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('applies a custom className to the root element', () => {
    const { container } = render(
      <FirstComponent {...defaultProps} className="custom" />
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
