"use strict"

import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { localeString, getDay } from '../../lib/util'

import UnAuthen from './UnAuthen'

function isExpire(timestamp) {
  if (!timestamp) {
    return false
  }
  const now = (new Date()).getTime()
  return (parseInt(now) > parseInt(timestamp))
}

class RewardCard extends PureComponent {
  render() {
    const reward = this.props.reward
    const courses = this.props.courses
    const isExpired = isExpire(reward.expireIn)
    const tagColor = isExpired? 'grey' : 'green'
    const bgColor = isExpired? 'light-grey' : 'sand'
    return (
      <div className={`w3-card w3-padding w3-round w3-${bgColor}`} style={{margin: '32px auto', maxWidth: '920px', position: 'relative'}}>
        <div className={`w3-tag w3-${tagColor} w3-round`} style={{position: 'absolute', top: '-10px'}}> {reward.type} </div>
        <div className="w3-border-bottom w3-border-grey">
          <div className="w3-cell-row">
            <div className = "w3-cell">
              <h4 className={`${isExpired?'w3-text-grey':'w3-text-blue'} bold`}> {reward.code.toUpperCase()} </h4>
            </div>
            <div className = {`w3-cell ${isExpired?'w3-text-grey':'w3-text-green'} bold`} style={{textAlign: 'right'}}>
              -{localeString(reward.value, '.')} {`\u20ab`}
            </div>
          </div>
          {
            reward.expireIn?
              <div className = {`italic ${isExpired?'w3-text-grey':'w3-text-red'}`} style={{marginBottom: '16px'}}> <FormattedMessage id="label.expire_at" /> {getDay(reward.expireIn)} </div>
              : null
          }
        </div>
        <div>
          <p className="w3-text-grey italic w3-small">
            <FormattedMessage id="label.can_be_used_for" />
          </p>
          {
            reward.scope.map( (target, index) => {
              const course = courses.find(course => course.id === target)
              return (
                <div key={index} className="w3-text-grey" style={{margin: '6px 0 6px 6px'}} >
                  <a href={`/course/${target}`} className="w3-hover-blue" style={{padding: '3px', textDecoration: 'none'}} >{course.title} </a>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default class MyRewards extends PureComponent {
  render() {
    if (!this.props.user) { return ( <UnAuthen {...this.props} />) }
    return (
      <div className="w3-container">
      <h3 className="w3-text-blue" style={{maxWidth: '920px'}}> <FormattedMessage id="myrewards.label.title" /> </h3>
      <div className={this.props.isLoadingMe? '': 'w3-hide'}> Loading <i className='fas fa-spinner w3-spin' /> </div>
      {
        this.props.me.rewards.map((reward, index) => (
          <RewardCard key={index} reward = {reward} {...this.props} />
        ))
      }
      </div>
    )
  }
}
