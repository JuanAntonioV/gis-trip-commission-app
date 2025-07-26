import InputError from '../input-error';
import { Label } from './label';
import { Textarea } from './textarea';

type Props = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    errors?: string;
} & React.ComponentProps<'textarea'>;

const TextareaInput = ({ value, onChange, label, placeholder, errors, ...props }: Props) => {
    return (
        <div className="grid gap-2">
            <Label >{label}</Label>

            <Textarea
                className="mt-1 block w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                {...props}
            />

            <InputError className="mt-2" message={errors} />
        </div>
    );
};
export default TextareaInput;
