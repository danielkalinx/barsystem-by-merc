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
        <Button size="lg" className="rounded-full px-6">
          Neue Sitzung eröffnen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-3xl border-border/70 bg-card/90 backdrop-blur">
        <DialogHeader>
          <DialogTitle>Neue Sitzung eröffnen</DialogTitle>
          <DialogDescription>
            Wähle mindestens einen Schankwart aus, um die Sitzung zu starten.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="mb-3 block text-sm font-medium">
            Schankwarte auswählen (min. 1)
          </Label>
          <ScrollArea className="h-80 rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="space-y-3">
              {members.map((member) => {
                const rank = typeof member.rank === 'object' ? member.rank : null
                const colors = rank?.colors || []

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-card/80 px-4 py-3 transition hover:border-border/60 hover:bg-background/60"
                  >
                    <Checkbox
                      id={`bartender-${member.id}`}
                      checked={selectedBartenders.has(member.id)}
                      onCheckedChange={() => handleBartenderToggle(member.id)}
                    />
                    <Label
                      htmlFor={`bartender-${member.id}`}
                      className="flex flex-1 cursor-pointer items-center gap-3 text-sm"
                    >
                      {colors.length === 3 && (
                        <div className="flex h-3 w-8 overflow-hidden rounded-full border border-border/60">
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

          {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="rounded-full"
          >
            Abbrechen
          </Button>
          <Button onClick={handleCreateSession} disabled={isLoading} className="rounded-full">
            {isLoading ? 'Wird erstellt...' : 'Sitzung aktivieren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
