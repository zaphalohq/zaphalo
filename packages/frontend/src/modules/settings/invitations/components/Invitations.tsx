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
import { GET_WORKSPACE_INVITATION_INFO } from '@src/modules/settings/invitations/graphql/queries/getWorkspaceInvitationInfo';
import { sendInvitationMutation, deleteWorkspaceInvitationMutation } from '@src/modules/settings/invitations/graphql/mutations/sendInvitationMutation'


function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}


const Invitations = () => {

	  // Invite form state
  const [invites, setInvites] = useState<Invite[]>([])

  const {data: invitationData, refetch: invitationRefetch, loading: userLoading} = useQuery(GET_WORKSPACE_INVITATION_INFO);
  const [deleteInvitation, { data, loading, error }] = useMutation(deleteWorkspaceInvitationMutation)

  useEffect(() => {
    let mounted = true;
    const invitation_data = []
    invitationData?.findWorkspaceInvitations?.forEach((invite) => {
      invitation_data.push( {
        id: invite.id,
        email: invite.email,
        sentAt: invite.expiresAt,
        token: invite.token,
        role: 'admin',
        status: "pending",
      },)
    })
    setInvites(invitation_data)

    return () => {
      mounted = false
    }
  }, [invitationData, invitationRefetch])

  const onRevokeInvite = async (appTokenId: string) => {
    if (!appTokenId) return alert("App Token not found.");
    const response = await deleteInvitation({
      variables: {appTokenId: appTokenId},
    });
    invitationRefetch();
  }

	return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>View, copy, resend or revoke invites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <div className="text-sm text-muted-foreground">No pending invites.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell><Badge variant="secondary">{inv.role}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(inv.sentAt)}</TableCell>
                  <TableCell>
                    {inv.status === "pending" && <Badge>Pending</Badge>}
                    {inv.status === "revoked" && <Badge variant="destructive">Revoked</Badge>}
                    {inv.status === "accepted" && <Badge variant="secondary">Accepted</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      {/*<Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(inv.link)}>
                        <Copy className="h-4 w-4 mr-1"/> Link
                      </Button>
                      <Button variant="outline" size="sm" disabled={inv.status !== "pending"} onClick={() => onResendInvite(inv.token)}>
                        Resend
                      </Button>*/}
                      <Button variant="ghost" size="sm" className="text-red-600" disabled={inv.status !== "pending"} onClick={() => onRevokeInvite(inv.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
};


export default Invitations;