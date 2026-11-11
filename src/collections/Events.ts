import type { Access, CollectionConfig } from 'payload'

const isRA: Access = ({ req }) => req.user?.collection === 'users'
const publicOrStaff: Access = ({ req }) =>
  req.user?.collection === 'users' || req.user?.collection === 'admins'
    ? true
    : { status: { equals: 'published' } }

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Residential Life',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startsAt', 'capacity', 'status'],
  },
  access: {
    create: isRA,
    read: publicOrStaff,
    update: isRA,
    delete: isRA,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          return { ...data, createdBy: req.user.id }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'startsAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endsAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
      max: 500,
    },
    {
      name: 'logistics',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Closed', value: 'closed' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        create: () => false,
        update: () => false,
      },
    },
  ],
  versions: false,
}
