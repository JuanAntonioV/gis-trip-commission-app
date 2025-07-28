import { BadgeAlert } from 'lucide-react';
import DeleteEmployeeButton from '../DeleteEmployeeButton';
import ChangeEmployeePasswordForm from '../forms/ChangeEmployeePasswordForm';
import EditEmployeeForm from '../forms/EditEmployeeForm';
import HeadingSmall from '../heading-small';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';

const EditEmployeeSection = () => {
    return (
        <div className="grid gap-4 xl:grid-flow-col xl:grid-cols-3 xl:grid-rows-2">
            <section className="h-fit section xl:col-span-2 xl:row-span-2">
                <EditEmployeeForm />
            </section>
            <section className="h-fit section">
                <HeadingSmall title="Change Employee Password" description="Use this form to change the employee's password." />
                <Separator className="my-4" />
                <ChangeEmployeePasswordForm />
            </section>
            <section className="h-fit section">
                <HeadingSmall title="Delete Employee" description="This will delete the employee and all their data. This action cannot be undone." />
                <Separator className="my-4" />
                <Alert className="mb-8">
                    <BadgeAlert />
                    <AlertDescription>
                        This action cannot be undone. Please ensure you have backed up any necessary data before proceeding.
                    </AlertDescription>
                </Alert>
                <DeleteEmployeeButton />
            </section>
        </div>
    );
};
export default EditEmployeeSection;
