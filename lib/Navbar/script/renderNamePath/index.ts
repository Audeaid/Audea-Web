import { Boxes, CreditCard, Download, FileHeart, Settings, User, Video } from 'lucide-react'

export function renderNamePath(pathname: string) {
  switch (pathname) {
    case 'accounts':
      return {
        icon: User,
        name: 'Account settings',
      }

    case 'saved':
      return {
        icon: FileHeart,
        name: 'Saved notes',
      }

    case 'settings':
      return {
        icon: Settings,
        name: 'Workspace settings',
      }

    case 'integrations':
      return {
        icon: Boxes,
        name: 'Manage integrations',
      }

    case 'download':
      return {
        icon: Download,
        name: 'Download app',
      }

    case 'how-audea-works':
      return {
        icon: Video,
        name: 'How to use Audea',
      }

    case 'subscriptions':
      return {
        icon: CreditCard,
        name: 'Manage subscription',
      }

    default:
      return {
        icon: Video,
        name: 'How to use Audea',
      }
  }
}
