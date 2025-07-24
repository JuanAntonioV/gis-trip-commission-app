import { onlyNumber } from '@/lib/utils';
import InputError from '../input-error';
import { Input } from './input';
import { Label } from './label';

type Props = {
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    placeholder?: string;
    errors?: string;
} & React.ComponentProps<'input'>;

const NumberInput = ({ value, onChange, label, placeholder, errors, ...props }: Props) => {
    return (
        <div className="grid gap-2">
            <Label htmlFor="email">{label}</Label>

            <Input
                type="text"
                className="mt-1 block w-full"
                value={value}
                onInput={onlyNumber}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                {...props}
            />

            <InputError className="mt-2" message={errors} />
        </div>
    );
};
export default NumberInput;
