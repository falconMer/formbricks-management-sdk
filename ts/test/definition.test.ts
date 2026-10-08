import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "organization",
    "accessor": "Organization",
    "op": "list",
    "method": "GET",
    "path": "/organizations",
    "args": [],
    "select": {
      "filter": "v1",
      "page": "v1",
      "query": "v1"
    },
    "headers": [],
    "query": [
      "query",
      "page",
      "filter"
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "number_of_results": 1,
      "items": [
        {
          "domains": [
            "x"
          ],
          "id": "x",
          "locations": [
            {}
          ],
          "names": [
            {
              "lang": "x",
              "types": [
                "x"
              ],
              "value": "x"
            }
          ],
          "status": "x",
          "types": [
            "x"
          ]
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "organization",
    "accessor": "Organization",
    "op": "load",
    "method": "GET",
    "path": "/organizations/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "x",
      "status": "x",
      "names": [
        {
          "lang": "x",
          "types": [
            "x"
          ],
          "value": "x"
        }
      ],
      "types": [
        "x"
      ],
      "domains": [
        "x"
      ],
      "locations": [
        {}
      ]
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
