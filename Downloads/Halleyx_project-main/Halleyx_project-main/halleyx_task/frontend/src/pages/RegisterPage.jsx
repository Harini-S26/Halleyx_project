import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start building smart dashboards for free">
      <RegisterForm />
    </AuthLayout>
  );
}
