"use strict"

import React, { PureComponent } from 'react'

import { localeString, getDay } from '../../lib/util'

import UnAuthen from './UnAuthen'

class RewardCard extends PureComponent {
  render() {
    const reward = this.props.reward
    const courses = this.props.courses
    let tagColor = 'red'
    return (
      <div className="w3-card w3-padding" style={{margin: '32px auto', maxWidth: '920px', position: 'relative'}}>
        <div className={`w3-tag w3-${tagColor}`} style={{position: 'absolute', top: '-10px'}}> {reward.type.toUpperCase()} </div>
        <div className="w3-border-bottom w3-border-grey">
          <div className="w3-cell-row">
            <div className = "w3-cell">
              <h4 className="w3-text-blue bold"> {reward.code} </h4>
            </div>
            <div className = "w3-cell w3-text-green bold" style={{textAlign: 'right'}}>
              -{localeString(reward.value, '.')} {`\u20ab`}
            </div>
          </div>
          {
            reward.expireIn?
              <div className = 'italic w3-text-red' style={{marginBottom: '16px'}}> expire at {getDay(reward.expireIn)} </div>
              : null
          }
        </div>
        <div>
          <p className="w3-text-grey italic w3-small">
            Can be used for
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
    /* comment out: after user singed-in, render will be called. However, rewards are not sync-ed yet, causing a flash screen */
    // if (this.props.me.rewards.length === 0) {
    //   return (
    //     <div className="w3-container"> You have no reward right now </div>
    //   )
    // }
    return (
      <div className="w3-container">
      {
        this.props.me.rewards.map((reward, index) => (
          <RewardCard key={index} reward = {reward} {...this.props} />
        ))
      }
      </div>
    )
  }
}
