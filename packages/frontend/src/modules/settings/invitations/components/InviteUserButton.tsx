import React, { useEffect, useMemo, useState } from "react";

import { Input } from "@components/UI/input"
import { Label } from "@components/UI/label"
import { Button } from "@components/UI/button"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/UI/select"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/UI/dialog"
import { Textarea } from "@components/UI/textarea"

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
} from "lucide-react";
import { useMutation, useQuery } from '@apollo/client'
import { sendInvitationMutation } from '@src/modules/settings/invitations/graphql/mutations/sendInvitationMutation'


type Role = "Admin" | "Member" | "Viewer"

const InviteUserButton = ({
}: {
}) => {

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("Member")
  const [inviteNote, setInviteNote] = useState("")
  const [sendInvitation, { data, loading, error }] = useMutation(sendInvitationMutation)

  async function onInvite() {
    if (!inviteEmail) return alert("Enter an email")

    const invitation = await sendInvitation({ variables: { emails: [inviteEmail] }});
    invitation.data.sendInvitations.errors.forEach(function (error) {
      alert(error);
      return;
    })
    setInviteEmail("")
    setInviteRole("Member")
    setInviteNote("")
    alert(`Invite sent to ${inviteEmail}`)
  }

	return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2"/> Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user</DialogTitle>
          <DialogDescription>Send an invitation email with a role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="user@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={inviteRole} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue placeholder="Select role"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Message (optional)</Label>
            <Textarea placeholder="Add a note…" value={inviteNote} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onInvite}>Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default InviteUserButton;