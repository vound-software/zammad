// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { type Ref, onMounted, watch } from 'vue'
import type { FormFieldContext } from '../types/field'
import type { SelectOption } from '../fields/FieldSelect'
import type { FlatSelectOption } from '../fields/FieldTreeSelect'
import useValue from './useValue'

const useSelectPreselect = (
  options: Ref<SelectOption[] | FlatSelectOption[]>,
  context: Ref<
    FormFieldContext<{
      clearable?: boolean
      multiple?: boolean
    }>
  >,
) => {
  const { hasValue } = useValue(context)

  // Consider only enabled options.
  const getPreselectValue = () =>
    options.value?.find((option) => !option.disabled)?.value

  // Remember function to use it during the next value check.
  context.value.getPreselectValue = getPreselectValue

  // Pre-select the first option of a single select when and only when the field is not clearable nor disabled.
  //   This mimics the behavior of the native select field.
  const preselectOption = () => {
    if (
      !hasValue.value &&
      !context.value.disabled &&
      !context.value.multiple &&
      !context.value.clearable &&
      options.value &&
      options.value.length > 0
    ) {
      context.value.node.input(getPreselectValue(), false)
    }
  }

  onMounted(() => {
    preselectOption()

    watch(
      () =>
        !hasValue.value &&
        !context.value.disabled &&
        !context.value.multiple &&
        !context.value.clearable &&
        options.value,
      preselectOption,
    )
  })
}

export default useSelectPreselect
