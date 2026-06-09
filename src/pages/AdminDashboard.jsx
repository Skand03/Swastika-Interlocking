import React from 'react';
import AdminShell from '../components/admin/AdminShell';
import AdminRoutes from '../routes/adminRoutes';

export default function AdminDashboard() {
  return (
    <AdminShell>
      <AdminRoutes />
    </AdminShell>
  );
}
