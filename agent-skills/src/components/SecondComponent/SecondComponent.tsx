import styles from './SecondComponent.module.css';

export interface SecondComponentProps {
  /** Additional class name applied to the root element. */
  className?: string;
  /** Heading text for the component. */
  title: string;
  /** Optional count rendered beneath the title. */
  count?: number;
  /** Called when the component is selected. */
  onSelect: (id: string) => void;
}

export function SecondComponent({
  className,
  title,
  count,
  onSelect,
}: SecondComponentProps) {
  return (
    <div
      className={
        className
          ? `${styles.secondComponent} ${className}`
          : styles.secondComponent
      }
    >
      <h2>{title}</h2>
      {count !== undefined && <p>{count}</p>}
      <button type="button" onClick={() => onSelect('second-component')}>
        Select
      </button>
    </div>
  );
}