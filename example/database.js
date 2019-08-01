"use strict"

const Categories = [
  {
    id: 'emb',
    title: 'Embedded Programming',
    courses: [
      'c-01', 'c-02'
    ]
  }
]

const Courses = [
  {
    id: 'c-01',
    title: 'Beginning Embedded C Programming',
    snippet: 'C Programming for beginner, good for one who want to learn about C and Embedded Programming',
    description: 'c01.json',
    thumbnail: 'https://cdn-images-1.medium.com/max/1200/1*z8cxJptPtl2JEERdYXChkQ.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    level: 'Beginner',
    price: 499,
    skills: [
      'C Programming'
    ],
    certificates: [
      'Embedded C Programmer'
    ],
    promo: [
      {type: 'sale', deduction: 100, description: 'on sale program', expireIn: '1564444799000'} // expired = (new Date(Date.UTC(2019,7,1,23,59,59))).getTime()
    ],
    categories: ['emb'],
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
    description: 'c02.json',
    thumbnail: 'https://harmonyed.com/wp-content/uploads/Online-Courses-1-300x20031.png',
    picture: {
      type: "yt",
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    price: 799,
    level: 'Intermidate',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certificates: [
      'Embedded Programming Engineer'
    ],
    promo: [
      {type: 'sale', deduction: 100, description: 'on sale program'},
      {type: 'gift', description: '+ 1 board STM32 Discovery F0'}
    ],
    categories: ['emb'],
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
      uri: "https://www.youtube.com/embed/tpIctyqH29Q"
    },
    price: 799,
    level: 'Advanced',
    skills: [
      'C Programming', 'ARM Programming'
    ],
    certificates: [
      'Embedded Programming Engineer'
    ],
    promo: [
      
    ],
    categories: ['emb'],
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

module.exports = {
  Category: {
    find({id}, projection, done) {
      if ({}.toString.call(projection) === '[object Function]') {
        done= projection
      }
      setTimeout(() => {
        const category = Categories.find( cat => cat.id === id)
        if (category) {
          if ({}.toString.call(projection) === '[object Array]') {
            const _ret = {}
            projection.forEach( prop => _ret[prop] = category[prop] )
            done && done([_ret]) 
          } else {
            done && done([category])
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
        const courses = Courses.filter( course => id.indexOf(course.id) !== -1 )
        if (courses.length > 0) {
          if ({}.toString.call(projection) === '[object Array]') {
            const _ret = courses.map( course => {
              const __ret = {}
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
  }
}