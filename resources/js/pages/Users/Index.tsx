import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ProtectedPage } from '@/components/protected-page';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Eye } from 'lucide-react';
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
    roles?: Array<{
        id: number;
        name: string;
        display_name: string;
    }>;
}

interface PaginatedUsers {
    data: User[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    can: {
        create_users: boolean;
        edit_users: boolean;
        delete_users: boolean;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kelola Pengguna',
        href: '/users',
    },
];

export default function Index({ users, can }: Props) {
    const [confirmDelete, setConfirmDelete] = useState<{
        isOpen: boolean;
        userId: number | null;
        userName: string;
    }>({
        isOpen: false,
        userId: null,
        userName: '',
    });

    const handleDelete = (user: User) => {
        setConfirmDelete({
            isOpen: true,
            userId: user.id,
            userName: user.name,
        });
    };

    const confirmDeleteUser = () => {
        if (confirmDelete.userId) {
            router.delete(`/users/${confirmDelete.userId}`, {
                onSuccess: () => {
                    setConfirmDelete({
                        isOpen: false,
                        userId: null,
                        userName: '',
                    });
                },
            });
        }
    };

    const handleToggleStatus = (user: User) => {
        router.patch(`/users/${user.id}/toggle-status`, {}, {
            onSuccess: () => {
                // Success message will be handled by flash message
            },
        });
    };

    const getStatusBadge = (user: User) => {
        if (user.status === 'enabled') {
            return (
                <Badge 
                    variant="default" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer transition-all duration-200 text-white shadow-md hover:shadow-lg transform hover:scale-105 select-none"
                    onClick={() => handleToggleStatus(user)}
                    title="Klik untuk menonaktifkan user"
                >
                    ✓ Aktif
                </Badge>
            );
        }
        return (
            <Badge 
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 cursor-pointer transition-all duration-200 text-white shadow-md hover:shadow-lg transform hover:scale-105 select-none"
                onClick={() => handleToggleStatus(user)}
                title="Klik untuk mengaktifkan user"
            >
                ✗ Non-aktif
            </Badge>
        );
    };

    return (
        <ProtectedPage permission="user_read">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Kelola Pengguna" />

                <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-200 dark:border-blue-700">
                            <div>
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Kelola Pengguna
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Kelola akun pengguna sistem. Klik pada status untuk mengaktifkan/menonaktifkan user.
                                </p>
                            </div>
                            {can.create_users && (
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" asChild>
                                    <Link href="/users/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Data
                                    </Link>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>
                                                Status 
                                                <span className="block text-xs text-muted-foreground font-normal">
                                                    (Klik untuk ubah)
                                                </span>
                                            </TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Email Verified</TableHead>
                                            <TableHead>Tanggal Dibuat</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    Belum ada data pengguna
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.data.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{getStatusBadge(user)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {user.roles && user.roles.length > 0 ? (
                                                                user.roles.map((role) => (
                                                                    <Badge 
                                                                        key={role.id}
                                                                        variant="outline" 
                                                                        className={
                                                                            role.name === 'admin' 
                                                                                ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-300 shadow-sm hover:shadow-md transition-all duration-200'
                                                                                : role.name === 'operator'
                                                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-300 shadow-sm hover:shadow-md transition-all duration-200'
                                                                                : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm hover:shadow-md transition-all duration-200'
                                                                        }
                                                                    >
                                                                        {role.display_name}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">No role</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email_verified_at ? (
                                                            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm">
                                                                Terverifikasi
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-300 shadow-sm">
                                                                Belum Verifikasi
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                <Link href={`/users/${user.id}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            {can.edit_users && (
                                                                <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                                                    <Link href={`/users/${user.id}/edit`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            {can.delete_users && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(user)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {users.last_page > 1 && (
                                <div className="flex items-center justify-between space-x-2 py-4 border-t border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-b-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Menampilkan {((users.current_page - 1) * users.per_page) + 1} hingga {Math.min(users.current_page * users.per_page, users.total)} dari {users.total} pengguna
                                    </div>
                                    <div className="flex space-x-2">
                                        {users.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={link.active 
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md" 
                                                    : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                }
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDelete.isOpen}
                onCancel={() => setConfirmDelete({ isOpen: false, userId: null, userName: '' })}
                onConfirm={confirmDeleteUser}
                title="Hapus Pengguna"
                description={`Apakah Anda yakin ingin menghapus pengguna "${confirmDelete.userName}"? Tindakan ini tidak dapat dibatalkan.`}
            />
            </AppLayout>
        </ProtectedPage>
    );
}
