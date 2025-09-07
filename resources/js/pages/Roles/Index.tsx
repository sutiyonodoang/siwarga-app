import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Settings } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ProtectedPage } from '@/components/protected-page';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  permissions_count: number;
  users_count: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  roles: {
    id: number;
    name: string;
    display_name: string;
  }[];
}

interface Props {
  roles: Role[];
}

export default function RolesIndex({ roles }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>(roles);
  const [loading, setLoading] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState<{[key: number]: string}>({});

  const loadUsersWithRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users-with-roles');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: number, roleId: string) => {
    try {
      await router.post('/roles/assign-to-user', {
        user_id: userId,
        role_id: roleId,
      });
      // Reload users after assignment
      loadUsersWithRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      await router.post('/roles/remove-from-user', {
        user_id: userId,
        role_id: roleId,
      });
      // Reload users after removal
      loadUsersWithRoles();
    } catch (error) {
      console.error('Error removing role:', error);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'operator':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'viewer':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Load users when component mounts or when switching to user management tab
  const handleTabChange = (value: string) => {
    if (value === 'user-roles' && users.length === 0) {
      loadUsersWithRoles();
    }
  };

  return (
    <ProtectedPage permission="user_edit">
      <AppLayout
        breadcrumbs={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Kelola Role', href: '/roles' }
        ]}
      >
        <Head title="Role Management" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Role Management
            </h1>
            <p className="text-gray-600">Kelola role dan permission user</p>
          </div>
        </div>

        <Tabs defaultValue="roles" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger 
              value="roles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="user-roles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              User Role Assignment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roles.map((role, index) => (
                <Card 
                  key={role.id} 
                  className={`p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    index === 0 ? 'ring-2 ring-red-200 bg-gradient-to-br from-red-50 to-pink-50' :
                    index === 1 ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50' :
                    'ring-2 ring-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getRoleBadgeColor(role.name)} font-medium shadow-sm`}>
                      {role.display_name}
                    </Badge>
                    <div className={`p-2 rounded-full ${
                      index === 0 ? 'bg-red-100' :
                      index === 1 ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <Shield className={`h-5 w-5 ${
                        index === 0 ? 'text-red-500' :
                        index === 1 ? 'text-blue-500' :
                        'text-green-500'
                      }`} />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{role.display_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{role.description}</p>
                  
                  <div className="space-y-3">
                    <div className={`flex justify-between text-sm p-2 rounded-lg ${
                      index === 0 ? 'bg-red-50' :
                      index === 1 ? 'bg-blue-50' :
                      'bg-green-50'
                    }`}>
                      <span className="text-gray-600">Permissions:</span>
                      <span className={`font-bold ${
                        index === 0 ? 'text-red-600' :
                        index === 1 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>{role.permissions_count}</span>
                    </div>
                    <div className={`flex justify-between text-sm p-2 rounded-lg ${
                      index === 0 ? 'bg-red-50' :
                      index === 1 ? 'bg-blue-50' :
                      'bg-green-50'
                    }`}>
                      <span className="text-gray-600">Users:</span>
                      <span className={`font-bold ${
                        index === 0 ? 'text-red-600' :
                        index === 1 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>{role.users_count}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="user-roles" className="space-y-6 mt-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">User Role Assignment</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold text-gray-700">User</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Current Roles</TableHead>
                        <TableHead className="font-semibold text-gray-700">Assign Role</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow 
                          key={user.id} 
                          className={`hover:bg-gradient-to-r ${
                            index % 2 === 0 
                              ? 'bg-white hover:from-blue-50 hover:to-purple-50' 
                              : 'bg-gray-50/50 hover:from-purple-50 hover:to-blue-50'
                          } transition-all duration-200`}
                        >
                          <TableCell className="font-medium text-gray-800">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'enabled' ? 'default' : 'secondary'}
                              className={user.status === 'enabled' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }
                            >
                              {user.status === 'enabled' ? '✓ Active' : '✗ Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {user.roles.map((role) => (
                                <Badge 
                                  key={role.id} 
                                  className={`${getRoleBadgeColor(role.name)} shadow-sm`}
                                >
                                  {role.display_name}
                                </Badge>
                              ))}
                              {user.roles.length === 0 && (
                                <span className="text-gray-400 text-sm italic bg-gray-100 px-2 py-1 rounded">No roles assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={selectedUserRole[user.id] || ''}
                              onValueChange={(value) => {
                                setSelectedUserRole({
                                  ...selectedUserRole,
                                  [user.id]: value
                                });
                              }}
                            >
                              <SelectTrigger className="w-40 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 shadow-lg">
                                {availableRoles.map((role) => (
                                  <SelectItem 
                                    key={role.id} 
                                    value={role.id.toString()}
                                    className="hover:bg-blue-50 focus:bg-blue-50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        role.name === 'admin' ? 'bg-red-400' :
                                        role.name === 'operator' ? 'bg-blue-400' :
                                        'bg-green-400'
                                      }`}></div>
                                      {role.display_name}
                                    </div>
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const roleId = selectedUserRole[user.id];
                                if (roleId) {
                                  handleAssignRole(user.id, roleId);
                                }
                              }}
                              disabled={!selectedUserRole[user.id]}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ✓ Assign
                            </Button>
                            {user.roles.length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Remove the first role (you might want to make this more specific)
                                  if (user.roles[0]) {
                                    handleRemoveRole(user.id, user.roles[0].id);
                                  }
                                }}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium shadow-sm"
                              >
                                ✗ Remove
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              )}
              
              {users.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <Users className="h-16 w-16 text-gray-300 mx-auto" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-30 blur-xl"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
                  <p className="text-gray-500 mb-6">Get started by loading users to manage their roles</p>
                  <Button 
                    onClick={loadUsersWithRoles}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Load Users
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
    </ProtectedPage>
  );
}
