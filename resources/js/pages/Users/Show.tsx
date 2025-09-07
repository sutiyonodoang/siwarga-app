import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'enabled' | 'disabled';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Kelola Pengguna',
            href: '/users',
        },
        {
            title: `Detail ${user.name}`,
            href: `/users/${user.id}`,
        },
    ];
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
        router.delete(`/users/${user.id}`, {
            onSuccess: () => {
                router.visit('/users');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        if (status === 'enabled') {
            return <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">Aktif</Badge>;
        }
        return <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md">Non-aktif</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pengguna - ${user.name}`} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-200 dark:border-blue-700">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                    <Link href="/users">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Detail Pengguna
                                </CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                    <Link href={`/users/${user.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConfirmDelete(true)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Nama Lengkap
                                    </label>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                                </div>

                                <div className="space-y-2 p-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-200/50 dark:border-indigo-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Email
                                    </label>
                                    <p className="text-lg text-gray-800 dark:text-gray-200">{user.email}</p>
                                </div>

                                <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Status
                                    </label>
                                    <div>{getStatusBadge(user.status)}</div>
                                </div>

                                <div className="space-y-2 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Status Email
                                    </label>
                                    <div>
                                        {user.email_verified_at ? (
                                            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
                                                Terverifikasi pada {new Date(user.email_verified_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-300 shadow-sm">
                                                Belum Terverifikasi
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 p-4 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200/50 dark:border-cyan-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Tanggal Dibuat
                                    </label>
                                    <p className="text-base text-gray-800 dark:text-gray-200">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-2 p-4 bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Terakhir Diupdate
                                    </label>
                                    <p className="text-base text-gray-800 dark:text-gray-200">
                                        {new Date(user.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDelete}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                title="Hapus Pengguna"
                description={`Apakah Anda yakin ingin menghapus pengguna "${user.name}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </AppLayout>
    );
}
