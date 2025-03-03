// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { visitView } from '@tests/support/components/visitView'
import { mockPermissions } from '@tests/support/mock-permissions'
import { mockTicketOverviews } from '@tests/support/mocks/ticket-overviews'
import { waitFor } from '@testing-library/vue'

describe('testing quick action', () => {
  beforeEach(() => {
    mockTicketOverviews()
  })

  it('ticket create quick action is present', async () => {
    mockPermissions(['ticket.agent'])

    const view = await visitView('/')

    expect(view.getByLabelText('Create new ticket')).toBeInTheDocument()

    await view.events.click(view.getByLabelText('Create new ticket'))

    await waitFor(() => {
      expect(view.queryByText('Create Ticket')).toBeInTheDocument()
    })
  })
})
