import Image from 'next/image'
import type { Member } from '@/payload-types'

interface UserAvatarProps {
  user: Member
}

export function UserAvatar({ user }: UserAvatarProps) {
  const profilePicture = user.profilePicture
  const hasProfilePicture =
    profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture

  const initials = user.couleurname
    ? user.couleurname.substring(0, 2).toUpperCase()
    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

  const rank = typeof user.rank === 'object' ? user.rank : null
  const colors = rank?.colors || []

  return (
    <div className="relative size-8 overflow-clip rounded-full border border-border">
      {hasProfilePicture ? (
        <Image
          src={profilePicture.url || ''}
          alt={`${user.couleurname || 'User'} avatar`}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {initials}
        </div>
      )}

      {colors.length === 3 && (
        <div className="absolute bottom-0 flex w-8 -rotate-45 flex-col">
          {colors.map((colorObj, idx) => (
            <div
              key={idx}
              className="h-0.5 w-12"
              style={{
                backgroundColor: typeof colorObj === 'object' ? colorObj.color : colorObj,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
