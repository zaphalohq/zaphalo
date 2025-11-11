import React, { useEffect, useMemo, useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@components/UI/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@components/UI/card"
import { Button } from "@components/UI/button"
import { Input } from "@components/UI/input"
import { Label } from "@components/UI/label"
import { Textarea } from "@components/UI/textarea"
import { Badge } from "@components/UI/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@components/UI/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@components/UI/dropdown-menu"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@components/UI/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/UI/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/UI/select"
import { Switch } from "@components/UI/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/UI/tooltip";
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import UsersSettings from "@src/modules/settings/users/components/UserSettings";
import Invitations from "@src/modules/settings/invitations/components/Invitations";
import InviteUserButton from "@src/modules/settings/invitations/components/InviteUserButton";
import CopyInviteLinkButton from "@src/modules/settings/invitations/components/CopyInvitationLink";

import WorkspaceSettings from "@src/modules/settings/workspace/components/WorkspaceSettings";
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import { VITE_BACKEND_URL } from '@src/config';
import { GetDashboardStats } from "@src/generated/graphql"
import { useQuery } from "@apollo/client"


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------



function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U"
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function WorkspaceAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState<User[]>([])


  // Search/filter users
  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All")
  const currentWorkspace = useRecoilValue(currentUserWorkspaceState);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQ = !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase())
      const matchRole = roleFilter === "All" || u.role === roleFilter
      return matchQ && matchRole
    })
  }, [users, q, roleFilter])

  const { data, refetch } = useQuery(GetDashboardStats, {})
  const kpisData = useMemo(() => {
    return data?.getDashboardStats || null;
  }, [data?.getDashboardStats]);

  useEffect(() => {
    let mounted = true
      ; (async () => {

        if (!mounted) return

        setLoading(false)
      })()
    return () => {
      mounted = false
    }
  }, [])



  async function onDeleteWorkspace() {
    if (!workspace) return
    alert("Workspace deleted. Redirecting…")
    // window.location.href = "/app" // uncomment in real app
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading workspace…
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspace Admin</h1>
          <p className="text-sm text-muted-foreground">Manage users, invites and settings for WhatsApp campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <InviteUserButton />
          <CopyInviteLinkButton link={currentWorkspace?.inviteToken} />

          <Button variant="destructive" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete Workspace
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" /> Users</TabsTrigger>
          <TabsTrigger value="invites"><Mail className="mr-2 h-4 w-4" /> Invitations</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
          <TabsTrigger value="broadcasts"><MessageSquare className="mr-2 h-4 w-4" /> Broadcasts</TabsTrigger>
        </TabsList>

        {/* Users */}
        <TabsContent value="users" className="space-y-4">
          <UsersSettings />
        </TabsContent>

        {/* Invitations */}
        <TabsContent value="invites" className="space-y-4">
          <Invitations />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <WorkspaceSettings />
        </TabsContent>

        {/* Broadcasts (placeholder KPIs) */}
        <TabsContent value="broadcasts">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast KPIs</CardTitle>
              <CardDescription>Quick snapshot of recent campaign performance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <KpiCard label="Messages Sent" value={kpisData?.sentCount} className="bg-green-100" />
              <KpiCard label="Delivered" value={kpisData?.deliveredCount} className="bg-blue-100" />
              <KpiCard label="Failed" value={kpisData?.failedCount} className="bg-red-100" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Workspace Dialog */}
      {/*<Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This action <span className="font-semibold">cannot</span> be undone. This will permanently delete the workspace and all related data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Type <span className="font-semibold">{workspace.name}</span> to confirm.</p>
            <Input placeholder={workspace.name} value={confirmName} onChange={(e) => setConfirmName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={!canDelete} onClick={onDeleteWorkspace}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>*/}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Small sub-components
// -----------------------------------------------------------------------------



function KpiCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-lg p-4 text-center ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
