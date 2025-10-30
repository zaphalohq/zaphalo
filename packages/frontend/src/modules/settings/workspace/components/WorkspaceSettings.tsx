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
import { useWorkspaceUser } from "@src/modules/settings/users/hooks/useWorkspaceUser";
import { GET_WORKSPACE_USER_INFO } from '@src/modules/settings/users/graphql/queries/getWorkspaceUserInfo';
import { UPDATE_ROLE } from '@src/modules/settings/users/graphql/mutations/updateRoleMutation';
import InviteUserInline from './InviteUserInline';
import { Textarea } from "@components/UI/textarea"
import { Switch } from "@components/UI/switch"
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { UPDATE_WORKSPACE_DETAIL } from '@src/modules/settings/workspace/graphql/mutations/workspaceMutation'


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))


function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U"
}

function onChangeUserRole(){
    const {data: workspaceData, loading: userLoading} = useQuery(GET_WORKSPACE_USER_INFO);
  alert("hello");
}

type Workspace = {
  id: string
  name: string
  slug: string
  description?: string
  defaultRole: Role
  allowJoinByInviteLink: boolean
  inviteLink: string
  whatsappBusinessNumber?: string
  autoUseApprovedTemplates: boolean
}

const WorkspaceSettings = () => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [saving, setSaving] = useState(false)

  // Delete workspace
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const canDelete = workspace && confirmName === workspace.name

  const {data: workspaceData, loading: userLoading} = useQuery(GET_WORKSPACE_USER_INFO);
  
  const [updateWorkspaceDetail, { data, loading, error }] = useMutation(UPDATE_WORKSPACE_DETAIL)
  const currentWorkspace = useRecoilValue(currentUserWorkspaceState);


  async function onSaveWorkspace(e: React.FormEvent) {
    e.preventDefault()
    if (!workspace) return
    setSaving(true)
    const response = await updateWorkspaceDetail({
      variables: {workspaceName: workspace.name},
    });
    setSaving(false)
    alert("Workspace settings saved")
  }


  useEffect(() => {
    let mounted = true;
    setWorkspace({name: currentWorkspace.name})

    return () => {
      mounted = false
    }
  }, [workspaceData]);

  return (
    <form onSubmit={onSaveWorkspace}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>General configuration and WhatsApp options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Workspace Name</Label>
              <Input value={workspace?.name} onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={currentWorkspace?.slug} onChange={(e) => setWorkspace({ ...workspace, slug: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={currentWorkspace?.description || ""} onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Default Role for new members</Label>
              <Select value={workspace?.defaultRole} onValueChange={(v) => setWorkspace({ ...workspace, defaultRole: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>WhatsApp Business Number</Label>
              <Input value={workspace?.whatsappBusinessNumber || ""} onChange={(e) => setWorkspace({ ...workspace, whatsappBusinessNumber: e.target.value })} placeholder="e.g. +91 98765 43210" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Allow join via invite link</div>
                <div className="text-sm text-muted-foreground">Anyone with the link can request to join.</div>
              </div>
              <Switch checked={workspace?.allowJoinByInviteLink} onCheckedChange={(v) => setWorkspace({ ...workspace, allowJoinByInviteLink: v })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">Auto-use approved WhatsApp templates</div>
                <div className="text-sm text-muted-foreground">Prefer pre-approved templates to reduce failures.</div>
              </div>
              <Switch checked={workspace?.autoUseApprovedTemplates} onCheckedChange={(v) => setWorkspace({ ...workspace, autoUseApprovedTemplates: v })} />
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-amber-50 text-amber-900 flex gap-2">
            <AlertTriangle className="h-4 w-4 mt-1"/>
            <p className="text-sm">Ensure your WhatsApp Business Account is verified and your message templates are compliant with Meta policies to avoid delivery issues.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}


export default WorkspaceSettings;