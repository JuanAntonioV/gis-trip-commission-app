import { ReactNode } from 'react';

type Props = {
    label: string;
    value: string | number | ReactNode;
};
const LabelItem = ({ label, value }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            {typeof value === 'string' || typeof value === 'number' ? <p className="text-base font-semibold">{value}</p> : value}
        </div>
    );
};
export default LabelItem;
