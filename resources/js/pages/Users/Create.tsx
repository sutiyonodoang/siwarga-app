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

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    status: 'enabled' | 'disabled';
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
    {
        title: 'Tambah Data',
        href: '/users/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 'enabled',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna Baru" />

            <div className="py-6">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 shadow-xl">
                        <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-200 dark:border-blue-700">
                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                <Link href="/users">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Tambah Pengguna Baru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan alamat email"
                                        className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan password"
                                        className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                        className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-medium">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'enabled' | 'disabled') => setData('status', value)}
                                    >
                                        <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors">
                                            <SelectValue placeholder="Pilih status pengguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="enabled">Aktif</SelectItem>
                                            <SelectItem value="disabled">Non-aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" className="hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md" asChild>
                                        <Link href="/users">Batal</Link>
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
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
