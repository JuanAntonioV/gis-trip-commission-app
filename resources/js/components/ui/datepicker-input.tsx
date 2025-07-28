import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import dayjs from 'dayjs';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import InputError from '../input-error';
import { cn } from '@/lib/utils';

type Props = {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    label?: string;
    placeholder?: string;
    errors?: string;
    wrapperClassName?: string;
};

const DatePickerInput = ({ value, onChange, label, placeholder, errors, wrapperClassName }: Props) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(value);

    const handleDateChange = (date: Date | undefined) => {
        setDate(date);
        onChange(date);
        setOpen(false);
    };

    return (
        <div className={cn("grid gap-2", wrapperClassName)}>
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                        {date ? dayjs(date).format('DD/MM/YYYY') : placeholder || 'Pilih tanggal'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleDateChange} />
                </PopoverContent>
            </Popover>

            <InputError className="mt-2" message={errors} />
        </div>
    );
};
export default DatePickerInput;
