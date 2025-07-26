import InputError from './input-error';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Option = {
    value: string;
    label: string;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    errors?: string;
    data: Option[];
} & React.ComponentProps<typeof Select>;

const SelectInput = ({ value, onChange, label, placeholder, errors, data, ...props }: Props) => {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onChange} {...props}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder || 'Pilih salah satu'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="-1" disabled>
                        {placeholder || 'Pilih salah satu'}
                    </SelectItem>
                    {data.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <InputError className="mt-2" message={errors} />
        </div>
    );
};
export default SelectInput;
