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

const InviteUserInline = ({
}: {
}) => {

	  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("Member")
  const [inviteNote, setInviteNote] = useState("")

  async function onInvite() {
    if (!inviteEmail) return alert("Enter an email")
    // const inv = await MockApi.inviteUser(inviteEmail, inviteRole, inviteNote)
    // setInvites([inv, ...invites])
    // setInviteEmail("")
    // setInviteRole("Member")
    // setInviteNote("")
    alert(`Invite sent to ${inviteEmail}`)
  }
    
  
	return (
    <div className="hidden md:flex items-end gap-2">
      <div>
        <Label className="text-xs">Quick invite</Label>
        <div className="flex items-center gap-2">
          <Input placeholder="user@example.com" className="w-[220px]" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Select value={inviteRole} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onInvite}>Invite</Button>
        </div>
      </div>
    </div>
  )
};


export default InviteUserInline;