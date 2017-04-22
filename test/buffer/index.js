import 'should'

import UnorderedEditorBuffer from '../../src/buffer/index.js'

global.describe('test Buffer', () => {
  const buffer = new UnorderedEditorBuffer()

  global.it('test initBuffer', () => {
    buffer.initBuffer()
    buffer.buffer.should.be.eql([''])

    buffer.initBuffer('')
    buffer.buffer.should.be.eql([''])

    buffer.initBuffer('hello')
    buffer.buffer.should.be.eql(['hello'])

    buffer.initBuffer('hello\n')
    buffer.buffer.should.be.eql(['hello\n', ''])

    buffer.initBuffer('hello\nworld')
    buffer.buffer.should.be.eql(['hello\n', 'world'])

    buffer.initBuffer('hello\nworld\n')
    buffer.buffer.should.be.eql(['hello\n', 'world\n', ''])
  })

  global.it('text _clearText', () => {
    buffer.initBuffer('')
    buffer._clearText(0, 0, 0, 0)
    buffer.buffer.should.be.eql([''])

    buffer.initBuffer('hello')
    buffer._clearText(0, 0, 0, 1)
    buffer.buffer.should.be.eql(['ello'])

    buffer.initBuffer('hello')
    buffer._clearText(0, 0, 0, 5)
    buffer.buffer.should.be.eql([''])

    buffer.initBuffer('hello\n')
    buffer._clearText(0, 0, 0, 5)
    buffer.buffer.should.be.eql(['\n', ''])

    buffer.initBuffer('hello\nworld\ntest')
    buffer._clearText(0, 1, 1, 5)
    buffer.buffer.should.be.eql(['h\n', 'test'])

    buffer.initBuffer('hello\nworld\ntest')
    buffer._clearText(0, 1, 2, 4)
    buffer.buffer.should.be.eql(['h'])

    buffer.initBuffer('hello\nworld\ntest')
    buffer._clearText(1, 0, 2, 4)
    buffer.buffer.should.be.eql(['hello\n', ''])
  })

  global.it('test _insertTextAt', () => {
    buffer.initBuffer('')
    buffer._insertTextAt(0, 0, 'hello')
    buffer.buffer.should.be.eql(['hello'])

    buffer.initBuffer('hlo')
    buffer._insertTextAt(0, 1, 'el')
    buffer.buffer.should.be.eql(['hello'])

    buffer.initBuffer('hello')
    buffer._insertTextAt(0, 5, '\nworld')
    buffer.buffer.should.be.eql(['hello\n', 'world'])

    buffer.initBuffer('helloorld')
    buffer._insertTextAt(0, 5, '\nw')
    buffer.buffer.should.be.eql(['hello\n', 'world'])
  })

  global.it('test setText', () => {
    buffer.initBuffer('')
    buffer.setText(0, 0, 0, 0, 'hello')
    buffer.buffer.should.be.eql(['hello'])

    buffer.initBuffer('hasdfeo')
    buffer.setText(0, 1, 0, 6, 'ell')
    buffer.buffer.should.be.eql(['hello'])

    buffer.initBuffer('hasdfeo1234d')
    buffer.setText(0, 1, 0, 11, 'ello\nworl')
    buffer.buffer.should.be.eql(['hello\n', 'world'])

    buffer.initBuffer('asdf\nasdf\n')
    buffer.setText(0, 0, 1, 5, 'hello\nworld')
    buffer.buffer.should.be.eql(['hello\n', 'world'])
  })
})
