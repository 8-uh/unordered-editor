import React from 'react'

export default class TextTransformer {
  static transform (rows) {
    return rows.map((i, index) => {
      if (i.endsWith('\n')) {
        return (
          <span key={index}>
            {i.slice(0, -1).split(' ').map((i, index, arr) =>
              <span key={index * 2}>
                {i}
                {index !== arr.length - 1 && <span className='space'>·</span>}
              </span>
            )}
            <span className='enter'>¬</span>
          </span>
        )
      } else {
        return (
          <span key={index}>
            {i.split(' ').map((i, index, arr) =>
              <span key={index * 2}>
                {i}
                {index !== arr.length - 1 && <span className='space'>·</span>}
              </span>
            )}
          </span>
        )
      }
    })
  }
}
