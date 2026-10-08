
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { RorSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = RorSDK.test()
    equal(testsdk instanceof RorSDK, true,
      'RorSDK.test() must return a client synchronously')
  })

})
