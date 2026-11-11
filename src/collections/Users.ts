import type { CollectionConfig } from 'payload'

const ownRAProfile = ({ req }: { req: { user?: { collection?: string; id?: string } | null } }) =>
  req.user?.collection === 'users' && req.user.id ? { id: { equals: req.user.id } } : false

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    hidden: true,
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: ownRAProfile,
    update: ownRAProfile,
    delete: () => false,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const email = String(data?.email ?? '')
          .trim()
          .toLowerCase()
        if (!email.endsWith('@stanford.edu')) {
          throw new Error('Please use your Stanford email address.')
        }

        const existing = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        })
        if (existing.totalDocs >= 6) {
          throw new Error('All six RA accounts have already been claimed.')
        }

        return { ...data, email }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [{ label: 'Residential Assistant', value: 'ra' }],
      defaultValue: 'ra',
      required: true,
      access: {
        create: () => false,
        update: () => false,
      },
    },
  ],
  versions: false,
}
