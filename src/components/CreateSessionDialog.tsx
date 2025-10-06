'use client'

import { useState } from 'react'
import { createSession } from '@/app/(frontend)/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Member } from '@/payload-types'

interface CreateSessionDialogProps {
  members: Member[]
}

export function CreateSessionDialog({ members }: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedBartenders, setSelectedBartenders] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBartenderToggle = (memberId: string) => {
    const newSelection = new Set(selectedBartenders)
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId)
    } else {
      newSelection.add(memberId)
    }
    setSelectedBartenders(newSelection)
  }

  const handleCreateSession = async () => {
    if (selectedBartenders.size === 0) {
      setError('Bitte mindestens einen Schankwart auswählen')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await createSession({
      bartenders: Array.from(selectedBartenders).map((memberId) => ({
        memberId,
      })),
    })

    setIsLoading(false)

    if (result.success) {
      setOpen(false)
      setSelectedBartenders(new Set())
      window.location.reload() // Reload to show new session
    } else {
      setError(result.error || 'Fehler beim Erstellen der Sitzung')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Neue Sitzung eröffnen</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Sitzung eröffnen</DialogTitle>
          <DialogDescription>
            Wähle mindestens einen Schankwart aus, um die Sitzung zu starten.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-sm font-medium mb-3 block">
            Schankwarte auswählen (min. 1)
          </Label>
          <ScrollArea className="h-80 border rounded-md p-4">
            <div className="space-y-3">
              {members.map((member) => {
                const rank = typeof member.rank === 'object' ? member.rank : null
                const colors = rank?.colors || []

                return (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`bartender-${member.id}`}
                      checked={selectedBartenders.has(member.id)}
                      onCheckedChange={() => handleBartenderToggle(member.id)}
                    />
                    <Label
                      htmlFor={`bartender-${member.id}`}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      {/* Rank colors flag */}
                      {colors.length === 3 && (
                        <div className="flex h-4 w-8 border border-border overflow-hidden">
                          {colors.map((colorObj, idx) => (
                            <div
                              key={idx}
                              className="flex-1"
                              style={{
                                backgroundColor:
                                  typeof colorObj === 'object' ? colorObj.color : colorObj,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <span className="text-sm">
                        {member.couleurname || `${member.firstName} ${member.lastName}`}
                      </span>
                      {rank && (
                        <span className="text-xs text-muted-foreground">({rank.label})</span>
                      )}
                    </Label>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleCreateSession} disabled={isLoading}>
            {isLoading ? 'Wird erstellt...' : 'Sitzung aktivieren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
