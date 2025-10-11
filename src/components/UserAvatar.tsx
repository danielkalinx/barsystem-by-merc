import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Member } from '@/payload-types'

interface UserAvatarProps {
  user: Member
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    container: 'size-8',
    image: 'size-8',
    text: 'text-xs',
    badge: 'size-2.5',
    badgePosition: '-bottom-0.5 -right-0.5',
  },
  md: {
    container: 'size-10',
    image: 'size-10',
    text: 'text-sm',
    badge: 'size-3',
    badgePosition: '-bottom-0.5 -right-0.5',
  },
  lg: {
    container: 'size-12',
    image: 'size-12',
    text: 'text-base',
    badge: 'size-4',
    badgePosition: '-bottom-1 -right-1',
  },
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const profilePicture = user.profilePicture
  const hasProfilePicture =
    profilePicture && typeof profilePicture === 'object' && 'url' in profilePicture

  const initials = user.couleurname
    ? user.couleurname.substring(0, 2).toUpperCase()
    : (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

  const rank = typeof user.rank === 'object' ? user.rank : null
  const colors = rank?.colors || []

  const classes = sizeClasses[size]

  return (
    <div className={cn('relative', classes.container)}>
      <div className={cn('overflow-clip rounded-full border border-border', classes.image)}>
        {hasProfilePicture ? (
          <Image
            src={profilePicture.url || ''}
            alt={`${user.couleurname || 'User'} avatar`}
            width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
            height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
            className={cn('rounded-full object-cover', classes.image)}
          />
        ) : (
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground',
              classes.image,
              classes.text,
            )}
          >
            {initials}
          </div>
        )}
      </div>

      {colors.length === 3 && (
        <div
          className={cn(
            'absolute overflow-clip rounded-full border border-border',
            classes.badge,
            classes.badgePosition,
          )}
        >
          <div className="flex h-full w-full flex-col">
            {colors.map((colorObj, idx) => (
              <div
                key={idx}
                className="h-full w-full"
                style={{
                  backgroundColor: typeof colorObj === 'object' ? colorObj.color : colorObj,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
