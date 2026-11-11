import type { Access, CollectionAfterChangeHook, CollectionConfig } from 'payload'

const isRA: Access = ({ req }) => req.user?.collection === 'users'

const serverOwned = {
  create: () => false,
  update: () => false,
}

const scoreHistory = (
  records: Array<{ id: string; status?: string | null; attendance?: string | null }>,
  currentID: string,
) =>
  records.reduce((score, item) => {
    if (item.id === currentID) return score
    if (item.status === 'waitlisted') return score + 2
    if (item.attendance === 'attended') return score - 1
    if (item.attendance === 'no-show') return score - 3
    return score
  }, 0)

const rebalanceQueue: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  if (context.skipQueueRebalance) return doc

  const eventID = typeof doc.event === 'object' ? doc.event.id : doc.event
  const event = await req.payload.findByID({
    collection: 'events',
    id: eventID,
    overrideAccess: true,
  })

  const result = await req.payload.find({
    collection: 'rsvps',
    where: { event: { equals: eventID } },
    limit: 500,
    sort: '-priorityScore,createdAt',
    overrideAccess: true,
  })

  const fixedGoing = result.docs.filter((item) => item.manualOverride && item.status === 'going')
  const automatic = result.docs.filter((item) => !item.manualOverride && item.status !== 'declined')
  const available = Math.max(0, event.capacity - fixedGoing.length)
  let returnedStatus = doc.status

  await Promise.all(
    automatic.map((item, index) => {
      const nextStatus = index < available ? 'going' : 'waitlisted'
      if (item.id === doc.id) returnedStatus = nextStatus
      if (item.status === nextStatus) return Promise.resolve()
      return req.payload.update({
        collection: 'rsvps',
        id: item.id,
        data: { status: nextStatus },
        overrideAccess: true,
        context: { skipQueueRebalance: true },
      })
    }),
  )

  const outcomeChanged =
    operation === 'update' &&
    (previousDoc?.attendance !== doc.attendance || previousDoc?.status !== doc.status)

  if (outcomeChanged && !context.skipPriorityRefresh) {
    const studentHistory = await req.payload.find({
      collection: 'rsvps',
      where: { studentEmail: { equals: doc.studentEmail } },
      limit: 100,
      overrideAccess: true,
    })

    await Promise.all(
      studentHistory.docs.map((item) => {
        const nextScore = scoreHistory(studentHistory.docs, item.id)
        if (item.priorityScore === nextScore) return Promise.resolve()
        return req.payload.update({
          collection: 'rsvps',
          id: item.id,
          data: { priorityScore: nextScore },
          overrideAccess: true,
          context: { skipPriorityRefresh: true },
        })
      }),
    )
  }

  return { ...doc, status: returnedStatus }
}

export const RSVPs: CollectionConfig = {
  slug: 'rsvps',
  admin: {
    group: 'Residential Life',
    useAsTitle: 'studentName',
    defaultColumns: ['studentName', 'studentEmail', 'status', 'priorityScore'],
  },
  access: {
    create: () => true,
    read: isRA,
    update: isRA,
    delete: isRA,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const email = String(data?.studentEmail ?? '')
          .trim()
          .toLowerCase()
        const eventID =
          typeof data?.event === 'object' && data.event
            ? String(data.event.id)
            : String(data?.event ?? '')

        if (!email.endsWith('@stanford.edu')) {
          throw new Error('Please RSVP with a Stanford email address.')
        }
        if (!eventID) throw new Error('This event could not be found.')

        const event = await req.payload.findByID({
          collection: 'events',
          id: eventID,
          overrideAccess: true,
        })
        if (event.status !== 'published') {
          throw new Error('RSVPs are not currently open for this event.')
        }

        const history = await req.payload.find({
          collection: 'rsvps',
          where: {
            and: [{ studentEmail: { equals: email } }, { event: { not_equals: eventID } }],
          },
          limit: 100,
          overrideAccess: true,
        })

        const priorityScore = scoreHistory(history.docs, '')

        return {
          ...data,
          studentEmail: email,
          eventStudentKey: `${eventID}:${email}`,
          priorityScore,
          status: 'waitlisted',
          attendance: 'pending',
          manualOverride: false,
        }
      },
    ],
    afterChange: [rebalanceQueue],
    afterDelete: [
      async ({ doc, req }) =>
        rebalanceQueue({
          doc,
          req,
          context: { skipPriorityRefresh: true },
          operation: 'update',
        } as unknown as Parameters<CollectionAfterChangeHook>[0]),
    ],
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'studentName',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'studentEmail',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'eventStudentKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { hidden: true },
      access: serverOwned,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'waitlisted',
      options: [
        { label: 'Going', value: 'going' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Declined', value: 'declined' },
      ],
      access: { create: () => false },
    },
    {
      name: 'priorityScore',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Higher scores are offered spots first.' },
      access: serverOwned,
    },
    {
      name: 'attendance',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Attended', value: 'attended' },
        { label: 'No show', value: 'no-show' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      access: { create: () => false },
    },
    {
      name: 'manualOverride',
      type: 'checkbox',
      defaultValue: false,
      access: { create: () => false },
      admin: { description: 'Keeps the RA’s final decision during queue rebalancing.' },
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 500,
    },
  ],
  versions: false,
}
