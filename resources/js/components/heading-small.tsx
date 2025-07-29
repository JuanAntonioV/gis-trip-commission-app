import { cn } from '@/lib/utils';

type Props = { title: string; description?: string; className?: string };

export default function HeadingSmall({ title, description, className }: Props) {
    return (
        <header className={cn(className)}>
            <h3 className="mb-0.5 text-base font-medium">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
    );
}
