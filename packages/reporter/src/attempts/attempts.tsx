import cs from 'classnames'
import _ from 'lodash'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import { AttemptModel } from './attempt-model'
import { Expandable, ExpandableProps } from '../collapsible/expandable'
import { indentPadding } from '../lib/util'

// TODO:
// - handle scrollIntoView
// - use model.isOpen for expandable?
// - does NoCommands work properly?

const NoCommands = () => (
  <div className='no-commands'>
    No commands were issued in this test.
  </div>
)

interface AttemptProps {
  model: AttemptModel
  style: React.CSSProperties
  expandableProps: ExpandableProps
  // scrollIntoView: Function
}

export const Attempt = observer(({ model, style, expandableProps }: AttemptProps) => {
  useEffect(() => {
    // scrollIntoView()

    const disposeAutorun = autorun(() => {
      model.test.hasMultipleAttempts
      model.hasCommands
      model.state
      model.index
      model.commands.length

      requestAnimationFrame(() => {
        expandableProps.measure()
      })
    })

    return () => {
      disposeAutorun()
    }
  }, [true])

  // QUESTION: is this still necessary? can it be done without a hack?
  // HACK: causes component update when command log is added
  model.commands.length

  return (
    <div
      className={cs('attempt', `runnable-state-${model.test.state}`, `attempt-state-${model.state}`, {
        'show': model.test.hasMultipleAttempts && model.hasCommands,
      })}
      style={indentPadding(style, model.test.level)}
    >
      <div className='attempt-header'>
        <Expandable expandableProps={expandableProps}>
          <div className='attempt-tag'>
            <div className='open-close-indicator'>
              <i className='fa fa-fw fa-angle-up' />
              <i className='fa fa-fw fa-angle-down' />
            </div>
            Attempt {model.index + 1}
            <i className="attempt-state fa fa-fw" />
          </div>
        </Expandable>
      </div>
      {!model.hasCommands && <NoCommands />}
    </div>
  )
})
