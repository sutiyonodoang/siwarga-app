import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button 
                                type="submit" 
                                className="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]" 
                                tabIndex={5}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <TextLink href={route('login')} tabIndex={6} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
