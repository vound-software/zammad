// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { redirectToError } from '@mobile/router/error'
import type { GraphQLHandlerError } from '@shared/types/error'
import { ErrorStatusCodes, GraphQLErrorTypes } from '@shared/types/error'
import { useRouter } from 'vue-router'

interface ErrorMessages {
  notFound?: string
  forbidden?: string
}

export const useErrorHandler = () => {
  const router = useRouter()

  const createQueryErrorHandler = (messages: ErrorMessages) => {
    return (errorHandler: GraphQLHandlerError) => {
      let title: string
      let message: string | undefined
      let messagePlaceholder: string[] = []
      let statusCode: number

      if (errorHandler.type === GraphQLErrorTypes.RecordNotFound) {
        title = __('Not found')
        message = messages.notFound
        statusCode = ErrorStatusCodes.NotFound
      } else if (errorHandler.type === GraphQLErrorTypes.Forbidden) {
        title = __('Forbidden')
        message = messages.forbidden
        statusCode = ErrorStatusCodes.Forbidden
      } else if (errorHandler.type !== GraphQLErrorTypes.NotAuthorized) {
        title = __('Internal Error')
        message = errorHandler.message
          ? __("We're sorry, but something went wrong. Received message: %s")
          : __("We're sorry, but something went wrong.")
        messagePlaceholder = errorHandler.message ? [errorHandler.message] : []
        statusCode = ErrorStatusCodes.InternalError
      } else {
        return true
      }
      redirectToError(router, {
        title,
        message,
        messagePlaceholder,
        statusCode,
      })
      // don't show the notification
      return false
    }
  }

  return {
    createQueryErrorHandler,
  }
}
