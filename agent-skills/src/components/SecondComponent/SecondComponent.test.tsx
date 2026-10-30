import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecondComponent } from './SecondComponent';

const defaultProps = {
  title: 'Second component',
  onSelect: vi.fn(),
};

describe('SecondComponent', () => {
  it('renders without crashing', () => {
    render(<SecondComponent {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: defaultProps.title })
    ).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<SecondComponent {...defaultProps} title="Custom title" />);
    expect(
      screen.getByRole('heading', { name: 'Custom title' })
    ).toBeInTheDocument();
  });

  it('renders the count when provided', () => {
    render(<SecondComponent {...defaultProps} count={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render a count when omitted', () => {
    render(<SecondComponent {...defaultProps} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onSelect with the component id when selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<SecondComponent {...defaultProps} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Select' }));

    expect(onSelect).toHaveBeenCalledWith('second-component');
  });

  it('applies a custom className to the root element', () => {
    const { container } = render(
      <SecondComponent {...defaultProps} className="custom" />
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});