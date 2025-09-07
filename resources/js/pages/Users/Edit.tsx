import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    status: 'enabled' | 'disabled';
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
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
            title: `Edit ${user.name}`,
            href: `/users/${user.id}/edit`,
        },
    ];
    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        status: user.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pengguna - ${user.name}`} />

            <div className="py-6">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/users">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <CardTitle>Edit Pengguna - {user.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan alamat email"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Baru (Opsional)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah password"
                                    />
                                    <InputError message={errors.password} />
                                    <p className="text-sm text-muted-foreground">
                                        Kosongkan jika tidak ingin mengubah password
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password baru"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'enabled' | 'disabled') => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="enabled">Aktif</SelectItem>
                                            <SelectItem value="disabled">Non-aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/users">Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Update'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
