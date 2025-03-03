// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { defaultTicket } from '@mobile/pages/ticket/__tests__/mocks/detail-view'
import type { TicketArticle } from '@shared/entities/ticket/types'
import { convertToGraphQLId } from '@shared/graphql/utils'
import { getTestPlugins } from '@tests/support/components/renderComponent'
import { renderComponent } from '@tests/support/components'
import { TICKET_INFORMATION_SYMBOL } from '@mobile/pages/ticket/composable/useTicketInformation'
import ArticlesList from '../ArticlesList.vue'

it('renders delivery messages', () => {
  const { ticket } = defaultTicket()
  const articles: TicketArticle[] = [
    {
      __typename: 'TicketArticle',
      id: convertToGraphQLId('TicketArticle', 1),
      internal: false,
      internalId: 1,
      contentType: 'text/html',
      bodyWithUrls:
        "Unable to send tweet: Can't find ticket.preferences[channel_id'] for Ticket.find(2)",
      createdAt: '2021-09-01T12:00:00.000Z',
      preferences: {
        delivery_message: true,
      },
      attachmentsWithoutInline: [],
      author: {
        __typename: 'User',
        id: convertToGraphQLId('User', 1),
      },
    },
  ]

  const view = renderComponent(ArticlesList, {
    props: {
      ticket,
      articles,
      totalCount: 1,
    },
    global: {
      plugins: [
        ...getTestPlugins(),
        (app) => {
          app.provide(TICKET_INFORMATION_SYMBOL, {})
        },
      ],
    },
  })

  expect(view.container).toHaveTextContent('Delivery failed')
  expect(view.container).toHaveTextContent(articles[0].bodyWithUrls)
  expect(view.getByIconName('mobile-warning')).toBeInTheDocument()
})
