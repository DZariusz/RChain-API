/* ISSUE: move test data to .json file for use from python etc.? */
/* eslint-disable object-curly-newline */
/* eslint-disable object-curly-newline */

const Suite = require('testjs');

const RHOCore = require('../RHOCore');

function testRHOCore() {
  Suite.run({
    null: rtest({
      data: null, rholang: 'Nil', rho: {}, hex: '',
    }),
    string: rtest({
      data: 'Bob',
      rholang: '"Bob"',
      hex: '2a051a03426f62',
      rho: { exprs: [{ g_string: 'Bob', expr_instance: 'g_string' }] },
    }),
    number: rtest({
      data: 123,
      hex: '2a0310f601',
      rho: { exprs: [{ g_int: 123, expr_instance: 'g_int' }] },
      rholang: '123',
    }),
    'list of scalars': rtest({
      data: [true, 123, 'abc'],
      rholang: '[true, 123, "abc"]',
      hex: '2a19a201160a042a0208010a052a0310f6010a072a051a03616263',
      rho: {
        exprs: [{
          expr_instance: 'e_list_body',
          e_list_body: {
            ps: [
              { exprs: [{ g_bool: true, expr_instance: 'g_bool' }] },
              { exprs: [{ g_int: 123, expr_instance: 'g_int' }] },
              { exprs: [{ g_string: 'abc', expr_instance: 'g_string' }] },
            ],
          },
        }],
      },
    }),
    object: rtest({
      data: { x: 'abc' },
      rholang: '@"x"!("abc")',
      hex: '0a120a070a052a031a017812072a051a03616263',
      rho: {
        sends: [
          {
            chan: { quote: { exprs: [{ g_string: 'x', expr_instance: 'g_string' }] } },
            data: [{ exprs: [{ g_string: 'abc', expr_instance: 'g_string' }] }],
          },
        ],
      },
    }),
    'nested object': rtest({
      data: { x: 'abc', y: { a: true } },
      rholang: '@"x"!("abc") | @"y"!(@"a"!(true))',
      hex: '0a120a070a052a031a017812072a051a036162630a1c0a070a052a031a017912110a0f0a070a052a031a016112042a020801',
      rho: {
        sends: [
          {
            chan: { quote: { exprs: [{ g_string: 'x', expr_instance: 'g_string' }] } },
            data: [{ exprs: [{ g_string: 'abc', expr_instance: 'g_string' }] }],
          },
          {
            chan: { quote: { exprs: [{ g_string: 'y', expr_instance: 'g_string' }] } },
            data: [
              {
                sends: [
                  {
                    chan: { quote: { exprs: [{ g_string: 'a', expr_instance: 'g_string' }] } },
                    data: [{ exprs: [{ g_bool: true, expr_instance: 'g_bool' }] }],
                  },
                ],
              }],
          }],
      },
    }),
    'trust vote': rtest({
      data: ['merge', 'trust_cert',
        {
          voter: 'dckc', subject: 'a1', rating: 1, cert_time: '2018-07-29T02:00:21.259Z',
        }],
      rholang: '["merge", "trust_cert", @"cert_time"!("2018-07-29T02:00:21.259Z") | @"rating"!(1) | @"subject"!("a1") | @"voter"!("dckc")]',
      hex: '2a9a01a20196010a092a071a056d657267650a0e2a0c1a0a74727573745f636572740a790a2f0a0f0a0d2a0b1a09636572745f74696d65121c2a1a1a18323031382d30372d32395430323a30303a32312e3235395a0a140a0c0a0a2a081a06726174696e6712042a0210020a170a0d0a0b2a091a077375626a65637412062a041a0261310a170a0b0a092a071a05766f74657212082a061a0464636b63',
      rho: {
        exprs: [{
          expr_instance: 'e_list_body',
          e_list_body: {
            ps: [
              { exprs: [{ g_string: 'merge', expr_instance: 'g_string' }] },
              { exprs: [{ g_string: 'trust_cert', expr_instance: 'g_string' }] },
              {
                sends: [
                  {
                    chan: { quote: { exprs: [{ g_string: 'cert_time', expr_instance: 'g_string' }] } },
                    data: [{ exprs: [{ g_string: '2018-07-29T02:00:21.259Z', expr_instance: 'g_string' }] }],
                  },
                  {
                    chan: { quote: { exprs: [{ g_string: 'rating', expr_instance: 'g_string' }] } },
                    data: [{ exprs: [{ g_int: 1, expr_instance: 'g_int' }] }],
                  },
                  {
                    chan: { quote: { exprs: [{ g_string: 'subject', expr_instance: 'g_string' }] } },
                    data: [{ exprs: [{ g_string: 'a1', expr_instance: 'g_string' }] }],
                  },
                  {
                    chan: { quote: { exprs: [{ g_string: 'voter', expr_instance: 'g_string' }] } },
                    data: [{ exprs: [{ g_string: 'dckc', expr_instance: 'g_string' }] }],
                  }],
              }],
          },
        }],
      },
    }),
  });

  function rtest(item) {
    return (test) => {
      test.deepEqual(RHOCore.fromJSData(item.data), item.rho);
      test.deepEqual(RHOCore.toJSData(item.rho), item.data);
      test.deepEqual(RHOCore.toRholang(item.rho), item.rholang);
      test.deepEqual(RHOCore.toByteArray(item.rho).toString('hex'), item.hex);

      test.done();
    };
  }
}

testRHOCore();
