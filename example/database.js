"use strict"

const Order = []

const Promos = [
  {
    id: 'promo-01',
    type: 'sale',
    target: ['c-01'],
    deduction: 100000,
    description: 'on sale program',
    // expireIn: '1564444799000' // expired = (new Date(Date.UTC(2019,7,1,23,59,59))).getTime()
  },
  {
    id: 'promo-02',
    type: 'sale',
    target: ['c-02'],
    deduction: 100000,
    description: 'on sale program',
  },
  {
    id: 'promo-03',
    type: 'gift',
    target: ['c-02'],
    deduction: 0,
    description: '+ 1 board STM32 Discovery F0'
  },
  {
    id: 'promo-04',
    type: 'bundle',
    target: ['c-02', 'c-03'],
    deduction: [
      {target: 'c-02', number: 150000},
      {target: 'c-03', number: 150000},
    ],
    description: 'Bundle Offer: Embedded Advanced bundle'
  }
]

const Tags = [
  {
    courseId: 'c-01',
    label: ['hot']
  },
  {
    courseId: 'c-02',
    label: ['new', 'hot']
  },
]

const Programs = [
  {
    id: 'emb',
    title: 'Embedded System',
    courses: [
      'c-01', 'c-02', 'c-03', 'c-04'
    ]
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    courses: [
      'c-01', 'c-02', 'c-03'
    ]
  },
  {
    id: 'webapp',
    title: 'Web App Development',
    courses: [
      'c-01', 'c-02', 'c-03'
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    courses: [
      'c-01', 'c-02', 'c-03'
    ]
  },
]

const Courses = [
  {
    id: 'c-01',
    title: 'Beginning Embedded C Programming',
    snippet: 'C Programming for beginner, good for one who want to learn about C and Embedded Programming',
    description: '<p>This course is super creazy</p><ul><li>super cool</li><li>super awesome</li></ul>',
    thumbnail: 'https://cdn-images-1.medium.com/max/1200/1*z8cxJptPtl2JEERdYXChkQ.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/yTeFwuDDgDk"
    },
    level: 'Beginner',
    price: 499000,
    skills: [
      'C Programming'
    ],
    certs: [
      'Embedded C Programmer'
    ],
    programs: ['emb'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-01-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-01-f'
      }
    ]
  },
  {
    id: 'c-02',
    title: 'Applied C for Embedded ARM System',
    snippet: 'Advanced C Programming, ARM embedded processor and with pratice on famous STM32 series',
    description: '<p>This course cover bla bla bla about <span class="w3-text-blue">C language use in ARM system</span>. You will gain all matter knowledge of C and bla bla bla.</p> <p>What you will get after this course:</p><ul class="w3-ul"><li class="w3-border-0">Point 1</li><li class="w3-border-0">Point 2</ul>',
    thumbnail: 'https://harmonyed.com/wp-content/uploads/Online-Courses-1-300x20031.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/LVJUmh9ae1Y"
    },
    price: 799000,
    level: 'Intermidate',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certs: [
      'Embedded Programming Engineer'
    ],
    programs: ['emb'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-02-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-02-f'
      }
    ]
  },
  {
    id: 'c-03',
    title: 'Applied C for Embedded Programming in Detail',
    snippet: 'Advanced C Programming, ARM embedded processor and with pratice on famous STM32 series',
    description: 'c02.json',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ4MSngvOcZcc_xlli8B0AuwMJCHIChtTtjt0wPTdwS-Tc8Xsi',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/6R7SiDz8oFw"
    },
    price: 799000,
    level: 'Advanced',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certs: [
      'Embedded Programming Engineer'
    ],
    programs: ['emb'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-02-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-02-f'
      }
    ]
  },
  {
    id: 'c-04',
    title: 'Motor Control: Pratical applied in Embedded System and IoT',
    snippet: 'Study theory of motor control, types and their application in Embedded & IoT. Study through pratical projects',
    description: '<p>This course is super creazy</p><ul><li>super cool</li><li>super awesome</li></ul>',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ4MSngvOcZcc_xlli8B0AuwMJCHIChtTtjt0wPTdwS-Tc8Xsi',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/6R7SiDz8oFw"
    },
    price: 999000,
    level: 'Advanced',
    skills: [
      'C Programming', 'ARM Programming', 'Motor Control'
    ],
    certs: [
      'Embedded Programming Engineer'
    ],
    programs: ['emb'],
    tests: [
      {
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        exam: 'c-02-m'
      },
      {
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        exam: 'c-02-f'
      }
    ]
  }
]


const Enroll = [
  {
    courseId: 'c-01',
    enrolledTo: '4fc9d440-8f7a-11e9-95d5-315e185d3a06',
    enrolledAt: 1564444799000,
    status: 'active', // new, active, studying, completed
    resolvedBy: 'system-automation',
    order: 'iv-001',
    comments: [
      { by: 'system', message: 'automatic enroll'}
    ],
    tests: [
      {
        testId: 'test-01',
        resultId: 'r-test-01',
        title: 'Mid-term Exam',
        description: 'Mid-term Test for course Embedded - 01',
        result: {
          score: 92,
          status: 'passed'
        },
        passScore: 70
      },
      {
        testId: 'test-02',
        resultId: 'r-test-02',
        title: 'Final Exam',
        description: 'Final Test for course Embedded - 01',
        passScore: 70
      }
    ]
  }
]

const User = [
  {
    uid: '4fc9d440-8f7a-11e9-95d5-315e185d3a06',
    vouchers: [
      {code: 'NEWBIE', scope: ['c-02'], value: 100000}
    ]
  }
]

module.exports = {
  Program: {
    find({id}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        if (!id) {
          done && done(Programs)
          return
        }
        const program = Programs.find( prog => prog.id === id)
        if (program) {
          if ({}.toString.call(projection) === '[object Array]') {
            const _ret = {}
            projection.forEach( prop => _ret[prop] = program[prop] )
            done && done([_ret]) 
          } else {
            done && done([program])
          }
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  Course: {
    find({id}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        if ({}.toString.call(id) === '[object String]') {
          id = [id]
        }
        const courses = id ? Courses.filter( course => id.indexOf(course.id) !== -1 ) : Courses
        if (courses.length > 0) {
          if ({}.toString.call(projection) === '[object Array]') {
            const _ret = courses.map( course => {
              const __ret = {id: course.id}
              projection.forEach( prop => __ret[prop] = course[prop] )
              return __ret
            })
            done && done(_ret)
          } else {
            done && done(courses)
          }
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  Promo: {
    find(query, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        if (Promos && Promos.length > 0) {
          done && done(Promos)
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  Tag: {
    find(query, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        if (Tags && Tags.length > 0) {
          done && done(Tags)
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  Order: {
    find({uid}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        const orders = Order.filter( _order => _order.uid === uid)
        if (orders) {
          done && done(orders)
        } else {
          done && done([])
        }
      }, 500)
    },
    insert({ order }, done) {
      setTimeout(() => {
        if (Order.find( _order => _order.uid === order.uid && _order.number === order.number)) {
          done && done('Order: Document exist')
          return
        }
        Order.push(order)
        done && done(null, order)
      }, 2000)
    }
  },
  Enroll: {
    find({courseId, enrolledTo}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        const data = courseId ? Enroll.filter( enroll => enroll.courseId === courseId && enroll.enrolledTo === enrolledTo )
                              : Enroll.filter( enroll => enroll.enrolledTo === enrolledTo )
        if (data.length > 0) {
          let res = {}
          if ({}.toString.call(projection) === '[object Array]') {
            projection.forEach( prop => {
              res[prop] = data[0][prop]
            })
          } else {
            res = {...data[0]}
          }
          done && done([res])
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  User: {
    find({uid}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        const data = User.filter(user => user.uid === uid)
        if (data.length > 0) {
          let res = {}
          if ({}.toString.call(projection) === '[object Array]') {
            projection.forEach( prop => {
              res[prop] = data[0][prop]
            })
          } else {
            res = {...data[0]}
          }
          done && done([res])
        } else {
          done && done([])
        }
      }, 500)
    }
  },
  find(query, done) {
    const data = {}
    const _done = {}
    Object.keys(query).forEach(key => _done[key] = false )
    for (let table in query) {
      this[table].find(query[table].key, query[table].projection, (response) => {
        data[table] = response
        _done[table] = true
        if (Object.keys(_done).every(key => _done[key])) {
          done && done(data)
        }
      })
    }
  }
}
