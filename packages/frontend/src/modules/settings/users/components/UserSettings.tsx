import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@components/UI/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/UI/select"

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@components/UI/table"
import { Badge } from "@components/UI/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@components/UI/dropdown-menu"
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react"
import { Input } from "@components/UI/input"
import { Label } from "@components/UI/label"
import { Button } from "@components/UI/button"
import { Avatar, AvatarImage, AvatarFallback } from "@components/UI/avatar"
import { GET_WORKSPACE_USER_INFO } from '@src/modules/settings/users/graphql/queries/getWorkspaceUserInfo';
import InviteUserInline from './InviteUserInline';
import { useUpdateWorkspaceUserRole } from '@src/modules/settings/users/hooks/useUpdateWorkspaceUserRole';
import { useUpdateUser } from '@src/modules/settings/users/hooks/useUpdateUser';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))


function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U"
}


const UsersSettings = () => {
  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All")
  const [users, setUsers] = useState<User[]>([])

  const {data: workspaceData, refetch: workspaceDataRefetch, loading: userLoading} = useQuery(GET_WORKSPACE_USER_INFO);

  const { updateUserRole, deleteWorkspaceMember, suspendWorkspaceMember } = useUpdateUser();

  const onChangeUserRole = async (userId: string, role: Role) => {
    const response = await updateUserRole({
      userId: userId,
      role: role,
    });
    workspaceDataRefetch();
  }

  const onRemoveUser = async (userId: string) => {
    const response = await deleteWorkspaceMember({
      userId: userId,
    });
    console.log("....................response................", response);
    workspaceDataRefetch();
  }

  const onToggleSuspend = async (userId: string) => {
    const response = await suspendWorkspaceMember({
      userId: userId,
    });
    workspaceDataRefetch();
  }


  useEffect(() => {
    let mounted = true;
    const users = []
    workspaceData?.getWorkspaceMember?.members?.forEach((userMember) => {
      users.push( {
        id: userMember.user.id,
        name: userMember.user.firstName,
        email: userMember.user.email,
        role: userMember.role,
        status: userMember.active ? "active" : "deactive",
      },)
    })
    setUsers(users)

    return () => {
      mounted = false
    }
  }, [workspaceData, workspaceDataRefetch])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQ = !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase())
      const matchRole = roleFilter === "All" || u.role === roleFilter
      return matchQ && matchRole
    })
  }, [users, q, roleFilter])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>User Management</CardTitle>
        <CardDescription>Add, suspend or remove members; change roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Search name or email…" className="w-[260px]" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/*<InviteUserInline/>*/}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id} className={u.status === "suspended" ? "opacity-70" : undefined}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`} />
                      <AvatarFallback>{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Select value={u.role} onValueChange={(v) => onChangeUserRole(u.id, v as Role)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {u.status === "active" ? (
                    <Badge variant="secondary">Active</Badge>
                    ) : (
                    <Badge variant="destructive">Suspended</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {u.status === "active" ? (
                          <DropdownMenuItem onClick={() => onToggleSuspend(u.id, true)}>Suspend</DropdownMenuItem>
                          ) : (
                          <DropdownMenuItem onClick={() => onToggleSuspend(u.id, false)}>Unsuspend</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => onRemoveUser(u.id)}>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    )
}

export default UsersSettings;