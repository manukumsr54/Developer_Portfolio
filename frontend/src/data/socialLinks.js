/**
 * Social / professional links — Centralized source of truth.
 *
 * Strict constraint: Exact URLs provided by user without modification.
 */

export const LINKEDIN_URL =
  'https://www.linkedin.com/in/manu-kumar-500116402?utm_source=share_via&utm_content=profile&utm_medium=member_android'

export const GITHUB_URL = 'https://github.com/manukumsr54'

export const EMAIL_ADDRESS = 'manukumsr54@gmail.com'
export const EMAIL_URL = 'mailto:manukumsr54@gmail.com'

export const PHONE_NUMBER = '9389648140'
export const PHONE_URL = 'tel:9389648140'

export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    url: GITHUB_URL,
    icon: 'Github',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: LINKEDIN_URL,
    icon: 'Linkedin',
  },
  {
    id: 'email',
    label: 'Email',
    url: EMAIL_URL,
    icon: 'Mail',
  },
  {
    id: 'phone',
    label: 'Call',
    url: PHONE_URL,
    icon: 'Phone',
  },
]
