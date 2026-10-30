import styles from './FirstComponent.module.css';

export interface FirstComponentProps {
  /** Additional class name applied to the root element. */
  className?: string;
  /** Heading text for the component. */
  title: string;
  /** Supporting copy rendered beneath the title. */
  description: string;
}

export function FirstComponent({
  className,
  title,
  description,
}: FirstComponentProps) {
  return (
    <div
      className={
        className
          ? `${styles.firstComponent} ${className}`
          : styles.firstComponent
      }
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
