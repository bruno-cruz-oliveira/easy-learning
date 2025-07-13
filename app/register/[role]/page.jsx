import React from 'react';
import { SignupForm } from './../_components/SignupForm';

const RegisterPage = ({ params: {role} }) => {
    return (
        <div className='w-full flex-col h-screen flex items-center justify-center'>
            <div className='container mx-auto'>
                <SignupForm role={role} />
            </div>
        </div>
    );
};

export default RegisterPage;